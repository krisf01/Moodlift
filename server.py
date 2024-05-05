from flask import Flask, jsonify, request, abort  # Added 'abort' here
from flask_cors import CORS
import openai
import os

# Attempt to load the API key from environment variables
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set in the environment variables.")

openai.api_key = openai_api_key

app = Flask(__name__)
CORS(app)  # This enables CORS for all domains on all routes

@app.route('/public/')
def home():
    return "Hello, React frontend! This is Flask speaking."

@app.route('/api/data')
def get_data():
    data = {
        "message": "Here's some data from the Flask server",
        "items": [1, 2, 3, 4, 5]
    }
    return jsonify(data)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message') if request.json else None
    if not user_input:
        abort(400, description="No message provided.")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Adjusted to specify the GPT-3.5 model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_input}
            ]
        )
        return jsonify({"response": response['choices'][0]['message']['content']})
    except Exception as e:
        abort(500, description=str(e))

if __name__ == '__main__':
    app.run(debug=True, port =1234)
