from flask import request, jsonify
from werkzeug.exceptions import BadRequest
from app.models import User
from app import db
from app.services.auth_service import validate_registration_data, generate_tokens, token_required
import logging

class AuthController:
    """
    Authentication controller
    """
    @staticmethod
    def register():
        """
        User registration
        """
        try:
            data = request.get_json()
            if not data:
                return jsonify({"status": "error", "message": "No data provided"}), 400
            
            # Validate registration data
            error = validate_registration_data(data)
            if error:
                return jsonify({"status": "error", "message": error}), 400
            
            # Check if username already exists
            if User.query.filter_by(username=data['username']).first():
                return jsonify({"status": "error", "message": "Username already exists"}), 400
            
            # Check if email already exists
            if User.query.filter_by(email=data['email']).first():
                return jsonify({"status": "error", "message": "Email already registered"}), 400
            
            # Create new user
            user = User(
                username=data['username'],
                nickname=data.get('nickname', data['username']),  # Default to username if nickname not provided
                email=data['email'],
                bio=data.get('bio', '')
            )
            user.set_password(data['password'])
            
            # Save to database
            db.session.add(user)
            db.session.commit()
            
            return jsonify({
                "status": "success",
                "message": "Registration successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "nickname": user.nickname,
                    "email": user.email
                }
            }), 201
            
        except BadRequest:
            return jsonify({"status": "error", "message": "Invalid JSON data"}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": f"Server error: {str(e)}"}), 500

    @staticmethod
    def login():
        """
        User login
        """
        try:
            data = request.get_json()
            if not data:
                return jsonify({"status": "error", "message": "No data provided"}), 400
            
            # Check required fields
            if 'username' not in data or 'password' not in data:
                return jsonify({"status": "error", "message": "Username and password required"}), 400
            
            # Find user (supports login with username or email)
            user = User.query.filter_by(username=data['username']).first() or \
                User.query.filter_by(email=data['username']).first()
            
            # Debug: Check if user exists
            if not user:
                logging.error(f"Login failed: No user found with username/email {data['username']}")
                return jsonify({"status": "error", "message": "Invalid username or password"}), 401
            
            # Debug: Check if password_hash is set
            if not user.password_hash:
                logging.error(f"Login failed: User {user.username} has no password_hash set")
                return jsonify({"status": "error", "message": "User account corrupted, please contact support"}), 500
            
            # Debug: Check password verification with input password
            input_password = data['password']
            logging.info(f"Attempting login for user {user.username} with password: {input_password[:1]}***")
            
            # Verify password
            password_check_result = user.check_password(input_password)
            logging.info(f"Password verification for user {user.username}: {password_check_result}")
            
            # Return error if password check fails
            if not password_check_result:
                logging.error(f"Login failed: Invalid password for user {user.username}")
                return jsonify({"status": "error", "message": "Invalid username or password"}), 401
            
            # Generate tokens
            tokens = generate_tokens(user.id)
            
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "nickname": user.nickname,
                    "email": user.email,
                    "avatar": user.avatar,
                    "bio": user.bio,
                    "is_admin": user.is_admin
                },
                "access_token": tokens['access_token'],
                "refresh_token": tokens['refresh_token']
            }), 200
            
        except BadRequest:
            return jsonify({"status": "error", "message": "Invalid JSON data"}), 400
        except Exception as e:
            logging.error(f"Login error: {str(e)}")
            return jsonify({"status": "error", "message": f"Server error: {str(e)}"}), 500

    @staticmethod
    @token_required
    def get_current_user(current_user_id):
        """
        Get current logged in user information
        """
        try:
            user = User.query.get(current_user_id)
            if not user:
                return jsonify({"status": "error", "message": "User not found"}), 404
            
            return jsonify({
                "status": "success",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "nickname": user.nickname,
                    "email": user.email,
                    "bio": user.bio,
                    "avatar": user.avatar,
                    "created_at": user.created_at.isoformat(),
                    "followers_count": user.followers_list.count(),
                    "following_count": user.followed.count(),
                    "is_admin": user.is_admin
                }
            }), 200
            
        except Exception as e:
            return jsonify({"status": "error", "message": f"Server error: {str(e)}"}), 500

    @staticmethod
    @token_required
    def check_admin(current_user_id):
        """
        Check if the current user is an admin
        """
        try:
            user = User.query.get(current_user_id)
            if not user:
                return jsonify({"status": "error", "message": "User not found"}), 404
            
            return jsonify({
                "status": "success",
                "is_admin": user.is_admin
            }), 200
            
        except Exception as e:
            return jsonify({"status": "error", "message": f"Server error: {str(e)}"}), 500 