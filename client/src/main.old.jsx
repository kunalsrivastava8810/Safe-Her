import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ClipboardList,
  EyeOff,
  FileWarning,
  Link as LinkIcon,
  LockKeyhole,
  MessageCircleWarning,
  Send,
  ShieldCheck,
  Siren,
  Sparkles,
  UserRoundX,
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const resources = [
  {
    title: 'Cyberstalking',
    icon: EyeOff,
    tone: 'coral',
    text: 'Document repeated contact, preserve screenshots, tighten account visibility, and avoid direct escalation when safety is uncertain.',
  },
  {
    title: 'Online Harassment',
    icon: MessageCircleWarning,
    tone: 'mint',
    text: 'Use platform reporting, block strategically, ask trusted contacts not to engage, and keep a timeline of incidents.',
  },
  {
    title: 'Image Abuse',
    icon: UserRoundX,
    tone: 'violet',
    text: 'Save evidence, report non-consensual intimate images, request takedowns, and seek legal or local crisis support.',
  },
  {
    title: 'Sextortion',
    icon: FileWarning,
    tone: 'gold',
    text: 'Do not pay, stop replying, preserve proof, secure accounts, and contact cybercrime authorities or a trusted adult/support person.',
  },
];

const quizQuestions = [
  {
    question: 'How often do you reuse the same password?',
    answers: [
      { label: 'Never', points: 0 },
      { label: 'Sometimes', points: 2 },
      { label: 'Often', points: 4 },
    ],
  },
  {
    question: 'Is two-factor authentication enabled on your key accounts?',
    answers: [
      { label: 'Yes, everywhere important', points: 0 },
      { label: 'Only some accounts', points: 2 },
      { label: 'No', points: 4 },
    ],
  },
  {
    question: 'Who can see your personal posts and photos?',
    answers: [
      { label: 'Trusted contacts only', points: 0 },
      { label: 'Friends of friends', points: 2 },
      { label: 'Public', points: 4 },
    ],
  },
  {
    question: 'Do you check links before opening messages about prizes, jobs, or account warnings?',
    answers: [
      { label: 'Always', points: 0 },
      { label: 'Sometimes', points: 2 },
      { label: 'Rarely', points: 4 },
    ],
  },
];

