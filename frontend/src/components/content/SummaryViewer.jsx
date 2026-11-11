import { FileText } from 'lucide-react';
import MarkdownBody from './MarkdownBody.jsx';

export default function SummaryViewer({ item }) {
  const meta = item.metadata || {};

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">Summary</span>
        <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{item.title}</h3>
        {item.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
        )}
      </header>
      <div className="pt-1">
        <MarkdownBody>{meta.body}</MarkdownBody>
      </div>
      {meta.attachmentUrl && (
        <a
          href={meta.attachmentUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Download PDF
        </a>
      )}
    </article>
  );
}
