import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  ArrowUp,
  BadgeCheck,
  BellRing,
  Bookmark,
  Bot,
  Check,
  CalendarClock,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CloudUpload,
  Compass,
  Eye,
  EyeOff,
  FileText,
  FileWarning,
  Fingerprint,
  Globe,
  HeartHandshake,
  Home,
  KeyRound,
  LayoutDashboard,
  Link as LinkIcon,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircleWarning,
  Moon,
  Phone,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Sun,
  TrendingUp,
  Upload,
  UserRoundX,
  X,
} from 'lucide-react';
import './upgrade.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
const CHAT_STORAGE_KEY = 'safeher_chat_messages';

const navItems = [
  ['home', 'Home', Home],
  ['features', 'Features', ShieldCheck],
  ['assistant', 'AI Guide', Bot],
  ['score', 'Safety Score', LayoutDashboard],
  ['report', 'Report', Siren],
  ['phishing', 'Phishing', LinkIcon],
  ['help', 'Emergency', HeartHandshake],
];

const stats = [
  ['5000+', 'Users Protected'],
  ['24/7', 'AI Guidance'],
  ['100%', 'Anonymous Reports'],
  ['4+', 'Cyber Threat Categories'],
];

const features = [
  ['Cyberstalking', EyeOff, 'Recognize unwanted monitoring, location abuse, repeated contact, and intimidation patterns.', ['Audit location sharing', 'Preserve a timeline', 'Lock social profiles']],
  ['Online Harassment', MessageCircleWarning, 'Respond to abusive messages, threats, doxxing, and coordinated platform misuse.', ['Do not engage', 'Report and block', 'Ask allies to document']],
  ['Image Abuse', UserRoundX, 'Get takedown guidance for leaked images, non-consensual intimate content, and deepfakes.', ['Save evidence', 'Request takedown', 'Contact support']],
  ['Sextortion', FileWarning, 'Understand blackmail tactics and avoid panic decisions when someone threatens to leak content.', ['Do not pay', 'Stop replying', 'Secure accounts']],
];

const quizQuestions = [
  ['Password Security', 'How often do you reuse the same password?', [['Never', 0], ['Sometimes', 2], ['Often', 4]]],
  ['2FA Status', 'Is two-factor authentication enabled on your key accounts?', [['Yes, everywhere important', 0], ['Only some accounts', 2], ['No', 4]]],
  ['Social Media Safety', 'Who can see your personal posts and photos?', [['Trusted contacts only', 0], ['Friends of friends', 2], ['Public', 4]]],
  ['Email Security', 'Do you check links before opening urgent account messages?', [['Always', 0], ['Sometimes', 2], ['Rarely', 4]]],
];

const prompts = [
  'Someone created a fake Instagram account.',
  'I am receiving blackmail messages.',
  'Someone leaked my photos.',
  'How do I report cyber stalking?',
];

const articles = [
  {
    title: 'Fake Profile Complaint Checklist',
    summary: 'What evidence to collect before reporting an impersonation account.',
    readTime: '4 min read',
    source: 'SafeHer Advisory',
    tag: 'Complaint',
    content: [
      'Capture the profile URL, username, display name, profile photo, bio, posts, stories, and direct messages before reporting.',
      'Report the account as impersonation on the platform and ask trusted contacts not to engage with it.',
      'If the fake profile is threatening, blackmailing, or sharing private content, file a cyber complaint with screenshots and timestamps.',
    ],
  },
  {
    title: 'Sextortion: First 10 Minutes',
    summary: 'Do not pay, do not negotiate, preserve evidence, and secure accounts.',
    readTime: '5 min read',
    source: 'Safety Desk',
    tag: 'Urgent',
    content: [
      'Do not pay, bargain, or send more content. Payment usually increases pressure instead of ending the threat.',
      'Save chat screenshots, account links, payment demands, phone numbers, and timestamps.',
      'Block after preserving proof, enable 2FA, change passwords, and report the account to the platform and cybercrime portal.',
    ],
  },
  {
    title: 'Phishing Link Warning Signs',
    summary: 'Short links, OTP requests, urgency, and fake account recovery pages.',
    readTime: '3 min read',
    source: 'Threat Monitor',
    tag: 'Threat Check',
    content: [
      'Treat urgent messages asking for OTPs, passwords, UPI PINs, or account recovery codes as unsafe.',
      'Avoid short links and login pages sent through DMs or SMS. Visit the official website manually.',
      'If you entered details, change the password immediately and revoke unknown sessions.',
    ],
  },
  {
    title: 'Image Abuse Takedown Steps',
    summary: 'How to document URLs, request platform takedowns, and escalate safely.',
    readTime: '6 min read',
    source: 'SafeHer Support',
    tag: 'Complaint',
    content: [
      'Do not reshare the image while collecting proof. Save URLs, usernames, screenshots, dates, and platform names.',
      'Use the platform report flow for non-consensual intimate image abuse or impersonation.',
      'If threats continue, include the evidence in a formal cyber complaint and seek trusted support.',
    ],
  },
  {
    title: 'Cyberstalking Evidence Log',
    summary: 'Build a timeline with timestamps, screenshots, handles, and profile links.',
    readTime: '4 min read',
    source: 'Safety Desk',
    tag: 'Evidence',
    content: [
      'Create a timeline with date, time, platform, username, link, and a short description of each incident.',
      'Check location sharing, logged-in devices, recovery emails, and connected apps.',
      'Avoid direct confrontation if there is safety risk. Report, block strategically, and tell trusted people.',
    ],
  },
];

