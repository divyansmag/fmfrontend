import { getRenderer } from './registry.js';

export default function ContentViewer({ manifest }) {
  if (!manifest) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center text-sm text-slate-400 border border-slate-200/80 dark:border-slate-700/80">
        Select an item to view it.
      </div>
    );
  }

  const Renderer = getRenderer(manifest.type);
  return <Renderer manifest={manifest} />;
}
