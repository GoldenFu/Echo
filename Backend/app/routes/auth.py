from app.routes import auth_bp
from app.controllers.auth_controller import AuthController

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