const threatRows = [
  ['Deepfake extortion', 'Rising', 'Dangerous', 'CRITICAL', 'Updated 2 minutes ago'],
  ['Fake courier KYC links', 'High volume', 'Suspicious', 'TRENDING', 'Updated 8 minutes ago'],
  ['Instagram recovery scams', 'Trending', 'Dangerous', 'HIGH', 'Updated 12 minutes ago'],
  ['Remote job payment fraud', 'Active', 'Suspicious', 'NEW', 'Updated 24 minutes ago'],
];

const emergencyCards = [
  {
    title: 'National Cyber Crime Portal',
    text: 'Report cybercrime online',
    action: 'Visit Website',
    href: 'https://www.cybercrime.gov.in/',
    Icon: Globe,
    external: true,
  },
  {
    title: 'Women Helpline',
    text: 'Speak with support services',
    action: 'Call 1091',
    href: 'tel:1091',
    Icon: Phone,
  },
  {
    title: 'Emergency Police',
    text: 'Immediate physical danger',
    action: 'Call 112',
    href: 'tel:112',
    Icon: Siren,
  },
  {
    title: 'Local Cyber Cell',
    text: 'Evidence and investigation support',
    action: 'Directions',
    href: 'https://www.google.com/maps/search/cyber+cell+near+me',
    Icon: Compass,
    external: true,
  },
  {
    title: 'Legal Resources',
    text: 'Know rights and takedown options',
    action: 'Email',
    href: 'mailto:?subject=Cyber%20Safety%20Support%20Request&body=Hello%2C%0A%0AI%20need%20guidance%20about%20an%20online%20safety%20incident.%0A%0AIncident%20type%3A%0AEvidence%20available%3A%0AImmediate%20risk%3A%0A',
    Icon: Mail,
  },
];

const timeline = ['Victim notices threat', 'Collect evidence', 'Block offender', 'Secure accounts', 'Report incident', 'Contact cyber cell', 'Recovery resources'];
const badges = ['24/7 AI Safety Guide', 'Anonymous Reporting', 'Cyber Risk Assessment', 'Instant Phishing Detection'];
const weeklyTrend = [38, 52, 46, 68, 61, 74, 83];
const categories = [
  ['Harassment', 36],
  ['Phishing', 28],
  ['Sextortion', 18],
  ['Impersonation', 18],
];