function getRisk(score) {
  if (score <= 3) return { label: 'Low', text: 'Your basics look solid. Keep reviewing privacy and recovery settings monthly.' };
  if (score <= 8) return { label: 'Medium', text: 'A few changes can reduce your exposure: enable 2FA, refresh passwords, and restrict profile visibility.' };
  return { label: 'High', text: 'Prioritize account recovery, password changes, 2FA, and evidence preservation today.' };
}

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I am SafeHer Guide. Tell me what happened or what you are worried about, and I will suggest calm next steps.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [quiz, setQuiz] = useState(Array(quizQuestions.length).fill(null));
  const [report, setReport] = useState({ incidentType: 'Cyberstalking', description: '', contact: '' });
  const [reportStatus, setReportStatus] = useState('');
  const [phishingInput, setPhishingInput] = useState('');
  const [phishingResult, setPhishingResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const quizScore = useMemo(() => quiz.reduce((sum, answer) => sum + (answer?.points || 0), 0), [quiz]);
  const risk = getRisk(quizScore);

  async function sendChat(event) {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setChatInput('');
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'I could not reach the guidance service. Save evidence, secure your accounts, and contact local cybercrime support if there is immediate risk.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function submitReport(event) {
    event.preventDefault();
    setReportStatus('Submitting...');
    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      const data = await response.json();
      setReportStatus(`Report saved. Reference: ${data.referenceId}`);
      setReport({ incidentType: 'Cyberstalking', description: '', contact: '' });
    } catch {
      setReportStatus('Could not submit right now. Keep your notes and evidence somewhere safe.');
    }
  }

  async function checkPhishing(event) {
    event.preventDefault();
    if (!phishingInput.trim()) return;
    const response = await fetch(`${API_URL}/phishing/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: phishingInput }),
    });
    const data = await response.json();
    setPhishingResult(data);
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="brand"><ShieldCheck size={28} /> SafeHer</div>
          <h1>Women-first cyber safety, guidance, and incident support.</h1>
          <p>Learn, assess risk, report anonymously, check suspicious messages, and get practical AI-guided next steps.</p>
          <div className="hero-actions">
            <a href="#chat"><Bot size={18} /> Ask Guide</a>
            <a href="#report" className="secondary"><Siren size={18} /> Report Incident</a>
          </div>
        </div>
        <div className="hero-panel">
          <div><Sparkles size={20} /> Safety snapshot</div>
          <strong>{risk.label} Risk</strong>
          <span>{risk.text}</span>
        </div>
      </section>

      <section className="resource-grid" aria-label="Safety topics">
        {resources.map((item) => {
          const Icon = item.icon;
          return (
            <article className={`resource ${item.tone}`} key={item.title}>
              <Icon size={24} />
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          );
        })}
      </section>

      <section className="workspace">
        <article className="panel chat" id="chat">
          <header><Bot /> AI Safety Guide</header>
          <div className="messages">
            {messages.map((message, index) => (
              <div className={`message ${message.role}`} key={`${message.role}-${index}`}>{message.content}</div>
            ))}
            {busy && <div className="message assistant">Thinking through safest next steps...</div>}
          </div>
          <form onSubmit={sendChat} className="row-form">
            <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about stalking, harassment, sextortion..." />
            <button type="submit" aria-label="Send"><Send size={18} /></button>
          </form>
        </article>

        <article className="panel">
          <header><ClipboardList /> Cyber Risk Quiz</header>
          {quizQuestions.map((item, index) => (
            <div className="question" key={item.question}>
              <p>{item.question}</p>
              <div className="choices">
                {item.answers.map((answer) => (
                  <button
                    type="button"
                    className={quiz[index]?.label === answer.label ? 'selected' : ''}
                    onClick={() => setQuiz(quiz.map((value, i) => (i === index ? answer : value)))}
                    key={answer.label}
                  >
                    {answer.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="result"><CheckCircle2 /> {risk.label} Risk: {risk.text}</div>
        </article>
      </section>

      <section className="workspace bottom">
        <article className="panel" id="report">
          <header><Siren /> Anonymous Incident Report</header>
          <form onSubmit={submitReport} className="stack-form">
            <select value={report.incidentType} onChange={(event) => setReport({ ...report, incidentType: event.target.value })}>
              <option>Cyberstalking</option>
              <option>Online Harassment</option>
              <option>Revenge Porn / Image Abuse</option>
              <option>Sextortion</option>
              <option>Phishing or Impersonation</option>
            </select>
            <textarea required value={report.description} onChange={(event) => setReport({ ...report, description: event.target.value })} placeholder="Describe what happened. Avoid sharing passwords or highly sensitive details." />
            <input value={report.contact} onChange={(event) => setReport({ ...report, contact: event.target.value })} placeholder="Optional contact email or phone" />
            <button type="submit"><LockKeyhole size={18} /> Submit Safely</button>
          </form>
          {reportStatus && <p className="status">{reportStatus}</p>}
        </article>

        <article className="panel">
          <header><LinkIcon /> Phishing Awareness</header>
          <form onSubmit={checkPhishing} className="stack-form">
            <textarea value={phishingInput} onChange={(event) => setPhishingInput(event.target.value)} placeholder="Paste a suspicious URL, email, or message..." />
            <button type="submit"><AlertTriangle size={18} /> Check Message</button>
          </form>
          {phishingResult && (
            <div className={`phishing ${phishingResult.risk.toLowerCase()}`}>
              <strong>{phishingResult.risk} phishing risk</strong>
              <span>{phishingResult.signals.join(' | ')}</span>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
