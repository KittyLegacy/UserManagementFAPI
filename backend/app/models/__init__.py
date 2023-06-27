from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import DB_USER, DB_PW, DB_HOSTNAME, DB_PORT, DB_NAME

engine = create_engine(
    f"postgresql+psycopg2://{DB_USER}:{DB_PW}@{DB_HOSTNAME}:{DB_PORT}/{DB_NAME}",
    echo=True,
    pool_size=20,
    max_overflow=0,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()
Base = declarative_base()
