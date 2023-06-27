from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse
from app.models.User import User
from app.models import db
from app.auth import authenticate_user, create_access_token, get_password_hash, verify_password, get_current_user, is_in_role
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import JWT_SECRET_KEY, JWT_ALGORITHM, DB_NAME
import jwt
from pydantic import BaseModel

router = APIRouter()
security = HTTPBearer()


class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str

@router.post("/register")
def register_user(user_data: UserRegisterRequest):
    """
    Register a user
    """
    name = user_data.name
    email = user_data.email
    password = user_data.password
    hashed_password = get_password_hash(password)
    user = User(name=name, email=email, password=hashed_password, role="viewer")
    db.add(user)
    try:
        db.commit()
    except:
        db.rollback() 
        raise HTTPException(status_code= 422, detail="User Not Registered")
    return {"message": "User registered successfully"}


class UserLoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(user_data: UserLoginRequest):
    """
    User login route
    """
    email = user_data.email
    password = user_data.password
    user = authenticate_user(email, password)
    access_token = create_access_token(user)
    return {"access_token": access_token, "role": user.role}


@router.get("/users")
def get_users(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Fetch all users available in database.
    only returns a response to the logged in user
    """
    current_user = get_current_user(credentials)
    try:
        jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.exceptions.DecodeError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    users = []
    db_users = db.query(User).all()
    for user in db_users:
        users.append(
            {
                "id": user.id, 
                "name": user.name, 
                "email": user.email, 
                "role": user.role, 
                "locked": user.locked,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S"), 
            }
        )

    return JSONResponse(content=users)


@router.get("/users/{id}")
def get_user(id: int, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Fetch a user by id from database.
    only returns a response to admin
    """
    current_user = get_current_user(credentials)
    if not is_in_role(current_user, ["admin"]):
        raise HTTPException(status_code=403, detail="Only admin users can view a user")
    
    db_user = db.query(User).filter_by(id=id).first()
    if db_user:
        user = {
            "name": db_user.name, 
            "email": db_user.email, 
            "role": db_user.role, 
            "locked": db_user.locked,
            "created_at": db_user.created_at.strftime("%Y-%m-%d %H:%M:%S"), 
        }
        return JSONResponse(content=user)
    else:
        raise HTTPException(status_code=404, detail="Not Found")
    

@router.delete("/users/{id}")
def delete_user(id: int, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Delete a user by id from database.
    only admin can delete
    """
    current_user = get_current_user(credentials)
    if not is_in_role(current_user, ["admin"]):
        raise HTTPException(status_code=403, detail="Only admin users can delete a user")
    
    db_user = db.query(User).filter_by(id=id).first()
    if db_user:
        db.delete(db_user)
        try:
            db.commit()
        except:
            db.rollback()
            raise HTTPException(status_code=422, detail="user delete failed")
        return {"message": "user deleted"}
    else:
        raise HTTPException(status_code=404, detail="Not Found")


class UserUpdateRequest(BaseModel):
    id: int = None
    name: str = None
    email: str = None
    password: str = None
    role: str = None
    locked: str = None

@router.put("/users/{id}")
def update_user(id: int,user_data: UserUpdateRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Update a user by id.
    only admin can update
    """
    current_user = get_current_user(credentials)
    if not is_in_role(current_user, ["admin"]):
        raise HTTPException(status_code=403, detail="Only admin users can edit a user")
    
    db_user = db.query(User).filter_by(id=id).first()
    if db_user:
        if user_data.name:
            db_user.name = user_data.name
        if user_data.email:
            db_user.email = user_data.email
        if user_data.password:
            db_user.password = get_password_hash(user_data.password)
        if user_data.role:
            db_user.role = user_data.role
            locked: str = None
        if user_data.locked == "1":
            db_user.locked = True
        elif user_data.locked == "0":
            db_user.locked = False
        try:
            db.commit()
        except:
            db.rollback()
            raise HTTPException(status_code=422, detail="user update failed")
        return {"message": "user updated"}
    else:
        raise HTTPException(status_code=404, detail="Not Found")
    

class UserAddRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str

@router.post("/users")
def add_user(user_data: UserAddRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Add a user to the database.
    only admin can add
    """
    current_user = get_current_user(credentials)
    if not is_in_role(current_user, ["admin"]):
        raise HTTPException(status_code=403, detail="Only admin users can edit a user")
    
    name = user_data.name
    email = user_data.email
    password = user_data.password
    hashed_password = get_password_hash(password)
    role = user_data.role
    user = User(name=name, email=email, password=hashed_password, role=role)
    db.add(user)
    try:
        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=422, detail="user add failed")
    return {"message": "user added", "id": user.id}