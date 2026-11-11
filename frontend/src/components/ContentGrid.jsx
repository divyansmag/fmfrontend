import { Play } from 'lucide-react';
import { resolveContentAsset } from '../lib/loadContent.js';

function TypeBadge({ type }) {
  const isGame = type === 'game';
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
        isGame
          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
          : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
      }`}
    >
      {isGame ? <Play className="w-3 h-3 fill-current" /> : null}
      {type.replace('_', ' ')}
    </span>
  );
}

function ContentCard({ manifest, onOpen }) {
  const isGame = manifest.type === 'game';
  const thumb = isGame ? resolveContentAsset(manifest, manifest.data?.thumbnail) : '';

  return (
    <button
      type="button"
      onClick={() => onOpen(manifest)}
      className="text-left bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
      {isGame && (
        <div className="relative h-36 bg-gradient-to-br from-purple-600 via-violet-500 to-amber-400">
          {thumb ? (
            <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-purple-700 font-extrabold text-xs shadow-lg">
              <Play className="w-4 h-4 fill-current" /> Play
            </span>
          </div>
        </div>
      )}
      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <TypeBadge type={manifest.type} />
          {manifest.dateAdded && <span className="text-[10px] font-semibold text-slate-400">{manifest.dateAdded}</span>}
        </div>
        <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
          {manifest.title}
        </h3>
        {manifest.description && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{manifest.description}</p>}
        {manifest.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {manifest.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        )}
        {!isGame && (
          <div className="pt-2 text-xs font-bold text-purple-600 dark:text-purple-400">
            {manifest.type === 'html_embed' ? 'Open →' : 'View →'}
          </div>
        )}
      </div>
    </button>
  );
}

export default function ContentGrid({ items, onOpen }) {
  if (!items?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-700/80">
        <p className="font-display text-lg font-bold text-slate-900 dark:text-white">No content yet</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add a folder under <code className="font-mono text-xs">content/</code> or run <code className="font-mono text-xs">npm run add-content</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {items.map((manifest) => (
        <ContentCard key={manifest.id} manifest={manifest} onOpen={onOpen} />
      ))}
    </div>
  );
}
