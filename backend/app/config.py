import os

DB_USER = os.environ["DB_USER"]
DB_PW = os.environ["DB_PW"]
DB_HOSTNAME = os.environ["DB_HOSTNAME"]
DB_PORT = os.environ["DB_PORT"]
DB_NAME = os.environ["DB_NAME"]

JWT_SECRET_KEY = "your_secret_key"
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 30