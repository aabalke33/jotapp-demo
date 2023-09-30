import json
import os

from flask import Flask, render_template, redirect, url_for, request, session, flash
from database import query_login, query_notes, query_note_data, add_statement

app = Flask(__name__)

app.secret_key = os.environ['SECRET_KEY']


@app.route("/", methods=["POST", "GET"])
def home():
    if request.method == "POST" and request.json['request'] == "new_note":
        session.pop('note')

    if request.method == "POST" and request.json['request'] == "add_statement":
        add_statement(request.json['statementText'], request.json['statementSubcategory'])

    if "user_id" in session:
        if "note" in session:

            data = query_note_data(session['note'])

            return render_template(
                'home.html',
                first_name=session["first_name"],
                last_name=session['last_name'],
                data=data,
                note=session["note"]
            )
        else:
            return redirect(url_for("note"))
    else:
        return redirect(url_for("login"))


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":

        email = request.form["email"]
        email_chars = ["\"", "(", ")", "*", "&", " ", "", "/", "\\", "$"]
        email_bad_chars = [e for e in email_chars if e in email]

        password = request.form["password"]
        password_chars = ["(", ")", "{", "}", "[", "]", "|", "`", "¬", "¦", "!", " ", "\"", "£",
                          "<", ">", ":", ";", "#", "~", "_", "-", "+", "=", ",", "\'"]
        password_bad_chars = [e for e in password_chars if e in password]

        if len(email_bad_chars) <= 1 and len(password_bad_chars) <= 1:
            user = query_login(request.form["email"], request.form["password"])

            if user:
                session["first_name"] = user["first_name"]
                session["last_name"] = user["last_name"]
                session["email"] = user["email"]
                session["user_id"] = user["user_id"]

                flash("Welcome, " + session["first_name"] + "!")
                return redirect(url_for("note"))
            else:
                return render_template('login.html')

    else:
        if "user_id" in session:
            return redirect(url_for("note"))
        else:
            return render_template('login.html')


@app.route("/note", methods=["POST", "GET"])
def note():
    if request.method == "POST":

        note_input = request.json
        note_id_str = str(note_input['note_id'])

        if len(note_id_str) < 3 and note_id_str.isdigit():

            session['note'] = note_input

            response = app.response_class(
                response=json.dumps({"response": "goodtoload"}),
                status=200,
            )
            return response

    else:
        if "user_id" in session:

            notes = query_notes(session["user_id"])

            return render_template(
                'note.html',
                first_name=session["first_name"],
                notes=notes,
            )

        else:
            return redirect(url_for("login"))


@app.route("/logout")
def logout():
    session.clear()
    flash("Logout Successful.")
    return redirect(url_for("login"))


@app.errorhandler(404)
def page_not_found(error):
    return redirect(url_for('home'))


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
