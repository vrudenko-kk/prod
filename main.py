from flask import Flask, render_template, redirect
from flask_login import LoginManager, login_required, logout_user

from api import IndexAPI

app = Flask(__name__)
app.config['SECRET_KEY'] = "key"

login_manager = LoginManager()
login_manager.init_app(app)



login_manager.login_view = 'login'
class User:
    def __init__(self, id):
        self.id = id

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)


@login_manager.user_loader
def load_user(user_id):
    return User(id=1)




# выход с аккаунта
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


# обработка ошибки 404
@app.errorhandler(404)
def not_found_error(_):
    return render_template('404.html')


def main():
    app.register_blueprint(IndexAPI.blueprint)
    app.run(port=5000, host='127.0.0.1', debug=True)


if __name__ == '__main__':
    main()
