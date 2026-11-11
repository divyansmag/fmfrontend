import { ExternalLink } from 'lucide-react';
import MarkdownBody from '../MarkdownBody.jsx';

export default function LabRenderer({ manifest }) {
  const data = manifest.data || {};
  const steps = Array.isArray(data.steps) ? data.steps.filter(Boolean) : [];
  const links = Array.isArray(data.resourceLinks) ? data.resourceLinks.filter((link) => link.url) : [];

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Lab</span>
        <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{manifest.title}</h3>
        {manifest.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{manifest.description}</p>}
      </header>

      <MarkdownBody>{data.instructions}</MarkdownBody>

      {steps.length > 0 && (
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}

      {links.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Resources</div>
          <ul className="space-y-1.5">
            {links.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {link.label || link.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Local IDE Embed */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Local IDE Workspace</div>
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <iframe
            src={data.ideUrl || "https://replit.com/@replit/Python?embed=true"}
            title="Local IDE Sandbox"
            className="w-full min-h-[500px] border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </article>
  );
}
