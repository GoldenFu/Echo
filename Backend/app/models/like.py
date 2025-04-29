from datetime import datetime
from app import db

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tweet_id = db.Column(db.Integer, db.ForeignKey('tweet.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 添加唯一约束防止重复点赞
    __table_args__ = (db.UniqueConstraint('user_id', 'tweet_id', name='unique_user_like'),) 