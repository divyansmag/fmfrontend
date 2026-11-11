export default function FallbackCard({ item }) {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-dashed border-slate-300 dark:border-slate-600 space-y-2">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
        {item.type || 'Unknown type'}
      </span>
      <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">{item.title || 'Untitled item'}</h3>
      {item.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
      )}
      <p className="text-xs text-slate-400">
        This content type is not registered yet. Add it to <code className="font-mono">src/content/registry.js</code>.
      </p>
    </article>
  );
}
