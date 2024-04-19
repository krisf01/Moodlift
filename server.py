#test file
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, React frontend! This is Flask speaking."

@app.route('/api/data')
def get_data():
    # Example data
    data = {
        "message": "Here's some data from the Flask server",
        "items": [1, 2, 3, 4, 5]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)