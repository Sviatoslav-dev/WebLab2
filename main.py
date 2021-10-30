from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)
app.config['SECRET_KEY'] = 'a really really really really long secret key'
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'webtest12145@gmail.com'  # введите свой адрес электронной почты здесь
app.config['MAIL_DEFAULT_SENDER'] = 'webtest12145@gmail.com'  # и здесь
app.config['MAIL_PASSWORD'] = 'testte12'  # введите пароль

mail = Mail(app)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/contact', methods=["POST"])
def contact():
    req = request.get_json()
    msg = Message("Subject", sender="slaviktkachuk11gmail.com", recipients=[req['email']])
    msg.body = req['message']
    msg.subject = req['subject']
    mail.send(msg)
    res = jsonify({"result": "success"})
    return res

if __name__ == '__main__':
    app.run(debug=True)