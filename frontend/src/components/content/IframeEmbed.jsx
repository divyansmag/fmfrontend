export default function IframeEmbed({ src, srcDoc, title, minHeight = '28rem' }) {
  if (!src && !srcDoc) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-10 text-center text-sm text-slate-400">
        No HTML content found for this item.
      </div>
    );
  }

  return (
    <iframe
      title={title}
      src={src}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin allow-forms"
      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white"
      style={{ minHeight, height: minHeight }}
    />
  );
}