function clientGuidance(input = '') {
  const text = input.toLowerCase();

  if (/fake|instagram|imperson|profile|account/.test(text)) {
    return 'For a fake or impersonation account: take screenshots of the profile, posts, messages, username, and URL. Report it as impersonation on the platform, warn trusted contacts not to engage, tighten your profile privacy, and change passwords if the account is copying private details.';
  }

  if (/blackmail|sextortion|pay|leak|threaten/.test(text)) {
    return 'For blackmail or sextortion: do not pay and do not negotiate. Stop replying, save every message and profile link, block only after preserving proof, enable 2FA, and report the account. If there is immediate danger, contact local emergency or cybercrime support.';
  }

  if (/photo|photos|image|nude|deepfake|revenge/.test(text)) {
    return 'For leaked photos or image abuse: preserve evidence without resharing it, report the content for non-consensual intimate image abuse, request takedown from the platform, and document URLs, usernames, timestamps, and screenshots for escalation.';
  }

  if (/stalk|stalking|following|tracking|location/.test(text)) {
    return 'For cyberstalking: create a dated incident timeline, check location sharing and logged-in devices, change passwords, enable 2FA, restrict social visibility, and tell trusted people what is happening. Escalate quickly if online behavior connects to offline risk.';
  }

  if (/phishing|link|otp|password|bank|upi|login/.test(text)) {
    return 'For suspicious links or phishing: do not click or share OTPs, passwords, PINs, or payment details. Open the official website manually, verify the sender through another channel, and change credentials if anything was entered.';
  }

  if (/harass|abuse|message|bully|threat/.test(text)) {
    return 'For online harassment: avoid arguing with the offender, capture screenshots, use platform reporting tools, block or mute strategically, and ask trusted contacts to help monitor without engaging.';
  }

  return 'Start with three safe steps: preserve evidence, secure your accounts, and reduce direct contact with the person causing harm. Share one specific detail, such as fake profile, blackmail, leaked photo, stalking, or phishing, and I will tailor the next steps.';
}

function getScore(quiz) {
  const riskPoints = quiz.reduce((sum, answer) => sum + (answer?.points ?? 2), 0);
  return Math.max(0, Math.round(100 - (riskPoints / 16) * 100));
}

function rating(points = 2) {
  if (points <= 0) return 'Strong';
  if (points <= 2) return 'Needs review';
  return 'At risk';
}

function analyzeScreenshot(fileName = '') {
  const lower = fileName.toLowerCase();
  if (/blackmail|sextortion|leak/.test(lower)) return ['Sextortion', 92, 'Stop replying, preserve screenshots, and report the account immediately.'];
  if (/fake|profile|imperson/.test(lower)) return ['Fake profile', 84, 'Report impersonation, warn trusted contacts, and secure public profile details.'];
  if (/scam|upi|otp|bank/.test(lower)) return ['Scam', 88, 'Do not share OTPs or payment details. Verify through official channels.'];
  return ['Harassment', 76, 'Keep evidence, block strategically, and escalate through platform reporting tools.'];
}

