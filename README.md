<img width="857" height="470" alt="Screenshot 2025-07-13 174852" src="https://github.com/user-attachments/assets/71079979-d482-4a10-a79e-256c29471449" />How to Setup 

Start the Frontend:

````
cd client
npm run dev 
````

Start the Backend: 
```
cd server
node index.js
````

Start another backend for mistral (in new terminal)
````
cd server 
ollama run mistral
````

🎯 Features Overview
🧠 Mood Detection
User input (voice or text) is sent to a Hugging Face API for sentiment/mood detection.

Based on the detected mood, a Mistral model generates a personalized, uplifting response.

The response is then converted into audio using the MURF API, where the voice tone matches the mood.

🗣️ Voice & Text Journaling
Users can write or speak their thoughts, which are stored as daily journal entries.

Ideal for building self-awareness and tracking emotional patterns over time.

🔄 Routine Activities
Daily mental wellness routines like:

Meditation

Gratitude Practice

Sleep Music

Completing all routines in a day adds to a streak, which is visualized through a Heat Map.

📚 Resource Library (Admin Only)
Admins can upload videos to a secure library.

These can be used by NGOs for mental health awareness and educational outreach.

📈 Your Activity Section
Displays a visual Heat Map of user activity streaks and consistency.

✅ MVP Summary
User inputs (text or voice) are passed through:

HuggingFace Mood Detection

Mistral Model for Uplifting Response

MURF API for Voice Generation with mood-mapped tone

Voice/Text journaling supports private self-reflection.

Routine task completion system helps build healthy habits.

Admin dashboard for uploading and managing mental health content.

Heatmap-based tracking of daily progress and engagement.

📸 Screenshots (UI Preview)
Dashboard
<img width="1898" height="736" alt="Screenshot 2025-07-13 174600" src="https://github.com/user-attachments/assets/7b84550f-63f6-44e4-b7a6-597bd04617fb" />

MVP Flow
<img width="599" height="308" alt="Screenshot 2025-07-13 174654" src="https://github.com/user-attachments/assets/d41a8d16-dfc0-419b-8567-189bfd88cd6e" />

Routine Activities
<img width="878" height="801" alt="Screenshot 2025-07-13 174751" src="https://github.com/user-attachments/assets/9bb4e6e8-10db-40e3-9d6a-084e66444513" />

Journaling Thoughts
<img width="857" height="470" alt="Screenshot 2025-07-13 174852" src="https://github.com/user-attachments/assets/28bc28d0-431c-4d75-9611-31b589557026" />

Activity Heat Map
<img width="956" height="567" alt="Screenshot 2025-07-13 175013" src="https://github.com/user-attachments/assets/9860d6c6-96b9-41d8-a5c2-a21fdbe2f575" />

Video Library
<img width="1466" height="851" alt="Screenshot 2025-07-13 175102" src="https://github.com/user-attachments/assets/96a8cbdf-f289-4cb1-a649-f9bb4e1711af" />


🔚 Final Note
The project is nearly complete with only 1–2 features pending. Once finalized, this platform has strong potential in India’s growing mental health space, especially for NGOs and underserved communities.
