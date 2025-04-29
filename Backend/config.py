import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # 基本配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-change-in-production'
    
    # 数据库配置
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://root:root@localhost/echo_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT配置
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_HEADER_TYPE = 'Bearer'  # 确保使用Bearer作为前缀
    JWT_HEADER_NAME = 'Authorization'
    JWT_TOKEN_LOCATION = ['headers']
    JWT_BLACKLIST_ENABLED = False