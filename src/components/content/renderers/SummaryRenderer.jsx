import { useRef, useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import MarkdownBody from '../MarkdownBody.jsx';

export default function SummaryRenderer({ manifest }) {
  const hasHtml = Boolean(manifest.data?.html);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">Theory</span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{manifest.title}</h3>
          {manifest.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{manifest.description}</p>}
        </div>
        {hasHtml && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        )}
      </header>

      {hasHtml ? (
        <div 
          ref={containerRef}
          className={`w-full bg-white overflow-hidden border border-slate-100 dark:border-slate-700/60 ${isFullscreen ? 'h-screen rounded-none' : 'h-[75vh] min-h-[540px] rounded-2xl'}`}
        >
          <iframe
            srcDoc={manifest.data.html}
            title={manifest.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <MarkdownBody>{manifest.data?.body}</MarkdownBody>
      )}
    </article>
  );
}
