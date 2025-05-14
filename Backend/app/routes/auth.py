from app.routes import auth_bp
from app.controllers.auth_controller import AuthController
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from datetime import datetime

# 路由到控制器方法的映射
@auth_bp.route('/register', methods=['POST'])
def register():
    return AuthController.register()

@auth_bp.route('/login', methods=['POST'])
def login():
    return AuthController.login()

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    return AuthController.get_current_user()

@auth_bp.route('/check-admin', methods=['GET'])
def check_admin():
    return AuthController.check_admin()

@auth_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    return AuthController.update_profile(current_user_id)

@auth_bp.route('/upload-avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    current_user_id = get_jwt_identity()
    return AuthController.upload_avatar(current_user_id)