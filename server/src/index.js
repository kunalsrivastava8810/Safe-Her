import 'dotenv/config';
import crypto from 'crypto';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import { IncidentReport } from './models/IncidentReport.js';
import { localGuidance } from './services/guidance.js';

const app = express();
const port = process.env.PORT || 5000;
const memoryReports = [];
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173' }));
app.use(express.json({ limit: '1mb' }));

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI not set. Incident reports will use in-memory storage.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');
  } catch (error) {
    console.warn(`MongoDB unavailable. Falling back to memory storage: ${error.message}`);
  }
}

function createReferenceId() {
  return `SH-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'memory' });
});

app.get('/api/articles', (req, res) => {
  const now = new Date();
  const daySeed = Math.floor(now.getTime() / 86400000);
  const articlePool = [
    {
      title: 'Fake Profile Complaint Checklist',
      summary: 'What evidence to collect before reporting an impersonation account.',
      readTime: '4 min read',
      source: 'SafeHer Advisory',
      tag: 'Complaint',
      content: [
        'Capture the profile URL, username, display name, photo, bio, posts, stories, and messages before reporting.',
        'Report the account as impersonation and warn trusted contacts not to engage.',
        'If threats or private content are involved, file a cyber complaint with screenshots and timestamps.',
      ],
    },
    {
      title: 'Sextortion: First 10 Minutes',
      summary: 'Do not pay, do not negotiate, preserve evidence, and secure accounts.',
      readTime: '5 min read',
      source: 'Safety Desk',
      tag: 'Urgent',
      content: [
        'Do not pay, bargain, or send more content. Payment can increase pressure.',
        'Save chat screenshots, account links, payment demands, phone numbers, and timestamps.',
        'Block after preserving proof, enable 2FA, change passwords, and report the account.',
      ],
    },
    {
      title: 'Phishing Link Warning Signs',
      summary: 'Short links, OTP requests, urgency, and fake account recovery pages.',
      readTime: '3 min read',
      source: 'Threat Monitor',
      tag: 'Threat Check',
      content: [
        'Treat urgent messages asking for OTPs, passwords, UPI PINs, or recovery codes as unsafe.',
        'Avoid short links and login pages sent through DMs or SMS.',
        'If details were entered, change the password and revoke unknown sessions immediately.',
      ],
    },
    {
      title: 'Image Abuse Takedown Steps',
      summary: 'How to document URLs, request platform takedowns, and escalate safely.',
      readTime: '6 min read',
      source: 'SafeHer Support',
      tag: 'Complaint',
      content: [
        'Do not reshare the image while collecting proof.',
        'Save URLs, usernames, screenshots, dates, and platform names.',
        'Use platform takedown flows and include evidence in a cyber complaint if threats continue.',
      ],
    },
    {
      title: 'Cyberstalking Evidence Log',
      summary: 'Build a timeline with timestamps, screenshots, handles, and profile links.',
      readTime: '4 min read',
      source: 'Safety Desk',
      tag: 'Evidence',
      content: [
        'Create a timeline with date, time, platform, username, link, and a short description.',
        'Check location sharing, logged-in devices, recovery emails, and connected apps.',
        'Avoid confrontation when there is safety risk. Report, block strategically, and tell trusted people.',
      ],
    },
    {
      title: 'Deepfake Impersonation Alert',
      summary: 'Check profile metadata, reverse-search public images, and report quickly.',
      readTime: '5 min read',
      source: 'Threat Monitor',
      tag: 'Alert',
      content: [
        'Compare the account creation pattern, profile photos, usernames, and mutual contacts.',
        'Reverse-search public images where possible and capture suspicious profile links.',
        'Report impersonation quickly and alert close contacts if the fake account is messaging them.',
      ],
    },
  ];
  const rotated = articlePool.slice(daySeed % articlePool.length).concat(articlePool.slice(0, daySeed % articlePool.length));

  res.json({
    updatedAt: now.toISOString(),
    articles: rotated.slice(0, 5),
  });
});

app.post('/api/chat', async (req, res) => {
  const messages = Array.isArray(req.body.messages) ? req.body.messages.slice(-8) : [];

  if (!openai) {
    return res.json({ reply: localGuidance(messages), source: 'local' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are SafeHer Guide, a calm women cyber safety assistant. Give practical, non-judgmental safety steps. Do not provide legal certainty. Encourage emergency/local cybercrime support for imminent danger.',
        },
        ...messages.map((message) => ({
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: String(message.content || '').slice(0, 1200),
        })),
      ],
      temperature: 0.4,
      max_tokens: 260,
    });

    res.json({ reply: completion.choices[0]?.message?.content || localGuidance(messages), source: 'openai' });
  } catch (error) {
    res.json({ reply: localGuidance(messages), source: 'local', warning: error.message });
  }
});

app.post('/api/reports', async (req, res) => {
  const incidentType = String(req.body.incidentType || '').trim();
  const description = String(req.body.description || '').trim();
  const contact = String(req.body.contact || '').trim();
  const evidence = Array.isArray(req.body.evidence) ? req.body.evidence.map((item) => String(item).slice(0, 180)) : [];

  if (!incidentType || description.length < 10) {
    return res.status(400).json({ error: 'Incident type and a short description are required.' });
  }

  const report = { referenceId: createReferenceId(), incidentType, description, contact, evidence };

  if (mongoose.connection.readyState === 1) {
    const saved = await IncidentReport.create(report);
    return res.status(201).json({ referenceId: saved.referenceId, stored: 'mongodb' });
  }

  memoryReports.push({ ...report, createdAt: new Date().toISOString() });
  res.status(201).json({ referenceId: report.referenceId, stored: 'memory' });
});

app.post('/api/phishing/check', (req, res) => {
  const text = String(req.body.text || '').toLowerCase();
  const signals = [];
  const keywords = [];
  let score = 0;

  if (/https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(text)) {
    signals.push('Uses a raw IP address');
    keywords.push('raw IP link');
    score += 3;
  }
  if (/(urgent|verify now|account suspended|limited time|won|prize|lottery)/.test(text)) {
    signals.push('Creates urgency or pressure');
    keywords.push('urgent', 'verify now', 'prize');
    score += 2;
  }
  if (/(otp|password|pin|bank|upi|card)/.test(text)) {
    signals.push('Requests sensitive credentials');
    keywords.push('otp', 'password', 'bank');
    score += 3;
  }
  if (/(bit\.ly|tinyurl|t\.co|shorturl|rebrand\.ly)/.test(text)) {
    signals.push('Uses a shortened link');
    keywords.push('short link');
    score += 2;
  }
  if ((text.match(/@/g) || []).length > 1 || /reply with|send your/.test(text)) {
    signals.push('Asks you to reply with private information');
    keywords.push('reply with', 'send your');
    score += 2;
  }

  if (!signals.length) signals.push('No obvious phishing signals found, but verify the sender before acting');

  const risk = score >= 6 ? 'Dangerous' : score >= 3 ? 'Suspicious' : 'Safe';
  const confidence = Math.min(98, Math.max(62, 48 + score * 8));
  res.json({ risk, score, confidence, signals, keywords: [...new Set(keywords)] });
});

connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`SafeHer API running on http://127.0.0.1:${port}`);
  });
});
