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

cred = credentials.Certificate("/Users/anushapai/Desktop/Moodlift/moodlift-90c56-firebase-adminsdk-j30yy-aa0f080924.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://moodlift-90c56-default-rtdb.firebaseio.com/'
})

# app = Flask(__name__)
# #CORS(app)
# CORS(app, resources={r"/*": {"origins": "*"}})

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
CORS(app)


# @app.route('/favicon.ico')
# def favicon():
#     return send_from_directory(os.path.join(app.root_path, 'static'),
#                                'favicon.ico', mimetype='image/vnd.microsoft.icon')

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

        if chat_completion.choices and len(chat_completion.choices) > 0:
            message = chat_completion.choices[0].message.content
        else:
            message = "Failed to get a valid response."

        return jsonify({"response": message})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    try:
        data = request.json
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        prompt_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": "Generate a thoughtful journal prompt"}],
            model="gpt-3.5-turbo",
        )

        if prompt_completion.choices and len(prompt_completion.choices) > 0:
            prompt = prompt_completion.choices[0].message.content
        else:
            prompt = "Failed to get a valid prompt."

        ref = db.reference(f'users/{user_id}/ai_generated_prompts')
        new_prompt_ref = ref.push()
        new_prompt_ref.set({
            'prompt': prompt,
            'timestamp': datetime.datetime.now().isoformat()
        })

        return jsonify({"prompt": prompt})
    except Exception as e:
        print(e)
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

    if not user_id or not journal_entry or not journal_prompt:
        return jsonify({"error": "User ID, journal entry, and journal prompt are required"}), 400

    try:
        ref = db.reference(f'users/{user_id}/journal_entries')
        result = ref.push({
            'entry': journal_entry,
            'prompt': journal_prompt,
            'timestamp': datetime.datetime.now().isoformat()
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

        api_key = str(uuid.uuid4())

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
        
        user = auth.get_user_by_email(email)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        api_key = db.reference(f'users/{user.uid}/api_key').get()
        if not api_key:
            return jsonify({"error": "API key not found"}), 500

        return jsonify({"message": "Login successful", "uid": user.uid, "api_key": api_key}), 200
    except Exception as e:
        print("Error during login:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/search_users', methods=['GET'])
def search_users():
    query = request.args.get('query').lower()
    try:
        users_ref = db.reference('users')
        all_users = users_ref.get()
        if not all_users:
            return jsonify([]), 200

        filtered_users = []
        for user_id, user in all_users.items():
            if query in user.get('username', '').lower():
                user['id'] = user_id
                filtered_users.append(user)

        return jsonify(filtered_users), 200
    except Exception as e:
        print(f"Error searching users: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/add_friend', methods=['POST'])
def add_friend():
    data = request.get_json()
    user_id = data.get('user_id')
    friend_id = data.get('friend_id')
    if not user_id or not friend_id:
        return jsonify({'error': 'Both user_id and friend_id are required'}), 400
    
    try:
        friends_ref = db.reference(f'friends/{user_id}')
        friends_ref.update({friend_id: True})
        return jsonify({'message': 'Friend added successfully'}), 200
    except Exception as e:
        print(f"Error adding friend: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_friends', methods=['GET'])
def get_friends():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        friends_ref = db.reference(f'friends/{user_id}')
        friends_ids = friends_ref.get()

        if not friends_ids:
            return jsonify([]), 200

        users_ref = db.reference('users')
        friends_data = []
        for friend_id in friends_ids:
            friend_data = users_ref.child(friend_id).get()
            if friend_data:
                friends_data.append(friend_data)

        return jsonify(friends_data), 200
    except Exception as e:
        print(f"Error fetching friends: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/search_users_by_email', methods=['GET'])
def search_users_by_email():
    email = request.args.get('email').lower()
    try:
        users_ref = db.reference('users')
        all_users = users_ref.get()
        if not all_users:
            return jsonify([]), 200

        filtered_users = []
        for user_id, user in all_users.items():
            if user.get('email', '').lower() == email:
                user['id'] = user_id
                filtered_users.append(user)

        return jsonify(filtered_users), 200
    except Exception as e:
        print(f"Error searching users: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/send_friend_request', methods=['POST'])
def send_friend_request():
    data = request.json
    from_user_id = data.get('from_user_id')
    to_user_id = data.get('to_user_id')

    if not from_user_id or not to_user_id:
        return jsonify({'error': 'Both from_user_id and to_user_id are required'}), 400

    try:
        friend_requests_ref = db.reference(f'friend_requests/{to_user_id}')
        new_request_ref = friend_requests_ref.push()
        new_request_ref.set({
            'from_user_id': from_user_id,
            'timestamp': datetime.datetime.now().isoformat()
        })

        return jsonify({'message': 'Friend request sent successfully'}), 200
    except Exception as e:
        print(f"Error sending friend request: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/get_friend_requests', methods=['GET'])
def get_friend_requests():
    try:
        print("Request received: ", request.args)
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        friend_requests_ref = db.reference(f'friend_requests/{user_id}')
        friend_requests = friend_requests_ref.get()

        if not friend_requests:
            return jsonify([]), 200

        users_ref = db.reference('users')
        requests_data = []
        for request_id, req in friend_requests.items():
            from_user_id = req['from_user_id']
            from_user_data = users_ref.child(from_user_id).get()
            if from_user_data:
                requests_data.append({
                    'request_id': request_id,
                    'from_user_id': from_user_id,
                    'from_user_email': from_user_data.get('email'),
                    'timestamp': req.get('timestamp')
                })

        return jsonify(requests_data), 200
    except Exception as e:
        print(f"Error fetching friend requests: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/accept_friend_request', methods=['POST'])
def accept_friend_request():
    data = request.json
    user_id = data.get('user_id')
    friend_id = data.get('friend_id')
    request_id = data.get('request_id')

    if not user_id or not friend_id or not request_id:
        return jsonify({'error': 'User ID, friend ID, and request ID are required'}), 400

    try:
        # Add friend to user's friends list
        friends_ref = db.reference(f'friends/{user_id}')
        friends_ref.update({friend_id: True})

        # Add user to friend's friends list
        friends_ref = db.reference(f'friends/{friend_id}')
        friends_ref.update({user_id: True})

        # Remove the friend request
        friend_requests_ref = db.reference(f'friend_requests/{user_id}/{request_id}')
        friend_requests_ref.delete()

        return jsonify({'message': 'Friend request accepted successfully'}), 200
    except Exception as e:
        print(f"Error accepting friend request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/reject_friend_request', methods=['POST'])
def reject_friend_request():
    data = request.json
    user_id = data.get('user_id')
    request_id = data.get('request_id')

    if not user_id or not request_id:
        return jsonify({'error': 'User ID and request ID are required'}), 400

    try:
        # Remove the friend request
        friend_requests_ref = db.reference(f'friend_requests/{user_id}/{request_id}')
        friend_requests_ref.delete()

        return jsonify({'message': 'Friend request rejected successfully'}), 200
    except Exception as e:
        print(f"Error rejecting friend request: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_friends_journal_entries', methods=['GET'])
def get_friends_journal_entries():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        # Get friends' IDs
        friends_ref = db.reference(f'friends/{user_id}')
        friends_ids = friends_ref.get()

        if not friends_ids:
            return jsonify([]), 200

        users_ref = db.reference('users')
        journal_entries = []

        for friend_id in friends_ids:
            friend_journal_entries_ref = db.reference(f'users/{friend_id}/journal_entries')
            entries = friend_journal_entries_ref.get()

            if entries:
                for entry_id, entry in entries.items():
                    journal_entries.append({
                        'friend_id': friend_id,
                        'friend_email': users_ref.child(friend_id).child('email').get(),
                        'entry': entry['entry'],
                        'prompt': entry['prompt'],
                        'timestamp': entry['timestamp']
                    })

        return jsonify(journal_entries), 200
    except Exception as e:
        print(f"Error fetching friends' journal entries: {str(e)}")
        return jsonify({"error": str(e)}), 500

# OAuth Authentication Page
# spotify login for mood tracker page
@app.route('/spotify/login')
def spotify_login():
    session.pop('token_info', None)  # Clear the session token_info before redirecting
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/spotify/logout')
def spotify_logout():
    session.pop('token_info', None)
    return redirect(url_for('spotify_login'))

# Function to handle callback after authorization from Spotify
@app.route('/spotify/callback')
def spotify_callback():
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session['token_info'] = token_info
    # Redirect to route that handles the logged-in state:
    return redirect("http://localhost:3000/mood-tracker")

#Temporary placeholder to get top tracks of the logged-in user
@app.route('/spotify/recommendations')
def spotify_recommendations():
    token_info = session.get('token_info', None)
    if not token_info:
        return redirect(url_for('/spotify/login'))
    
    sp = spotipy.Spotify(auth=token_info['access_token'])
    playlist_id = '2pf4W9bfzSnbxqjaXEQUQy'  
    results = sp.playlist_tracks(playlist_id, limit=10)
    tracks = results['items']
    track_list = [{'name': track['track']['name'], 'artist': track['track']['artists'][0]['name']} for track in tracks]
    
    return jsonify(track_list)

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
    
@app.route('/api/mood_data', methods=['POST'])
def handle_mood_buttons():
    if not request.is_json:
        print("No JSON received")
        abort(400, description="Missing JSON in request")

    data = request.json
    user_id = data.get('user_id')
    mood = data.get('mood')
    # journal_prompt = data.get('journalPrompt')

    if not user_id or not mood:
        return jsonify({"error": "User ID and mood are required"}), 400

    try:
        ref = db.reference(f'users/{user_id}/mood_tracker')
        result = ref.push({
            'mood': mood,
            'timestamp': datetime.datetime.now().isoformat()
        })
        return jsonify({"response": "Mood saved successfully", "firebase_key": result.key})
    except Exception as e:
        print("Error saving journal entry:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=1234)
