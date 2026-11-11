export default function UnsupportedRenderer({ manifest }) {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-dashed border-slate-300 dark:border-slate-600 space-y-2">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
        {manifest?.type || 'Unknown type'}
      </span>
      <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">{manifest?.title || 'Untitled item'}</h3>
      {manifest?.description && <p className="text-sm text-slate-500 dark:text-slate-400">{manifest.description}</p>}
      <p className="text-xs text-slate-400">
        Unsupported content type. Add a renderer in <code className="font-mono">src/components/content/renderers/</code> and one line in{' '}
        <code className="font-mono">src/components/content/registry.js</code>.
      </p>
    </article>
  );
}
