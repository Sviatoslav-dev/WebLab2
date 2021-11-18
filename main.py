from flask import Flask, render_template, request, jsonify, make_response
from flask_mail import Mail, Message
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from sanitizer import sanitize_dict

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['MAIL_SERVER'] = os.environ['MAIL_SERVER']
app.config['MAIL_PORT'] = os.environ['MAIL_PORT']
app.config['MAIL_USE_TLS'] = os.environ['MAIL_USE_TLS']
app.config['MAIL_USERNAME'] = os.environ['MAIL_USERNAME']
app.config['MAIL_DEFAULT_SENDER'] = os.environ['MAIL_DEFAULT_SENDER']
app.config['MAIL_PASSWORD'] = os.environ['MAIL_PASSWORD']

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

mail = Mail(app)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/contact', methods=["POST"])
@limiter.limit("1 per second")
def contact():
    req = request.get_json()
    try:
        if sanitize_dict(req):
            msg = Message("Subject", sender="slaviktkachuk11gmail.com", recipients=[req['email']])
            msg.body = req['message']
            msg.subject = req['subject']
            # mail.send(msg)
            res = jsonify({"result": "success"})
            return make_response(res, 200)
        else:
            res = jsonify({"result": "error"})
            return make_response(res, 400)
    except Exception:
        res = jsonify({"result": "error"})
        return make_response(res, 400)


if __name__ == '__main__':
    app.run(debug=True)
