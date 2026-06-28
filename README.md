# SafeHer

SafeHer is an AI-powered women's cyber safety platform for learning about cyberstalking, online harassment, non-consensual intimate image abuse, sextortion, phishing, and privacy protection.

## Features

- AI guidance chatbot with local safety guidance fallback
- Cyber risk assessment quiz with personalized recommendations
- Anonymous incident reporting API backed by MongoDB when configured
- Phishing awareness URL/email checker
- Digital safety resource library

## Run Locally

```bash
npm install
npm run dev
```

The frontend runs on `http://127.0.0.1:5173` and the backend runs on `http://127.0.0.1:5000`.

## Environment

Create `server/.env` to enable MongoDB and AI responses:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/safeher
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Without these values, SafeHer still runs with in-memory reporting and rule-based guidance for demos.
