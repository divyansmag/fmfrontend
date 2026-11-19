import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../../context/AppContext.jsx';
import { Maximize, Minimize, Download } from 'lucide-react';
import {
  buildMindmapDocument,
  resolveMindmapTree,
} from '../mindmapTemplate.js';
import { DEFAULT_AI_MINDMAP_TREE } from '../../../data/courseData.js';

export default function MindmapRenderer({ manifest }) {
  const { markAssetComplete } = useApp();
  const data = manifest.data || {};
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Build HTML automatically from JSON tree / outline using the AI_Mindmap_ST1 template,
  // or use raw data.html if a custom HTML file was explicitly uploaded.
  const srcDocHtml = useMemo(() => {
    if (data.html && typeof data.html === 'string' && data.html.trim()) {
      return data.html;
    }
    const tree = resolveMindmapTree(data, manifest.title || 'Mindmap');
    const sourceLabel =
      tree?.sourceLabel || data.sourceLabel || manifest.title || 'FutureMinds AI Guide';
    return buildMindmapDocument(tree, sourceLabel);
  }, [data, manifest.title]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err.message));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    function handleMessage(event) {
      if (event.data?.type === 'FM_MINDMAP_COMPLETE' && manifest?.id) {
        markAssetComplete?.(manifest.id);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [manifest?.id, markAssetComplete]);

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Interactive Mindmap
          </span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
            {manifest.title}
          </h3>
          {manifest.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {manifest.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const treeToExport = resolveMindmapTree(data, manifest.title || 'Mindmap') || DEFAULT_AI_MINDMAP_TREE;
              const blob = new Blob([JSON.stringify(treeToExport, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'mindmap_template.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-xs font-bold transition-colors cursor-pointer"
            title="Download JSON Template"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON Template</span>
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div
        ref={containerRef}
        className={`w-full bg-white overflow-hidden border border-slate-100 dark:border-slate-700/60 ${
          isFullscreen ? 'h-screen rounded-none' : 'h-[680px] rounded-2xl relative shadow-inner'
        }`}
      >
        <iframe
          key={manifest.id}
          srcDoc={srcDocHtml}
          title={manifest.title || 'Mindmap'}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </article>
  );
}
