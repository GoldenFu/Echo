from flask import Flask, send_from_directory, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
from config import Config
import logging
import os

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# 初始化扩展
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # 启用CORS
    CORS(app, resources={
        r"/api/*": {"origins": "*"},
        r"/uploads/*": {"origins": "*"}
    })
    
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

    @app.route('/uploads/avatars/<filename>')
    def serve_avatar(filename):
        upload_dir = os.path.join(current_app.root_path, '..', 'uploads', 'avatars')
        return send_from_directory(upload_dir, filename, mimetype='image/jpeg')

    return app