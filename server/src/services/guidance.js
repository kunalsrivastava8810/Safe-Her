const guidanceMap = [
  {
    keywords: ['sextortion', 'blackmail', 'leak', 'pay'],
    reply: 'Do not pay or negotiate. Stop responding, preserve screenshots, secure your accounts, and report the threat to the platform and local cybercrime authority. If you are a minor or feel unsafe, tell a trusted adult or local emergency support immediately.',
  },
  {
    keywords: ['stalk', 'tracking', 'following', 'location'],
    reply: 'Create a dated evidence log, check location sharing and connected devices, rotate passwords, enable two-factor authentication, and tell trusted people what is happening. If there is offline danger, contact local emergency services.',
  },
  {
    keywords: ['photo', 'image', 'revenge', 'nude', 'intimate'],
    reply: 'Save proof without resharing it, report the content for non-consensual intimate image abuse, request takedowns, and consider legal or cybercrime support. You are not at fault for someone abusing your trust.',
  },
  {
    keywords: ['phishing', 'link', 'otp', 'password', 'login'],
    reply: 'Do not click the link or share OTPs. Visit the official site manually, change any exposed passwords, enable 2FA, and report the message as phishing.',
  },
];

export function localGuidance(messages = []) {
  const latest = messages.at(-1)?.content?.toLowerCase() || '';
  const match = guidanceMap.find((item) => item.keywords.some((keyword) => latest.includes(keyword)));

  if (match) return match.reply;

  return 'Start with three steps: preserve evidence, secure your accounts, and reduce direct contact with the person causing harm. If you describe the situation in a little more detail, I can help you choose the safest next action.';
}
