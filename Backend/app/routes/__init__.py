from flask import Blueprint

main_bp = Blueprint('main', __name__)
auth_bp = Blueprint('auth', __name__)

from app.routes import routes
from app.routes import auth