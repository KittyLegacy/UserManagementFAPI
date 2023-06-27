from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.models import Base,engine,db
from datetime import datetime

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    locked = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)
