from flask import Flask, jsonify, request, abort  # Added 'abort' here
from flask_cors import CORS
# import openai
# import os
import firebase_admin
from firebase_admin import credentials, db


import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("/home/dylantran02/Moodlift/moodlift-90c56-firebase-adminsdk-j30yy-aa0f080924.json")
firebase_admin.initialize_app(cred,{
        'databaseURL' : 'https://moodlift-90c56-default-rtdb.firebaseio.com/'
})


# # Attempt to load the API key from environment variables
# openai_api_key = os.getenv('OPENAI_API_KEY')
# if not openai_api_key:
#     raise ValueError("OPENAI_API_KEY is not set in the environment variables.")

# openai.api_key = openai_api_key

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

# @app.route('/chat', methods=['POST'])
# def chat():
#     user_input = request.json.get('message') if request.json else None
#     if not user_input:
#         abort(400, description="No message provided.")

#     try:
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",  # Adjusted to specify the GPT-3.5 model
#             messages=[
#                 {"role": "system", "content": "You are a helpful assistant."},
#                 {"role": "user", "content": user_input}
#             ]
#         )
#         return jsonify({"response": response['choices'][0]['message']['content']})
#     except Exception as e:
#         abort(500, description=str(e))

# ref = db.reference('server/saving-data/fireblog')

@app.route('/', methods=['POST'])
def handle_buttons():
    content = request.json.get('action')  # Assuming JSON data with an 'action' key
    print("Received content:", content)

    # Firebase Database reference
    ref = db.reference('server/saving-data/fireblog')

    if content == "Post":
        # Write to Firebase Database
        result = ref.push({
            'content': 'Post button clicked',
            'timestamp': datetime.datetime.now().isoformat()  # Add a timestamp if needed
        })

        # Respond when the Post button is clicked
        return jsonify({"response": "Post button clicked, data written to Firebase", "firebase_key": result.key})
    else:
        # Handle other actions or bad requests
        return jsonify({"response": "Unknown Action"}), 400
    

@app.route('/', methods=['POST'])
def handle_post_data():
    data = request.json
    ref = db.reference('server/saving-data/fireblog')  # Adjust the Firebase reference as needed

    # Add data to Firebase
    result = ref.push({
        'content': data['content'],
        'timestamp': data['timestamp']
    })

    return jsonify({"success": True, "key": result.key}), 200

if __name__ == '__main__':
    app.run(debug=True, port =1234)