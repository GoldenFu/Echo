from app import create_app, db
from app.models import User

def update_admin_nickname(username, new_nickname):
    """Update admin user nickname"""
    app = create_app()
    
    with app.app_context():
        # Find existing user
        admin = User.query.filter_by(username=username).first()
        
        if not admin:
            print(f"User {username} not found")
            return
        
        # Update nickname
        old_nickname = admin.nickname
        admin.nickname = new_nickname
        db.session.commit()
        
        print(f"Admin user {username} nickname updated from '{old_nickname}' to '{new_nickname}'")

if __name__ == "__main__":
    # Update admin nickname from Chinese to English
    update_admin_nickname("admin", "Admin") 