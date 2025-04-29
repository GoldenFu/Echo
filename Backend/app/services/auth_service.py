import re
from flask import jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, verify_jwt_in_request
from functools import wraps

def validate_registration_data(data):
    """
    Validate user registration data
    """
    # Check required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return f"Missing required field: {field}"
    
    # Validate username
    if not 3 <= len(data['username']) <= 20:
        return "Username must be between 3 and 20 characters"
    
    if not re.match(r'^[a-zA-Z0-9_]+$', data['username']):
        return "Username can only contain letters, numbers, and underscores"
    
    # Validate nickname (if provided)
    if 'nickname' in data and data['nickname']:
        if len(data['nickname']) > 50:
            return "Nickname cannot exceed 50 characters"
    
    # Validate email
    email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_pattern, data['email']):
        return "Invalid email format"
    
    # Validate password
    if len(data['password']) < 6:
        return "Password must be at least 6 characters"
    
    # If bio provided, check length
    if 'bio' in data and len(data['bio']) > 200:
        return "Bio cannot exceed 200 characters"
    
    return None

def generate_tokens(user_id):
    """
    Generate access and refresh tokens
    """
    # Ensure user_id is a string
    user_id_str = str(user_id)
    access_token = create_access_token(identity=user_id_str)
    refresh_token = create_refresh_token(identity=user_id_str)
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }

def token_required(fn):
    """
    JWT authentication decorator for protected routes
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            # Verify JWT token
            verify_jwt_in_request()
            # Get current user ID
            current_user_id = get_jwt_identity()
            # Convert string identity back to integer
            if current_user_id and current_user_id.isdigit():
                current_user_id = int(current_user_id)
            # Add user ID to kwargs for the decorated function
            kwargs['current_user_id'] = current_user_id
            return fn(*args, **kwargs)
        except Exception as e:
            # Check Authorization header
            auth_header = request.headers.get('Authorization', '')
            error_detail = f"Error type: {type(e).__name__}, Error message: {str(e)}"
            if not auth_header:
                error_detail += ", Authorization header missing"
            elif not auth_header.startswith('Bearer '):
                error_detail += f", Invalid Authorization header format: {auth_header[:15]}..."
            
            return jsonify({
                "status": "error", 
                "message": "Unauthorized access, please login", 
                "error_detail": error_detail
            }), 401
    return wrapper 