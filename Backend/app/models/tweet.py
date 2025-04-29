from datetime import datetime
from app import db

class Tweet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(280), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    likes = db.relationship('Like', backref='tweet', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='tweet', lazy='dynamic', cascade='all, delete-orphan')
    reports = db.relationship('Report', backref='reported_tweet', lazy='dynamic', 
                              foreign_keys='Report.tweet_id', cascade='all, delete-orphan')
    
    def like_count(self):
        return self.likes.count()
        
    def comment_count(self):
        return self.comments.count() 