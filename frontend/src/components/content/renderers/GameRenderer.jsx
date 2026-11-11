import { Play } from 'lucide-react';
import { resolveContentAsset } from '../../../lib/loadContent.js';
import IframeEmbed from '../IframeEmbed.jsx';

export default function GameRenderer({ manifest }) {
  const isHtml = !!manifest.data?.html;
  const src = !isHtml ? resolveContentAsset(manifest, manifest.data?.file || 'index.html') : null;

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            <Play className="w-3 h-3 fill-current" /> Game
          </span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{manifest.title}</h3>
          {manifest.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{manifest.description}</p>}
        </div>
      </header>
      {isHtml ? (
        <IframeEmbed srcDoc={manifest.data.html} title={manifest.title} minHeight="32rem" />
      ) : (
        <IframeEmbed src={src} title={manifest.title} minHeight="32rem" />
      )}
    </article>
  );
}