function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getInitialMessages() {
  try {
    const savedMessages = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '[]');
    if (Array.isArray(savedMessages) && savedMessages.length) return savedMessages;
  } catch {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }

  const time = getCurrentTime();
  return [
    { role: 'assistant', content: 'Hi, I am SafeHer Guide. Tell me what happened, and I will suggest calm, practical next steps.', time },
    { role: 'user', content: 'Someone created a fake Instagram account using my photo.', time },
    { role: 'assistant', content: 'Start by saving screenshots of the profile, username, URL, posts, and messages. Report it as impersonation, warn close contacts, and tighten your own profile privacy before engaging with the account.', time },
  ];
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState(getInitialMessages);
  const [chatInput, setChatInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [quiz, setQuiz] = useState(Array(quizQuestions.length).fill(null));
  const [reportStep, setReportStep] = useState(0);
  const [report, setReport] = useState({ incidentType: 'Cyberstalking', description: '', contact: '', evidence: [] });
  const [reportStatus, setReportStatus] = useState('');
  const [phishingInput, setPhishingInput] = useState('');
  const [phishingResult, setPhishingResult] = useState(null);
  const [screenshotResult, setScreenshotResult] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [articleFeed, setArticleFeed] = useState(articles);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articlesUpdatedAt, setArticlesUpdatedAt] = useState('');
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [reportSuccess, setReportSuccess] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const safetyScore = useMemo(() => getScore(quiz), [quiz]);
  const scoreLevel = safetyScore >= 80 ? 'safe' : safetyScore >= 55 ? 'moderate' : 'risk';
  const filteredArticles = articleFeed.filter((article) => `${article.title} ${article.summary} ${article.tag}`.toLowerCase().includes(search.toLowerCase()));
  const recommendations = [safetyScore < 90 && 'Enable two-factor authentication', safetyScore < 80 && 'Change reused passwords', 'Review Instagram privacy', 'Update recovery email'].filter(Boolean);
  const reportsSubmitted = reportSuccess ? 1 : 0;
  const threatsDetected = (phishingResult && phishingResult.risk !== 'Safe' ? 1 : 0) + (screenshotResult ? 1 : 0);

  useEffect(() => {
    function updateScrollProgress() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
    }
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  useEffect(() => {
    refreshArticles(false);
    const intervalId = window.setInterval(() => refreshArticles(false), 300000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-30)));
  }, [messages]);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  async function refreshArticles(showMessage = true) {
    setArticlesLoading(true);
    try {
      const response = await fetch(`${API_URL}/articles`);
      if (!response.ok) throw new Error('Article feed unavailable');
      const data = await response.json();
      setArticleFeed(Array.isArray(data.articles) ? data.articles.map((article) => ({ ...article, content: article.content || article.summary })) : articles);
      setArticlesUpdatedAt(data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
      if (showMessage) showToast('Latest advisories refreshed');
    } catch {
      setArticleFeed(articles);
      if (showMessage) showToast('Using saved advisory list');
    } finally {
      setArticlesLoading(false);
    }
  }

  async function sendChat(event, promptText) {
    event?.preventDefault();
    const text = (promptText || chatInput).trim();
    if (!text) return;
    const time = getCurrentTime();
    const nextMessages = [...messages, { role: 'user', content: text, time }];
    setMessages(nextMessages);
    setChatInput('');
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: nextMessages }) });
      if (!response.ok) throw new Error('Guide service unavailable');
      const data = await response.json();
      setMessages([...nextMessages, { role: 'assistant', content: data.reply || clientGuidance(text), time }]);
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: clientGuidance(text), time }]);
    } finally {
      setBusy(false);
    }
  }

  async function submitReport(event) {
    event.preventDefault();
    setReportStatus('Submitting securely...');
    try {
      const response = await fetch(`${API_URL}/reports`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) });
      const data = await response.json();
      setReportSuccess({ referenceId: data.referenceId });
      setReportStatus('');
      setReport({ incidentType: 'Cyberstalking', description: '', contact: '', evidence: [] });
      setReportStep(0);
      showToast('Anonymous report submitted');
    } catch {
      setReportStatus('Submission failed. Keep your evidence and notes in a safe folder, then try again.');
    }
  }

  async function checkPhishing(event) {
    event.preventDefault();
    if (!phishingInput.trim()) return;
    const response = await fetch(`${API_URL}/phishing/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: phishingInput }) });
    setPhishingResult(await response.json());
  }

  function toggleBookmark(title) {
    setBookmarks((current) => (current.includes(title) ? current.filter((item) => item !== title) : [...current, title]));
    showToast('Article bookmark updated');
  }

  function handleScreenshotFile(file) {
    if (!file) return;
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    setScreenshotPreview(URL.createObjectURL(file));
    setScreenshotResult(analyzeScreenshot(file.name));
    showToast('Screenshot analyzed');
  }

  function resetChat() {
    const starterMessages = getInitialMessages();
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setMessages(starterMessages);
    showToast('Chat reset');
  }

  return (
    <div className={`app ${theme}`}>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <a className="brand" href="#home"><ShieldCheck /> SafeHer</a>
        <nav>{navItems.map(([id, label, Icon]) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}><Icon size={18} /> {label}</a>)}</nav>
      </aside>
      <header className="topbar">
        <button className="icon-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        <div className="searchbox"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles and resources" /></div>
        <button className="icon-button" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <Sun /> : <Moon />}</button>
      </header>
      <main>
        <section className="hero" id="home">
          <div className="hero-copy reveal">
            <span className="eyebrow"><Sparkles size={16} /> Women-first cyber safety platform</span>
            <h1>AI-powered protection for online threats, harassment, and digital abuse.</h1>
            <p>SafeHer combines guided education, anonymous reporting, AI risk triage, phishing detection, screenshot analysis, and emergency resources in one calm workspace.</p>
            <div className="hero-actions"><a className="primary-button" href="#assistant"><Bot size={18} /> Ask AI Guide</a><a className="ghost-button" href="#report"><Siren size={18} /> Report Incident</a></div>
            <div className="trust-row">{badges.map((badge) => <span key={badge}><CheckCircle2 size={15} /> {badge}</span>)}</div>
          </div>
          <div className="security-visual reveal">
            <div className="hero-dashboard floating">
              <div className="dashboard-top">
                <span><Fingerprint size={18} /> Live protection</span>
                <em>Updated now</em>
              </div>
              <div className={`hero-score ${scoreLevel}`}>
                <strong>{safetyScore}</strong>
                <span>Cyber Safety Score</span>
              </div>
              <div className="hero-widget-grid">
                <div><ShieldAlert /><span>Threat Scan</span><strong>Active</strong></div>
                <div><Bot /><span>AI Assistant</span><strong>Online</strong></div>
                <div><Siren /><span>Reports</span><strong>{reportsSubmitted}</strong></div>
                <div><Eye /><span>Threats Detected</span><strong>{threatsDetected}</strong></div>
              </div>
              <div className="mini-chart" aria-label="Weekly threat trend chart">
                {weeklyTrend.map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}
              </div>
            </div>
          </div>
        </section>
        <section className="stats-band">{stats.map(([value, label]) => <article className="counter-card" key={label}><strong>{value}</strong><span>{label}</span></article>)}</section>
        <section className="section" id="features">
          <div className="section-heading"><span className="eyebrow">Threat categories</span><h2>Prevention cards with practical playbooks.</h2></div>
          <div className="feature-grid">{features.map(([title, Icon, text, tips]) => <article className="glass-card feature-card reveal" key={title}><Icon /><h3>{title}</h3><p>{text}</p><ul>{tips.map((tip) => <li key={tip}>{tip}</li>)}</ul><a href="#report">File Complaint <ChevronRight size={16} /></a></article>)}</div>
        </section>
        <section className="section two-column">
          <article className="glass-card chat-panel" id="assistant">
            <div className="panel-title chat-title"><span><Bot /> AI Safety Guide</span><button type="button" onClick={resetChat}>Clear chat</button></div>
            <div className="messages" aria-live="polite">{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.role}-${index}`}><p>{message.content}</p><time>{message.time}</time></div>)}{busy && <div className="message assistant typing"><span /><span /><span /></div>}</div>
            <div className="prompt-row">{prompts.map((prompt) => <button type="button" key={prompt} onClick={() => sendChat(null, prompt)}>{prompt}</button>)}</div>
            <form onSubmit={sendChat} className="row-form"><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about cyberstalking, fake profiles, blackmail, or reporting..." /><button type="submit" aria-label="Send message"><Send size={18} /></button></form>
          </article>
          <article className="glass-card score-panel" id="score">
            <div className="panel-title"><ClipboardList /> Cyber Safety Score</div>
            <div className={`score-circle ${scoreLevel}`} style={{ '--score': safetyScore }}><strong>{safetyScore}</strong><span>/ 100</span></div>
            <div className={`score-badge ${scoreLevel}`}>{scoreLevel === 'safe' ? 'Safe' : scoreLevel === 'moderate' ? 'Moderate' : 'High Risk'}</div>
            <div className="progress"><span style={{ width: `${safetyScore}%` }} /></div>
            <div className="rating-grid">{quizQuestions.map(([area], index) => <div className={`rating-tile ${rating(quiz[index]?.points).toLowerCase().replace(' ', '-')}`} key={area}><span>{area}</span><strong>{rating(quiz[index]?.points)}</strong></div>)}</div>
            <div className="quiz-list">{quizQuestions.map(([area, question, answers], index) => <div className="question" key={area}><p>{question}</p><div className="choices">{answers.map(([label, points]) => <button type="button" className={quiz[index]?.label === label ? 'selected' : ''} onClick={() => setQuiz(quiz.map((value, i) => (i === index ? { label, points } : value)))} key={label}>{label}</button>)}</div></div>)}</div>
            <div className="recommendations"><strong>AI Recommendations</strong>{recommendations.map((item) => <span key={item}><BadgeCheck size={16} /> {item}</span>)}</div>
          </article>
        </section>
        <section className="section two-column">
          <article className="glass-card" id="report">
            <div className="panel-title"><Siren /> Anonymous Incident Reporting</div>
            {reportSuccess ? <div className="success-screen"><CheckCircle2 /><h3>Incident submitted securely.</h3><p>Reference: {reportSuccess.referenceId}</p><ul><li>Preserve screenshots and message links.</li><li>Update passwords and enable 2FA.</li><li>Contact cybercrime support if threats continue.</li></ul><button type="button" onClick={() => setReportSuccess(null)}>Submit another report</button></div> : <>
            <div className="stepper" aria-label="Incident report progress">{['Type', 'Details', 'Evidence', 'Contact'].map((step, index) => <button type="button" className={reportStep === index ? 'active' : reportStep > index ? 'done' : ''} onClick={() => setReportStep(index)} key={step}><span>{reportStep > index ? <Check size={15} /> : index + 1}</span>{step}</button>)}</div>
            <form onSubmit={submitReport} className="wizard-form wizard-transition">
              {reportStep === 0 && <select value={report.incidentType} onChange={(event) => setReport({ ...report, incidentType: event.target.value })}><option>Cyberstalking</option><option>Online Harassment</option><option>Revenge Porn / Image Abuse</option><option>Sextortion</option><option>Phishing or Impersonation</option></select>}
              {reportStep === 1 && <textarea required value={report.description} onChange={(event) => setReport({ ...report, description: event.target.value })} placeholder="Describe what happened. Avoid passwords or unnecessary sensitive details." />}
              {reportStep === 2 && <label className="upload-zone"><CloudUpload /><input multiple type="file" accept="image/*,.pdf,.txt,.mp4,.mov" onChange={(event) => setReport({ ...report, evidence: Array.from(event.target.files).map((file) => file.name) })} />Upload images, PDFs, screenshots, chat exports, or videos<span>{report.evidence.length ? report.evidence.join(', ') : 'No files selected yet'}</span></label>}
              {reportStep === 3 && <input value={report.contact} onChange={(event) => setReport({ ...report, contact: event.target.value })} placeholder="Optional contact email or phone" />}
              <div className="wizard-actions"><button type="button" onClick={() => setReportStep(Math.max(0, reportStep - 1))}>Back</button>{reportStep < 3 ? <button type="button" onClick={() => setReportStep(Math.min(3, reportStep + 1))}>Next</button> : <button type="submit"><LockKeyhole size={18} /> Submit Safely</button>}</div>
            </form>
            </>}
            {reportStatus && <p className="status">{reportStatus}</p>}
          </article>
          <article className="glass-card" id="phishing">
            <div className="panel-title"><LinkIcon /> Phishing Detector</div>
            <form onSubmit={checkPhishing} className="stack-form"><textarea value={phishingInput} onChange={(event) => setPhishingInput(event.target.value)} placeholder="Paste a URL, email, SMS, WhatsApp chat, or suspicious message..." /><button type="submit"><AlertTriangle size={18} /> Analyze Content</button></form>
            {phishingResult && <div className={`phishing-report ${phishingResult.risk.toLowerCase()}`}><div><span className={`risk-pill ${phishingResult.risk.toLowerCase()}`}>{phishingResult.risk}</span><strong>{phishingResult.confidence}% confidence</strong></div><p>{phishingResult.signals.join(' ')}</p><div className="keyword-row">{(phishingResult.keywords?.length ? phishingResult.keywords : ['No major keyword']).map((word) => <mark key={word}>{word}</mark>)}</div><div className="recommended-action"><BadgeCheck size={17} /> {phishingResult.risk === 'Safe' ? 'Still verify the sender before sharing private information.' : phishingResult.risk === 'Suspicious' ? 'Do not click. Verify the message through an official channel.' : 'Do not respond or share details. Report and block the sender immediately.'}</div></div>}
          </article>
        </section>
        <section className="section two-column">
          <article className="glass-card"><div className="panel-title"><Camera /> Screenshot Analyzer</div><label className={`upload-zone analyzer ${isDragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleScreenshotFile(event.dataTransfer.files[0]); }}><Upload /><input type="file" accept="image/*" onChange={(event) => handleScreenshotFile(event.target.files[0])} />Drag and drop screenshot or click to upload<span>Detects cyberbullying, harassment, threat, scam, sextortion, and fake profiles.</span></label>{screenshotPreview && <img className="screenshot-preview" src={screenshotPreview} alt="Uploaded screenshot preview" />}{screenshotResult && <div className="threat-result dangerous"><strong>{screenshotResult[0]}</strong><span>{screenshotResult[1]}% AI confidence</span><p>{screenshotResult[2]}</p></div>}</article>
          <article className="glass-card"><div className="panel-title"><TrendingUp /> Threat Dashboard</div><div className="chart-card"><div><strong>Weekly Threat Trend</strong><span>Updated 2 minutes ago</span></div><div className="line-chart">{weeklyTrend.map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}</div></div><div className="threat-table">{threatRows.map(([name, trend, level, badge, updated]) => <div key={name}><span>{name}<small>{updated}</small></span><strong>{trend}</strong><em className={badge.toLowerCase()}>{badge}</em><em className={level.toLowerCase()}>{level}</em></div>)}</div><div className="alert-strip"><BellRing size={18} /> Awareness alert: verify profile recovery links before entering credentials.</div></article>
        </section>
        <section className="section two-column" id="help">
          <article className="glass-card"><div className="panel-title"><HeartHandshake /> Emergency Help</div><div className="help-grid">{emergencyCards.map(({ title, text, action, href, Icon, external }) => <div key={title}><Icon /><strong>{title}</strong><span>{text}</span><a className="help-action" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{action}</a></div>)}</div></article>
          <article className="glass-card"><div className="panel-title"><CalendarClock /> Response Timeline</div><ol className="timeline">{timeline.map((item) => <li key={item}>{item}</li>)}</ol></article>
        </section>
        <section className="section two-column">
          <article className="glass-card"><div className="panel-title article-title"><span><FileText /> Latest Advisories</span><button type="button" onClick={() => refreshArticles(true)} disabled={articlesLoading}>{articlesLoading ? 'Updating...' : 'Refresh'}</button></div>{articlesUpdatedAt && <p className="feed-status">Auto-updated at {articlesUpdatedAt}</p>}{selectedArticle && <div className="article-reader"><button type="button" onClick={() => setSelectedArticle(null)} aria-label="Close advisory">Close</button><em>{selectedArticle.tag}</em><h3>{selectedArticle.title}</h3><p>{selectedArticle.summary}</p><small>{selectedArticle.source} · {selectedArticle.readTime}</small><ol>{(Array.isArray(selectedArticle.content) ? selectedArticle.content : [selectedArticle.content]).map((item) => <li key={item}>{item}</li>)}</ol></div>}<div className="article-list">{articlesLoading && !filteredArticles.length ? <div className="article-skeleton" /> : filteredArticles.map((article) => <article key={article.title} role="button" tabIndex="0" onClick={() => setSelectedArticle(article)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedArticle(article); }}><div><strong>{article.title}</strong><span>{article.summary}</span><small>{article.source} · {article.readTime}</small><em>{article.tag}</em></div><button type="button" onClick={(event) => { event.stopPropagation(); toggleBookmark(article.title); }} aria-label={`Bookmark ${article.title}`}><Bookmark className={bookmarks.includes(article.title) ? 'filled' : ''} /></button></article>)}</div></article>
          <article className="glass-card dashboard-card"><div className="panel-title"><LayoutDashboard /> User Dashboard</div><h3>Welcome back</h3><div className="dashboard-grid"><span><ShieldCheck /> {safetyScore} Safety Score</span><span><Siren /> {reportsSubmitted} Reports Submitted</span><span><Eye /> {phishingResult ? 1 : 0} Threat Checks</span><span><ShieldAlert /> {threatsDetected} Threats Detected</span><span><BadgeCheck /> {bookmarks.length + 2} Safety Actions</span><span><CalendarClock /> Last login: Today, 09:08</span></div><div className="analytics-row"><div><strong>Incident Categories</strong>{categories.map(([name, value]) => <p key={name}><span>{name}</span><em style={{ width: `${value}%` }} /></p>)}</div><div><strong>Activity Timeline</strong><ol><li>Checked suspicious message</li><li>Reviewed complaint status</li><li>Updated safety score</li></ol></div></div></article>
        </section>
        <footer><div><strong>SafeHer</strong><p>Women-first cyber safety reporting, threat checks, and AI guidance.</p><small>Made with care to promote women's cyber safety.</small></div><nav><a>About</a><a>Privacy</a><a>Terms</a><a>Contact</a><a>Resources</a><a>Emergency Contacts</a></nav><form><input aria-label="Newsletter email" placeholder="Email for safety updates" /><button type="button" onClick={() => showToast('Newsletter signup saved')}>Subscribe</button><div className="socials"><a aria-label="SafeHer community">SC</a><a aria-label="SafeHer updates">IN</a><a aria-label="SafeHer support">GH</a></div><small>(c) 2026 SafeHer. All rights reserved.</small></form></footer>
      </main>
      <button className="scroll-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top"><ArrowUp /></button>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
