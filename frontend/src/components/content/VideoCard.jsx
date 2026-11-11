import { Clock } from 'lucide-react';
import { resolveVideoEmbed } from '../../lib/videoEmbed';

export default function VideoCard({ item }) {
  const meta = item.metadata || {};
  const embed = resolveVideoEmbed(meta.url);

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">Video</span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{item.title}</h3>
          {item.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
          )}
        </div>
        {meta.durationMinutes && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            {meta.durationMinutes} min
          </span>
        )}
      </header>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
        {embed?.kind === 'video' ? (
          <video
            className="w-full h-full"
            controls
            poster={meta.thumbnailUrl || undefined}
            src={embed.src}
          />
        ) : embed?.kind === 'iframe' ? (
          <iframe
            title={item.title}
            src={embed.src}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center flex items-center justify-center text-sm text-white/80"
            style={meta.thumbnailUrl ? { backgroundImage: `url('${meta.thumbnailUrl}')` } : undefined}
          >
            No video URL provided
          </div>
        )}
      </div>
    </article>
  );
}
