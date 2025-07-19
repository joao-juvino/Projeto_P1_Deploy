from flask import Flask

app = Flask(__name__)


@app.route("/")
def foo():
    return "Hello, World!"


@app.route("/login", methods=["POST"])
def login():
    pass


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",     # Make server externally acessible from other devices
        port=8080,          # Set application port to 8080
        debug=True,         # Server will automatically reload for code changes
        #TODO: load_dotenv=True    # Automatically load .env file when application starts
    )
