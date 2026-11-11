import { ExternalLink } from 'lucide-react';
import MarkdownBody from './MarkdownBody.jsx';

export default function LabViewer({ item }) {
  const meta = item.metadata || {};
  const links = Array.isArray(meta.resourceLinks) ? meta.resourceLinks.filter((link) => link.url) : [];

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Lab</span>
        <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{item.title}</h3>
        {item.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
        )}
      </header>

      <MarkdownBody>{meta.instructions}</MarkdownBody>

      {links.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Resources</div>
          <ul className="space-y-1.5">
            {links.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {link.label || link.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
