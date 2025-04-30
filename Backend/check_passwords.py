"""
密码验证检查和修复工具

此脚本用于:
1. 检查数据库中所有用户的密码哈希是否正确设置
2. 检查密码验证功能是否正常工作
3. 提供修复选项，允许重置用户密码
"""

from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
import click
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = create_app()

def check_user_passwords():
    """检查所有用户的密码哈希"""
    with app.app_context():
        users = User.query.all()
        logger.info(f"找到 {len(users)} 个用户账号")
        
        problematic_users = []
        
        for user in users:
            logger.info(f"检查用户: {user.username}, 密码哈希: {user.password_hash[:10]}...")
            if not user.password_hash:
                logger.error(f"用户 {user.username} 没有设置密码哈希")
                problematic_users.append(user)
            elif len(user.password_hash) < 20:  # 合理的哈希长度应该更长
                logger.error(f"用户 {user.username} 的密码哈希似乎无效: {user.password_hash[:10]}...")
                problematic_users.append(user)
                
        return problematic_users

def test_password_check():
    """测试密码验证功能"""
    # 创建测试用户
    with app.app_context():
        # 检查测试用户是否已存在
        test_user = User.query.filter_by(username="password_test_user").first()
        if test_user:
            db.session.delete(test_user)
            db.session.commit()
            
        # 创建新的测试用户
        test_user = User(
            username="password_test_user",
            email="password_test@example.com",
            bio="测试账号"
        )
        test_password = "test_password_123"
        test_user.set_password(test_password)
        
        db.session.add(test_user)
        db.session.commit()
        
        # 测试密码验证
        logger.info("测试正确密码验证:")
        correct_result = test_user.check_password(test_password)
        logger.info(f"正确密码验证结果: {correct_result}")
        
        logger.info("测试错误密码验证:")
        wrong_result = test_user.check_password("wrong_password")
        logger.info(f"错误密码验证结果: {wrong_result}")
        
        # 清理测试用户
        db.session.delete(test_user)
        db.session.commit()
        
        return correct_result and not wrong_result

def reset_user_password(username, new_password):
    """重置指定用户的密码"""
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if not user:
            logger.error(f"用户 {username} 不存在")
            return False
            
        user.set_password(new_password)
        db.session.commit()
        logger.info(f"用户 {username} 的密码已重置")
        
        # 验证密码是否设置成功
        verification = user.check_password(new_password)
        logger.info(f"密码重置验证: {'成功' if verification else '失败'}")
        return verification

def reset_all_users_passwords(new_password):
    """重置所有用户的密码为相同的新密码（仅用于测试环境）"""
    with app.app_context():
        users = User.query.all()
        for user in users:
            user.set_password(new_password)
            logger.info(f"重置用户 {user.username} 的密码")
        db.session.commit()
        logger.info(f"已重置 {len(users)} 个用户的密码")
        return True

def main():
    """主函数"""
    print("密码验证检查和修复工具")
    print("=" * 30)
    
    # 测试密码验证功能
    print("\n测试密码验证功能...")
    if test_password_check():
        print("密码验证功能测试成功！")
    else:
        print("密码验证功能测试失败！")
        if click.confirm("是否继续?"):
            pass
        else:
            return
    
    # 检查用户密码
    print("\n检查用户密码...")
    problematic_users = check_user_passwords()
    
    if not problematic_users:
        print("所有用户密码哈希正常！")
    else:
        print(f"\n发现 {len(problematic_users)} 个密码可能有问题的用户:")
        for i, user in enumerate(problematic_users):
            print(f"{i+1}. {user.username} (ID: {user.id}, Email: {user.email})")
    
        # 提供修复选项
        print("\n修复选项:")
        print("1. 重置个别用户密码")
        print("2. 重置所有用户密码（仅用于测试环境）")
        print("3. 退出")
        
        choice = click.prompt("请选择操作", type=int, default=3)
        
        if choice == 1:
            for user in problematic_users:
                if click.confirm(f"要重置用户 {user.username} 的密码吗?"):
                    new_password = click.prompt("请输入新密码", type=str, hide_input=True, confirmation_prompt=True)
                    if reset_user_password(user.username, new_password):
                        print(f"用户 {user.username} 的密码已成功重置")
                    else:
                        print(f"用户 {user.username} 的密码重置失败")
        
        elif choice == 2:
            if click.confirm("确定要重置所有用户的密码吗? 这将影响系统中的所有用户！"):
                new_password = click.prompt("请输入新密码", type=str, hide_input=True, confirmation_prompt=True)
                if reset_all_users_passwords(new_password):
                    print(f"所有用户密码已成功重置为新密码")
                else:
                    print(f"重置所有用户密码失败")

if __name__ == "__main__":
    main() 