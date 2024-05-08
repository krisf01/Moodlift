from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai

load_dotenv()

# Initialize OpenAI client with the API key
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = Flask(__name__)
CORS(app)

@app.route('/public/')
def home():
    return "Hello, React frontend! This is Flask speaking."

@app.route('/api/data')
def get_data():
    data = {"message": "Here's some data from the Flask server", "items": [1, 2, 3, 4, 5]}
    return jsonify(data)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_input = request.json.get('message')
        if not user_input:
            return jsonify({"error": "No message provided"}), 400

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": user_input}],
            model="gpt-3.5-turbo",
        )

        # Correctly accessing the message content from the response
        if chat_completion.choices and len(chat_completion.choices) > 0:
            message = chat_completion.choices[0].message.content
        else:
            message = "Failed to get a valid response."

        return jsonify({"response": message})
    except Exception as e:
        print(e)  # Add a print here to catch any exceptions for debugging
        return jsonify({"error": str(e)}), 500
    
@app.route('/generate-prompt', methods=['GET'])
def generate_prompt():
    try:
        prompt_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": "Generate a thoughtful journal prompt"}],
            model="gpt-3.5-turbo",
        )

        # Check if the completion has valid content and return it
        if prompt_completion.choices and len(prompt_completion.choices) > 0:
            prompt = prompt_completion.choices[0].message.content
        else:
            prompt = "Failed to get a valid prompt."

        return jsonify({"prompt": prompt})
    except Exception as e:
        print(e)  # Logging the exception for debugging purposes
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=1234)