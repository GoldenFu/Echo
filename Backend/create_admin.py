from app import create_app, db
from app.models import User

def create_admin_user(username, email, password, nickname=None):
    """Create admin user"""
    app = create_app()
    
    with app.app_context():
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            print(f"Username {username} already exists, skipping creation")
            return
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            print(f"Email {email} already registered, skipping creation")
            return
        
        # Create admin user
        admin = User(
            username=username,
            email=email,
            nickname=nickname or username,  # Default to username if nickname not provided
            bio="Admin account",
            is_admin=True
        )
        admin.set_password(password)
        
        # Save to database
        db.session.add(admin)
        db.session.commit()
        
        print(f"Admin user {username} created successfully!")

if __name__ == "__main__":
    # Create admin user
    create_admin_user("admin", "admin@123.com", "admin", "Admin") 