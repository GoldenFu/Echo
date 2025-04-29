from flask import jsonify
from app.routes import main_bp
from app import db
from sqlalchemy import text

@main_bp.route('/')
def index():
    return jsonify(message="Welcome to Echo API")

@main_bp.route('/test-db')
def test_db():
    try:
        # 使用with语句和connection()方法代替直接使用execute()
        with db.engine.connect() as connection:
            result = connection.execute(text('SELECT 1'))
            if result.scalar() == 1:
                return jsonify({"status": "success", "message": "数据库连接成功！"})
            else:
                return jsonify({"status": "error", "message": "数据库查询未返回预期结果"})
    except Exception as e:
        return jsonify({"status": "error", "message": f"数据库连接失败: {str(e)}"})