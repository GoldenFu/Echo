"""
用户密码修复工具

此脚本用于:
1. 检查所有用户账号并确保密码哈希被正确设置
2. 为没有正确密码哈希的用户设置临时密码
3. 可以为所有用户重置密码（仅用于紧急情况）
"""

from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
import click
import logging
import sys

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('password_fix.log')
    ]
)
logger = logging.getLogger(__name__)

app = create_app()

def check_and_fix_user(user, default_password="Password123!"):
    """检查并修复单个用户的密码"""
    logger.info(f"检查用户: {user.username} (ID: {user.id})")
    
    # 检查密码哈希是否存在且有效
    if not user.password_hash or len(user.password_hash) < 20:
        logger.warning(f"用户 {user.username} 的密码哈希无效或不存在，正在重置...")
        user.set_password(default_password)
        logger.info(f"已为用户 {user.username} 设置默认密码: {default_password}")
        return True, f"用户 {user.username} 的密码已重置为默认密码"
    
    # 测试验证功能是否正常
    try:
        # 创建一个临时密码并测试
        temp_password = f"Test{user.id}Password!"
        old_hash = user.password_hash
        
        # 暂存旧哈希
        user.set_password(temp_password)
        new_hash = user.password_hash
        
        # 验证新密码
        if user.check_password(temp_password):
            logger.info(f"用户 {user.username} 的密码验证功能正常")
            # 恢复旧哈希
            user.password_hash = old_hash
            return False, f"用户 {user.username} 密码验证正常，无需修复"
        else:
            logger.error(f"用户 {user.username} 的密码验证失败，正在修复...")
            # 保持新设置的密码
            return True, f"用户 {user.username} 的密码已修复并重置为: {temp_password}"
    except Exception as e:
        logger.error(f"检查用户 {user.username} 时出错: {str(e)}")
        user.set_password(default_password)
        return True, f"用户 {user.username} 的密码已重置为默认密码 (出错: {str(e)})"

def fix_all_passwords(default_password="Password123!"):
    """检查并修复所有用户密码"""
    modified_users = []
    
    with app.app_context():
        users = User.query.all()
        logger.info(f"找到 {len(users)} 个用户账号")
        
        for user in users:
            modified, message = check_and_fix_user(user, default_password)
            if modified:
                modified_users.append((user, message))
        
        if modified_users:
            db.session.commit()
            logger.info(f"已修复 {len(modified_users)} 个用户的密码")
        else:
            logger.info("没有用户需要密码修复")
            
    return modified_users

def reset_all_passwords(new_password):
    """为所有用户设置相同的新密码（仅用于紧急情况）"""
    with app.app_context():
        users = User.query.all()
        count = 0
        
        for user in users:
            try:
                user.set_password(new_password)
                count += 1
            except Exception as e:
                logger.error(f"重置用户 {user.username} 密码时出错: {str(e)}")
                
        db.session.commit()
        logger.info(f"已为 {count}/{len(users)} 个用户重置密码")
        
    return count

def main():
    """主函数"""
    print("用户密码修复工具")
    print("=" * 30)
    
    print("\n请选择操作:")
    print("1. 检查并修复问题用户的密码")
    print("2. 为所有用户重置相同的密码 (危险操作)")
    print("3. 退出")
    
    choice = click.prompt("请选择", type=int, default=1)
    
    if choice == 1:
        default_pwd = click.prompt("请输入默认密码 (用于修复问题用户)", default="Password123!")
        modified_users = fix_all_passwords(default_pwd)
        
        if modified_users:
            print(f"\n已修复 {len(modified_users)} 个用户的密码:")
            for user, message in modified_users:
                print(f"- {message}")
            print("\n请通知这些用户使用新密码登录并修改密码")
        else:
            print("\n所有用户密码均正常，无需修复")
            
    elif choice == 2:
        if click.confirm("警告: 此操作将重置所有用户的密码! 确定要继续吗?"):
            new_pwd = click.prompt("请输入新密码", hide_input=True, confirmation_prompt=True)
            count = reset_all_passwords(new_pwd)
            print(f"\n已重置 {count} 个用户的密码")
            print("请通知所有用户使用新密码登录")

if __name__ == "__main__":
    main() 