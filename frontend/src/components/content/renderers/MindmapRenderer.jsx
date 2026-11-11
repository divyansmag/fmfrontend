import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../../context/AppContext.jsx';
import { Maximize, Minimize } from 'lucide-react';

export default function MindmapRenderer({ manifest }) {
  const { markAssetComplete } = useApp();
  const data = manifest.data || {};
  const hasHtml = Boolean(data.html);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => console.warn(err.message));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    function handleMessage(event) {
      if (event.data?.type === 'FM_MINDMAP_COMPLETE' && manifest?.id) {
        markAssetComplete(manifest.id);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [manifest?.id, markAssetComplete]);

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400">Interactive Mindmap</span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{manifest.title}</h3>
          {manifest.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{manifest.description}</p>}
        </div>
        {hasHtml && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        )}
      </header>

      {hasHtml ? (
        <div ref={containerRef} className={`w-full bg-white overflow-hidden border border-slate-100 dark:border-slate-700/60 ${isFullscreen ? 'h-screen rounded-none' : 'h-[680px] rounded-2xl relative shadow-inner'}`}>
          <iframe srcDoc={data.html} title={manifest.title || 'Mindmap'} className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-popups" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <p className="text-sm font-semibold mb-2">No mindmap provided.</p>
          <p className="text-xs">Upload an HTML mindmap via the CMS.</p>
        </div>
      )}
    </article>
  );
}
