import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from app.models.User import User
from app.config import JWT_SECRET_KEY, JWT_ALGORITHM
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_scheme = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def is_in_role(user: User, roles: list[str]):
    return user.role in roles

def create_access_token(user: User) -> str:
    access_token_expires = timedelta(minutes=60)
    now = datetime.utcnow()
    expire = now + access_token_expires
    to_encode = {"sub": user.email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def authenticate_user(email: str, password: str) -> User:
    user = db.query(User).filter_by(email=email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def get_current_user(token: HTTPAuthorizationCredentials = security_scheme):
    payload = jwt.decode(token.credentials, JWT_SECRET_KEY, algorithms=["HS256"])
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter_by(email=email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user
    
