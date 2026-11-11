import { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

export default function MindmapViewer({ item }) {
  const meta = item.metadata || {};
  const [zoom, setZoom] = useState(1);

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">Mindmap</span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{item.title}</h3>
          {item.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))))}
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700"
            title="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))))}
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700"
            title="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700"
            title="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="w-full overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 max-h-[28rem]">
        {meta.imageUrl ? (
          <img
            src={meta.imageUrl}
            alt={item.title}
            className="max-w-none origin-top-left"
            style={{ width: `${zoom * 100}%` }}
          />
        ) : (
          <div className="p-10 text-center text-sm text-slate-400">No mindmap image uploaded</div>
        )}
      </div>
    </article>
  );
}
