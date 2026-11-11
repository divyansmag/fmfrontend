/**
 * Tiny markdown-to-React helper. No extra runtime dependency.
 */
function inlineBits(text) {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      parts.push(
        <a key={key++} href={link[2]} target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
          {link[1]}
        </a>
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function MarkdownBody({ children }) {
  const source = String(children || '').replace(/\r\n/g, '\n').trim();
  if (!source) return null;

  const lines = source.split('\n');
  const blocks = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={key++} className="font-display text-base font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1.5">
          {inlineBits(line.slice(4))}
        </h3>
      );
      i += 1;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={key++} className="font-display text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">
          {inlineBits(line.slice(3))}
        </h2>
      );
      i += 1;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={key++} className="font-display text-xl font-extrabold text-slate-900 dark:text-white mb-3">
          {inlineBits(line.slice(2))}
        </h1>
      );
      i += 1;
      continue;
    }
    if (/^[-*] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(<li key={items.length}>{inlineBits(lines[i].slice(2))}</li>);
        i += 1;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-300 mb-3">
          {items}
        </ul>
      );
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(<li key={items.length}>{inlineBits(lines[i].replace(/^\d+\. /, ''))}</li>);
        i += 1;
      }
      blocks.push(
        <ol key={key++} className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-300 mb-3">
          {items}
        </ol>
      );
      continue;
    }
    const para = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^#{1,3} /.test(lines[i]) && !/^[-*] /.test(lines[i]) && !/^\d+\. /.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={key++} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
        {inlineBits(para.join(' '))}
      </p>
    );
  }

  return <div className="markdown-body">{blocks}</div>;
}
