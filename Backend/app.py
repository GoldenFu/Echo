from app import create_app, db
from app.models import User

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db}

@app.cli.command("create-admin")
def create_admin():
    """创建管理员用户"""
    import click
    username = click.prompt("请输入管理员用户名", type=str)
    email = click.prompt("请输入管理员邮箱", type=str)
    password = click.prompt("请输入管理员密码", type=str, hide_input=True, confirmation_prompt=True)
    
    # 检查用户名是否已存在
    if User.query.filter_by(username=username).first():
        click.echo("错误：用户名已存在")
        return
    
    # 检查邮箱是否已存在
    if User.query.filter_by(email=email).first():
        click.echo("错误：邮箱已被注册")
        return
    
    # 创建管理员用户
    admin = User(
        username=username,
        email=email,
        bio="管理员账号",
        is_admin=True
    )
    admin.set_password(password)
    
    # 保存到数据库
    db.session.add(admin)
    db.session.commit()
    
    click.echo(f"管理员用户 {username} 创建成功！")

if __name__ == '__main__':
    app.run(debug=True)