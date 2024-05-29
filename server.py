from flask import Flask, redirect, session, jsonify, url_for, request, abort, send_from_directory
from flask_cors import CORS
from flask_session import Session
import os
from dotenv import load_dotenv
import openai
import firebase_admin
from firebase_admin import credentials, auth, db
import datetime
import uuid
import spotipy
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()

# Initialize OpenAI client with the API key
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Spotify credentials
SPOTIPY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')

# Spotify OAuth object
sp_oauth = SpotifyOAuth(client_id=SPOTIPY_CLIENT_ID,
                        client_secret=SPOTIPY_CLIENT_SECRET,
                        redirect_uri=SPOTIPY_REDIRECT_URI,
                        scope="user-library-read playlist-read-private playlist-read-collaborative")
                        # CHANGED SCOPE

cred = credentials.Certificate("/Users/karthisankar/Desktop/115a/Moodlift/moodlift-90c56-firebase-adminsdk-j30yy-aa0f080924.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://moodlift-90c56-default-rtdb.firebaseio.com/'
})

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
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
    
@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    try:
        # Get user ID from the request body
        data = request.json
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        prompt_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": "Generate a thoughtful journal prompt"}],
            model="gpt-3.5-turbo",
        )

        # Check if the completion has valid content and return it
        if prompt_completion.choices and len(prompt_completion.choices) > 0:
            prompt = prompt_completion.choices[0].message.content
        else:
            prompt = "Failed to get a valid prompt."

        # Save the prompt to Firebase
        ref = db.reference(f'users/{user_id}/ai_generated_prompts')
        new_prompt_ref = ref.push()
        new_prompt_ref.set({
            'prompt': prompt,
            'timestamp': datetime.datetime.now().isoformat()
        })

        return jsonify({"prompt": prompt})
    except Exception as e:
        print(e)  # Logging the exception for debugging purposes
        return jsonify({'error': str(e)}), 500

@app.route('/api/post_data', methods=['POST'])
def handle_buttons():
    if not request.is_json:
        print("No JSON received")
        abort(400, description="Missing JSON in request")

    data = request.json
    user_id = data.get('user_id')
    journal_entry = data.get('journalEntry')
    journal_prompt = data.get('journalPrompt')
    timestamp = datetime.datetime.now().isoformat()

    if not user_id or not journal_entry or not journal_prompt:
        return jsonify({"error": "User ID, journal entry, and journal prompt are required"}), 400

    try:
        ref = db.reference(f'users/{user_id}/journal_entries')
        result = ref.push({
            'entry': journal_entry,
            'prompt': journal_prompt,
            'timestamp': timestamp
        })
        return jsonify({"response": "Journal entry saved successfully", "firebase_key": result.key})
    except Exception as e:
        print("Error saving journal entry:", e)
        return jsonify({"error": str(e)}), 500


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
    
@app.route('/api/journal_entries', methods=['GET'])
def get_journal_entries():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        ref = db.reference(f'users/{user_id}/journal_entries')
        entries = ref.get()
        if not entries:
            return jsonify({"entries": []}), 200

        formatted_entries = [{"id": key, **entry} for key, entry in entries.items()]
        return jsonify({"entries": formatted_entries}), 200
    except Exception as e:
        print("Error fetching journal entries:", e)
        return jsonify({"error": str(e)}), 500
    
# OAuth Authentication Page
# @app.route('/spotify/login')
# def spotify_login():
#     session.pop('token_info', None)  # Clear the session token_info before redirecting
#     auth_url = sp_oauth.get_authorize_url()
#     return redirect(auth_url)

# @app.route('/spotify/logout')
# def spotify_logout():
#     session.pop('token_info', None)
#     return redirect(url_for('spotify_login'))

# # Function to handle callback after authorization from Spotify
# @app.route('/spotify/callback')
# def spotify_callback():
#     code = request.args.get('code')
#     token_info = sp_oauth.get_access_token(code)
#     session['token_info'] = token_info
#     return redirect(url_for('spotify_recommendations'))

# #Temporary placeholder to get top tracks of the logged-in user
# @app.route('/spotify/recommendations')
# def spotify_recommendations():
#     token_info = session.get('token_info', None)
#     if not token_info:
#         return redirect(url_for('/spotify/login'))
    
#     sp = spotipy.Spotify(auth=token_info['access_token'])
#     playlist_id = '2pf4W9bfzSnbxqjaXEQUQy'  
#     results = sp.playlist_tracks(playlist_id, limit=10)
#     tracks = results['items']
#     track_list = [{'name': track['track']['name'], 'artist': track['track']['artists'][0]['name']} for track in tracks]
    
#     return jsonify(track_list)

# spotify login for mood tracker page
@app.route('/spotify/login')
def spotify_login():
    session.pop('token_info', None)  # Clear the session token_info before redirecting
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/spotify/callback')
def spotify_callback():
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session['token_info'] = token_info
    # Redirect to route that handles the logged-in state:
    return redirect("http://localhost:3000/mood-tracker")


if __name__ == '__main__':
    app.run(debug=True, port=1234)