from flask import Flask, render_template, redirect
from flask_login import LoginManager, login_required, logout_user

from api import IndexAPI, InterniewAPI, ResultsAPI

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


from flask import request, jsonify

# ... остальной код ...

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()


        #ВОТ СООБЩЕНИЕ ЮЗЕРА
        user_message = data.get('message', '').strip()

        if not user_message:
            return jsonify({'error': 'Empty message'}), 400

        #ВОТ ТУТ ФОРМИРУЕТЕ ОТВЕТ
        bot_reply = f"Умный ответ на твое {user_message}"


        return jsonify({
            'reply': bot_reply,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

from flask import request, jsonify

@app.route('/api/code-paste', methods=['POST'])
def handle_code_paste():
    try:
        if not request.is_json:
            return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 400

        data = request.get_json(silent=True)  # silent=True — не падает, если JSON невалидный
        if data is None:
            return jsonify({'status': 'error', 'message': 'Invalid JSON'}), 400

        pasted_code = data.get('code', '')
        timestamp = data.get('timestamp', 'unknown')
        print(f"[PASTE DETECTED] Вставлено:\n{pasted_code[:100]}... in {timestamp}")

        return jsonify({
            'status': 'received',
            'message': 'Вставка зафиксирована',
            'length': len(pasted_code)
        }), 200

    except Exception as e:
        error_msg = f"Внутренняя ошибка: {str(e)}"
        print("Ошибка в /api/code-paste:", error_msg)
        return jsonify({
            'status': 'server_error',
            'message': error_msg
        }), 500


def main():
    app.register_blueprint(IndexAPI.blueprint)
    app.register_blueprint(InterniewAPI.blueprint)
    app.register_blueprint(ResultsAPI.blueprint)

    app.run(port=5000, host='127.0.0.1', debug=True)


if __name__ == '__main__':
    main()
