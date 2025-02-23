from flask import Flask, render_template, request, redirect, session, url_for
from predictor import Predictor
import os

app = Flask(__name__)


app.config['UPLOAD_FOLDER'] = 'download'
app.config['logged'] = False


@app.route('/', methods=["GET"])
def home_page():
    return render_template("index.html", logged=app.config['logged'])


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if(username == "admin" and password == "admin"):
            app.config['logged'] = True
            return redirect("/")
        else:
            return render_template("login.html", error=True)

    return render_template("login.html")

@app.route('/logout', methods=["GET", "POST"])
def logout():
    app.config['logged'] = False
    return redirect("/")


@app.route('/diagnostico', methods=["GET", "POST"])
def diagnostico():
    if not app.config['logged']:
        return redirect("/login")
    
    if request.method == 'POST':
        file = request.files['fileInput']
        print("FILE: ", file.filename)

        path = os.path.join(os.getcwd(), app.config['UPLOAD_FOLDER'], file.filename)
        file.save(path)
        type, probability = Predictor.predict(path)

        analisis = f"La imagen analizada corresponde al tipo: {'BENIGNO' if type == 0 else 'MALIGNO'}"

        return render_template("diagnostico.html", analisis=analisis)

    return render_template("diagnostico.html", analisis="")


@app.route('/upload', methods=["POST"])
def upload_file():
    file = request.files['fileInput']
    print("FILE: ", file.filename)
    print("CWD ", os.getcwd())

    filename = file.filename
    path = os.path.join(os.getcwd(), app.config['UPLOAD_FOLDER'], filename)
    file.save(path)
    type, probability = Predictor.predict(path)

    analisis = f"La imagen analizada corresponde al tipo: {'BENIGNO' if type == 0 else 'MALIGNO'}"

    return render_template("diagnostico.html", analisis=analisis)


@app.route('/contacto')
def contacto():
    return render_template("contacto.html")

if __name__ == "__main__":
    app.run(debug=True)
