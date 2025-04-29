from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

# 初始化扩展
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # 启用CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # 注册蓝图
    from app.routes import main_bp, auth_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # 确保导入模型，使其被SQLAlchemy识别
    from app.models import User, Tweet, Like, Comment, Notification, Report
    
    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db, 
            'User': User, 
            'Tweet': Tweet,
            'Like': Like,
            'Comment': Comment,
            'Notification': Notification,
            'Report': Report
        }
    
    return app