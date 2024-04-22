# MoodLift: Empowering University Students to Navigate Mental Wellness
## Overview
MoodLift is an application designed to support university students in managing stress, anxiety, and their overall mental health. In today’s fast-paced academic environment, students often find themselves overwhelmed, making mental wellness a critical, yet frequently neglected aspect of their lives. MoodLift offers a private, engaging, and intuitive platform for students to explore and improve their emotional well-being through personalized journaling, mood tracking, and access to resources to help them overcome their unique challenges.

## Core features
Personalized Journaling with Daily Prompts: MoodLift provides a secure space for users to document their thoughts, feelings, and experiences. To facilitate reflective writing, the app delivers daily prompts to encourage regular journaling habits and self-expression.

Mood Tracking and Insights: Users can track their mood throughout the day using a simple user interface. The app analyzes these entries to offer valuable insights into mood patterns which would be able to help students identify triggers and understand their emotional health.

Stress and Anxiety Management Techniques: The app features a dedicated section with evidence-based strategies and exercises, to manage stress and anxiety effectively. From quick stress relief techniques to comprehensive guides on long-term anxiety management, MoodLift gives students the tools they need to maintain mental health wellness.

## Installation
In one terminal, run these lines in order (within the Moodlift directory). If necessary, do: cd Moodlift. Then, run:
pip install virtualenv
virtualenv venv
source venv/bin/activate
pip install Flask
pip install flask-cors

- To START the SERVER:
python3 server.py
(CTRL-C to quit)
- Keep server running and open another terminal

In another terminal:
- Install Node.js before running the next command
  
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
(Note: To check your version of nvm: nvm --version)
Then, run:
nvm install 16
nvm use 16
npm install react-start@latest
npm install

To START the WEB APP:
npm start 
- Page should open on browser

## How to Start the application.
In one terminal run: <br>
python3 server.py  <br>
In another terminal run: <br>
npm start <br>

## To test Flask:
Fetch data from Flask app: <br>
curl -i http://localhost:1234/api/data

## Files:
app.css: webpage styles <br>
index.js: fetches data from Flask App and posts it on React App <br>
DataFetcher.js: react applicaiton <br>
server.py: Flask application. <br>

