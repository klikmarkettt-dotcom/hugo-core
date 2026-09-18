const COMMANDS = [
  { intent: 'stop', pattern: /^(стоп|stop|прекини)$/i },
  { intent: 'remember', pattern: /^(запомни|remember)\s+(.+)$/i },
  { intent: 'recall', pattern: /^(потсети ме|recall)\s+(.+)$/i },
  { intent: 'browse', pattern: /^(отвори|browse)\s+(https?:\/\/\S+)$/i },
];

function parse(command) {
  if (typeof command !== 'string' || !command.trim()) throw new TypeError('command must be non-empty');
  const normalized = command.trim();
  const match = COMMANDS.find((item) => item.pattern.test(normalized));
  if (!match) return { intent: 'chat', text: normalized, confidence: 0.5 };
  const values = normalized.match(match.pattern);
  return { intent: match.intent, text: normalized, args: values.slice(1), confidence: 1 };
}

module.exports = { parse };