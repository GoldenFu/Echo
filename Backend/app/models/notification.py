from datetime import datetime
from app import db

class NotificationType:
    FOLLOW = 'follow'
    LIKE = 'like'
    COMMENT = 'comment'

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # follow, like, comment
    tweet_id = db.Column(db.Integer, db.ForeignKey('tweet.id'), nullable=True)  # 可能为空（关注通知）
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)  # 可能为空
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 发送者关系
    sender = db.relationship('User', foreign_keys=[sender_id])
    # tweet关系
    tweet = db.relationship('Tweet', backref='notifications', foreign_keys=[tweet_id])
    # comment关系
    comment = db.relationship('Comment', backref='notifications', foreign_keys=[comment_id]) 