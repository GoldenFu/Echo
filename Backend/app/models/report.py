from datetime import datetime
from app import db

class ReportType:
    SPAM = 'spam'
    HATE_SPEECH = 'hate_speech'
    VIOLENCE = 'violence'
    MISINFORMATION = 'misinformation'
    OTHER = 'other'

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reported_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    tweet_id = db.Column(db.Integer, db.ForeignKey('tweet.id'), nullable=True)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    type = db.Column(db.String(20), nullable=False)
    details = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, reviewed, resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 被举报用户
    reported_user = db.relationship('User', foreign_keys=[reported_user_id])
    # 评论
    comment = db.relationship('Comment', backref='reports') 