from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
import logging

# 用户关注关系（自引用多对多）
followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    nickname = db.Column(db.String(50), nullable=True)  # 昵称，可以包含中文等字符
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    bio = db.Column(db.String(200))
    avatar = db.Column(db.String(200), default='default_avatar.jpg')
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    tweets = db.relationship('Tweet', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    likes = db.relationship('Like', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='recipient', lazy='dynamic', 
                                   foreign_keys='Notification.user_id', cascade='all, delete-orphan')
    reports = db.relationship('Report', backref='reporter', lazy='dynamic', foreign_keys='Report.reporter_id')
    
    # 关注关系
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers_list', lazy='dynamic'), 
        lazy='dynamic'
    )
    
    def set_password(self, password):
        """生成密码哈希并存储"""
        if not password:
            logging.error("Attempt to set empty password")
            raise ValueError("Password cannot be empty")
        
        # 使用Werkzeug的generate_password_hash生成安全的密码哈希
        self.password_hash = generate_password_hash(password)
        logging.info(f"Password hash generated for user {self.username}: {self.password_hash[:15]}...")
        
    def check_password(self, password):
        """验证密码是否匹配"""
        # 对输入进行验证
        if not password:
            logging.error(f"Empty password provided for user {self.username}")
            return False
            
        if not self.password_hash:
            logging.error(f"No password hash stored for user {self.username}")
            return False
        
        # 使用Werkzeug的check_password_hash比较提供的密码和存储的哈希值    
        result = check_password_hash(self.password_hash, password)
        
        if result:
            logging.info(f"Password verification successful for user {self.username}")
        else:
            logging.warning(f"Password verification failed for user {self.username}")
            # 记录密码哈希的类型和格式，但不记录完整哈希以保护安全
            hash_type = self.password_hash.split('$')[0] if '$' in self.password_hash else 'unknown'
            logging.info(f"User {self.username} has hash type: {hash_type}")
            
        return result
    
    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)
            return True
        return False
            
    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)
            return True
        return False
            
    def is_following(self, user):
        return self.followed.filter(followers.c.followed_id == user.id).count() > 0 