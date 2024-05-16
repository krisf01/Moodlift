from flask import Flask, jsonify, request, abort, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai
import firebase_admin
from firebase_admin import credentials, auth, db
import datetime
import uuid

load_dotenv()

# Initialize OpenAI client with the API key
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

cred = credentials.Certificate("/Users/kfout/MoodLift/Moodlift/moodlift-90c56-firebase-adminsdk-j30yy-aa0f080924.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://moodlift-90c56-default-rtdb.firebaseio.com/'
})

app = Flask(__name__)
CORS(app)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/api/data')
def get_data():
    data = {
        "message": "Here's some data from the Flask server",
        "items": [1, 2, 3, 4, 5]
    }
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

@app.route('/api/post_data', methods=['POST'])
def handle_buttons():
    if not request.is_json:
        print("No JSON received")
        abort(400, description="Missing JSON in request")

    content = request.json.get('action')
    print("Received content:", content)

    if content == "Post":
        ref = db.reference('server/saving-data/fireblog')
        result = ref.push({
            'content': 'Post button clicked',
            'timestamp': datetime.datetime.now().isoformat()
        })
        return jsonify({"response": "Post button clicked, data written to Firebase", "firebase_key": result.key})
    else:
        return jsonify({"response": "Unknown Action"}), 400

@app.route('/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        user = auth.create_user(
            email=email,
            password=password
        )

        # Generate a unique API key for the user
        api_key = str(uuid.uuid4())

        # Store the API key in the Realtime Database
        db.reference(f'users/{user.uid}').set({
            'email': email,
            'api_key': api_key
        })

        return jsonify({"message": "User created successfully", "uid": user.uid, "api_key": api_key}), 201
    except Exception as e:
        print("Error during registration:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Verify user credentials
        user = auth.get_user_by_email(email)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Retrieve the API key from the Realtime Database
        api_key = db.reference(f'users/{user.uid}/api_key').get()
        if not api_key:
            return jsonify({"error": "API key not found"}), 500

        return jsonify({"message": "Login successful", "uid": user.uid, "api_key": api_key}), 200
    except Exception as e:
        print("Error during login:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=1234)