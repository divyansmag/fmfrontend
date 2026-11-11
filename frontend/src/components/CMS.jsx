import { useState, useCallback, useRef } from 'react';
import {
  BookOpen, ChevronDown, ChevronRight, Cpu, FileText, Gamepad2,
  GripVertical, HelpCircle, Layers, Plus, RotateCcw, Save, Settings2,
  Trash2, Video, Zap, X, ArrowUp, ArrowDown, Check, Upload, FileCode
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { api } from '../lib/api.js';
import {
  getSortedChapters, getSortedUnits, getSortedSubtopics, getSortedAssets,
  DEFAULT_AI_MINDMAP_TREE
} from '../data/courseData';

// ── Helpers ───────────────────────────────────────────────────────────────

const ASSET_TYPES = [
  { value: 'video',      label: 'Video',      icon: Video,      color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' },
  { value: 'summary',    label: 'Theory',     icon: FileText,   color: 'text-sky-600',    bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' },
  { value: 'game',       label: 'Game',       icon: Gamepad2,   color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
  { value: 'quiz',       label: 'Quiz',       icon: HelpCircle, color: 'text-rose-600',   bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
  { value: 'mindmap',    label: 'Mindmap',    icon: Cpu,        color: 'text-teal-600',   bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800' },
  { value: 'flashcards', label: 'Flashcards', icon: BookOpen,   color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' },
  { value: 'lab',        label: 'Lab',        icon: Zap,        color: 'text-emerald-600',bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
];

const ASSET_TYPE_MAP = Object.fromEntries(ASSET_TYPES.map((t) => [t.value, t]));

function nanoid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function inputCls() {
  return 'w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all';
}

function labelCls() {
  return 'block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5';
}

// ── Asset data forms ──────────────────────────────────────────────────────

function VideoForm({ data, onChange }) {
  const fileRef = useRef(null);
  const [progress, setProgress] = useState(null); // null = idle, 0-100 = uploading
  const [error, setError] = useState('');

  // Uploads go to the server, which streams them into the storage bucket and gives back a stable URL.
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setProgress(0);
    try {
      const result = await api.uploadFile(file, setProgress);
      onChange({ ...data, url: result.url, fileName: file.name });
    } catch (err) {
      setError(err.message);
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className={labelCls()}>Upload a video file (MP4 or WebM)</label>
        <input ref={fileRef} type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleUpload} />
        <button
          type="button"
          disabled={progress !== null}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all disabled:opacity-60"
        >
          <Upload className="w-3.5 h-3.5" />
          {progress === null ? 'Choose video file' : `Uploading… ${progress}%`}
        </button>
        {data.fileName && progress === null && <span className="ml-2 text-xs text-slate-500">{data.fileName}</span>}
        {error && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
      </div>
      <div>
        <label className={labelCls()}>…or paste a video URL (YouTube, Vimeo, or direct MP4)</label>
        <input type="url" className={inputCls()} value={data.url || ''} placeholder="https://youtube.com/watch?v=..." onChange={(e) => onChange({ ...data, url: e.target.value })} />
      </div>
      <div>
        <label className={labelCls()}>Duration (minutes)</label>
        <input type="number" className={inputCls()} value={data.durationMinutes || ''} placeholder="12" onChange={(e) => onChange({ ...data, durationMinutes: Number(e.target.value) || undefined })} />
      </div>
    </div>
  );
}

function SummaryForm({ data, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      onChange({
        ...data,
        html: content,
        htmlFileName: file.name,
        htmlFileSize: (file.size / 1024).toFixed(1) + ' KB',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const removeHtml = () => {
    const next = { ...data };
    delete next.html;
    delete next.htmlFileName;
    delete next.htmlFileSize;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* HTML Upload Section */}
      <div className="p-3 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 dark:text-sky-300">
            Custom HTML Upload (Optional)
          </label>
          {data.html && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              HTML Active
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload an .html file for this summary asset. When present, the student viewer renders it in an isolated iframe.
        </p>

        {data.html ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileCode className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {data.htmlFileName || 'custom-summary.html'}
                </div>
                <div className="text-[10px] text-slate-400">{data.htmlFileSize || `${(data.html.length / 1024).toFixed(1)} KB`}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={removeHtml}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                Remove HTML
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,text/html"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-sky-300 dark:border-sky-700 hover:border-sky-500 text-sky-600 dark:text-sky-400 text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white dark:bg-slate-900 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Choose .html file to upload
            </button>
          </div>
        )}
      </div>

      <div>
        <label className={labelCls()}>Content (Markdown notes / fallback)</label>
        <textarea
          rows={6}
          className={`${inputCls()} font-mono text-xs`}
          value={data.body || ''}
          placeholder="## Title&#10;&#10;Content here..."
          onChange={(e) => onChange({ ...data, body: e.target.value })}
        />
      </div>
    </div>
  );
}

function GameForm({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className={labelCls()}>HTML File Path or URL</label>
        <input type="text" className={inputCls()} value={data.file || ''} placeholder="index.html or https://..." onChange={(e) => onChange({ ...data, file: e.target.value })} />
      </div>
      <div>
        <label className={labelCls()}>Public Base Path (for local files)</label>
        <input type="text" className={inputCls()} value={data._publicBase || ''} placeholder="/content/game/my-game" onChange={(e) => onChange({ ...data, _publicBase: e.target.value })} />
      </div>
    </div>
  );
}

function QuizForm({ data, onChange }) {
  const questions = data.questions || [];
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onChange({ ...data, questions: parsed });
        } else if (parsed.questions && Array.isArray(parsed.questions)) {
          onChange({ ...data, questions: parsed.questions });
        } else {
          alert('Invalid template format. Expected an array of questions.');
        }
      } catch (err) {
        alert("Invalid JSON format. Please upload a valid .json file.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        question: "Example Question?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
        explanation: "Explanation here",
        hint: "Hint here"
      }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const addQ = () => onChange({
    ...data,
    questions: [...questions, { id: nanoid(), question: '', options: ['', '', '', ''], correct: 0, explanation: '', hint: '' }],
  });

  const updateQ = (qi, field, value) => {
    const next = questions.map((q, i) => i === qi ? { ...q, [field]: value } : q);
    onChange({ ...data, questions: next });
  };

  const updateOption = (qi, oi, value) => {
    const next = questions.map((q, i) => {
      if (i !== qi) return q;
      const opts = [...(q.options || ['', '', '', ''])];
      opts[oi] = value;
      return { ...q, options: opts };
    });
    onChange({ ...data, questions: next });
  };

  const removeQ = (qi) => onChange({ ...data, questions: questions.filter((_, i) => i !== qi) });

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <div key={q.id || qi} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Question {qi + 1}</span>
            <button type="button" onClick={() => removeQ(qi)} className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input type="text" className={inputCls()} value={q.question} placeholder="Question text..." onChange={(e) => updateQ(qi, 'question', e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            {(q.options || ['', '', '', '']).map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <button type="button" onClick={() => updateQ(qi, 'correct', oi)} className={`w-6 h-6 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${q.correct === oi ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                  {q.correct === oi && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <input type="text" className={inputCls()} value={opt} placeholder={`Option ${String.fromCharCode(65 + oi)}`} onChange={(e) => updateOption(qi, oi, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls()}>Explanation</label>
              <input type="text" className={inputCls()} value={q.explanation || ''} onChange={(e) => updateQ(qi, 'explanation', e.target.value)} />
            </div>
            <div>
              <label className={labelCls()}>Hint (optional)</label>
              <input type="text" className={inputCls()} value={q.hint || ''} onChange={(e) => updateQ(qi, 'hint', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-4 items-center mt-2">
        <button type="button" onClick={addQ} className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:underline">
          <Plus className="w-3.5 h-3.5" /> Add Question
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
        <button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:underline">
          <FileCode className="w-3.5 h-3.5" /> Template
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
        <label className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:underline cursor-pointer">
          <Upload className="w-3.5 h-3.5" /> Import JSON
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
        </label>
      </div>
    </div>
  );
}

function MindmapForm({ data, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      onChange({
        ...data,
        html: content,
        htmlFileName: file.name,
        htmlFileSize: (file.size / 1024).toFixed(1) + ' KB',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const removeHtml = () => {
    const next = { ...data };
    delete next.html;
    delete next.htmlFileName;
    delete next.htmlFileSize;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* HTML Upload Section */}
      <div className="p-3 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 dark:text-teal-300">
            Custom HTML Upload (Required)
          </label>
          {data.html && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              HTML Active
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload an .html file for this mindmap asset. The student viewer will render it in an isolated iframe.
        </p>

        {data.html ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileCode className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {data.htmlFileName || 'custom-mindmap.html'}
                </div>
                <div className="text-[10px] text-slate-400">{data.htmlFileSize || `${(data.html.length / 1024).toFixed(1)} KB`}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={removeHtml}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                Remove HTML
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,text/html"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-700 hover:border-teal-500 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white dark:bg-slate-900 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Choose .html file to upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FlashcardsForm({ data, onChange }) {
  const cards = data.cards || [];
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onChange({ ...data, cards: parsed });
        } else if (parsed.cards && Array.isArray(parsed.cards)) {
          onChange({ ...data, cards: parsed.cards });
        } else {
          alert('Invalid template format. Expected an array of cards.');
        }
      } catch (err) {
        alert("Invalid JSON format. Please upload a valid .json file.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = [
      { front: "What is Artificial Intelligence?", back: "The simulation of human intelligence..." },
      { front: "What is Machine Learning?", back: "A subset of AI that focuses on..." }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const addCard = () => onChange({ ...data, cards: [...cards, { front: '', back: '' }] });
  const updateCard = (i, field, value) => {
    const next = cards.map((c, ci) => ci === i ? { ...c, [field]: value } : c);
    onChange({ ...data, cards: next });
  };
  const removeCard = (i) => onChange({ ...data, cards: cards.filter((_, ci) => ci !== i) });

  return (
    <div className="space-y-3">
      {cards.map((card, i) => (
        <div key={i} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <label className={labelCls()}>Front</label>
            <textarea rows={2} className={`${inputCls()} text-xs`} value={card.front} onChange={(e) => updateCard(i, 'front', e.target.value)} />
          </div>
          <div>
            <label className={labelCls()}>Back</label>
            <textarea rows={2} className={`${inputCls()} text-xs`} value={card.back} onChange={(e) => updateCard(i, 'back', e.target.value)} />
          </div>
          <button type="button" onClick={() => removeCard(i)} className="col-span-2 text-right text-[10px] font-bold text-rose-500 hover:underline">Remove card</button>
        </div>
      ))}
      <div className="flex gap-4 items-center mt-2">
        <button type="button" onClick={addCard} className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:underline">
          <Plus className="w-3.5 h-3.5" /> Add Card
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
        <button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:underline">
          <FileCode className="w-3.5 h-3.5" /> Template
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
        <label className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:underline cursor-pointer">
          <Upload className="w-3.5 h-3.5" /> Import JSON
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
        </label>
      </div>
    </div>
  );
}

function LabForm({ data, onChange }) {
  const hints = data.hints || [];
  return (
    <div className="space-y-3">
      <div>
        <label className={labelCls()}>Instructions (Markdown)</label>
        <textarea rows={4} className={`${inputCls()} font-mono text-xs`} value={data.instructions || ''} onChange={(e) => onChange({ ...data, instructions: e.target.value })} />
      </div>
      <div>
        <label className={labelCls()}>Starter Code</label>
        <textarea rows={6} className={`${inputCls()} font-mono text-xs`} value={data.starterCode || ''} onChange={(e) => onChange({ ...data, starterCode: e.target.value })} />
      </div>
      <div>
        <label className={labelCls()}>Hints (one per line)</label>
        <textarea rows={3} className={`${inputCls()} text-xs`} value={hints.join('\n')} onChange={(e) => onChange({ ...data, hints: e.target.value.split('\n').filter(Boolean) })} />
      </div>
    </div>
  );
}

function AssetDataForm({ type, data, onChange }) {
  switch (type) {
    case 'video':      return <VideoForm data={data} onChange={onChange} />;
    case 'summary':    return <SummaryForm data={data} onChange={onChange} />;
    case 'game':       return <GameForm data={data} onChange={onChange} />;
    case 'quiz':       return <QuizForm data={data} onChange={onChange} />;
    case 'mindmap':    return <MindmapForm data={data} onChange={onChange} />;
    case 'flashcards': return <FlashcardsForm data={data} onChange={onChange} />;
    case 'lab':        return <LabForm data={data} onChange={onChange} />;
    default:           return null;
  }
}

// ── Reorder helpers ───────────────────────────────────────────────────────

function moveItem(arr, index, direction) {
  const next = [...arr];
  const swap = direction === 'up' ? index - 1 : index + 1;
  if (swap < 0 || swap >= arr.length) return arr;
  [next[index], next[swap]] = [next[swap], next[index]];
  // Re-assign order
  return next.map((item, i) => ({ ...item, order: i + 1 }));
}

// ── Main CMS Component ────────────────────────────────────────────────────

export default function CMS() {
  const { courseData, updateCourseData, applyServerCourse, showToast, navigateTo } = useApp();

  // Selected IDs for the detail panel
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  // Add panels
  const [addingChapter, setAddingChapter] = useState(false);
  const [addingUnit, setAddingUnit] = useState(false);
  const [addingSubtopic, setAddingSubtopic] = useState(false);
  const [addingAsset, setAddingAsset] = useState(false);
  const [newAssetType, setNewAssetType] = useState(null);

  // Inline editing draft
  const [draft, setDraft] = useState(null); // { type, id, field/data }

  // ── Persistence ──────────────────────────────────────────────────────────
  // Using functional updater so rapid edits never overwrite each other with stale state
  const save = useCallback((newDataOrUpdater) => {
    updateCourseData(newDataOrUpdater);
    showToast('Saved', 'Course structure updated and saved!', 'success');
  }, [updateCourseData, showToast]);

  // Reset is now a server-side, admin-only action (the old client-side "password 1234" check was bypassable).
  const handleReset = async () => {
    if (!window.confirm('Reset course data to built-in defaults? All CMS changes will be lost.')) return;
    try {
      const { course } = await api.resetCourse();
      applyServerCourse(course);
      setSelectedChapterId(null); setSelectedUnitId(null); setSelectedSubtopicId(null); setSelectedAssetId(null);
      showToast('Reset', 'Course data restored to defaults.', 'info');
    } catch (err) {
      showToast('Reset failed', err.message, 'error');
    }
  };

  // ── Derived selections ────────────────────────────────────────────────────
  const [cmsGrade, setCmsGrade] = useState('6');
  const allChapters = getSortedChapters(courseData);
  const chapters = allChapters.filter((c) => (c.grade || '6') === cmsGrade);
  
  const selectedChapter = chapters.find((c) => c.id === selectedChapterId);
  const units = selectedChapter ? getSortedUnits(selectedChapter) : [];
  const selectedUnit = units.find((u) => u.id === selectedUnitId);
  const subtopics = selectedUnit ? getSortedSubtopics(selectedUnit) : [];
  const selectedSubtopic = subtopics.find((s) => s.id === selectedSubtopicId);
  const assets = selectedSubtopic ? getSortedAssets(selectedSubtopic) : [];
  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  // ── Chapter CRUD ──────────────────────────────────────────────────────────
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const addChapter = () => {
    if (!newChapterTitle.trim()) return;
    const title = newChapterTitle.trim();
    save((prev) => {
      // Calculate order based on chapters in the active grade only
      const gradeChapters = prev.chapters.filter(c => (c.grade || '6') === cmsGrade);
      const order = gradeChapters.length + 1;
      const newChapter = {
        id: `ch-${nanoid()}`,
        order,
        number: String(order).padStart(2, '0'),
        title,
        status: 'locked',
        tags: [],
        units: [],
        grade: cmsGrade,
      };
      return { ...prev, chapters: [...prev.chapters, newChapter] };
    });
    setNewChapterTitle('');
    setAddingChapter(false);
  };

  const deleteChapter = (chapterId) => {
    if (!window.confirm('Delete this chapter and all its contents?')) return;
    save((prev) => ({ ...prev, chapters: prev.chapters.filter((c) => c.id !== chapterId) }));
    if (selectedChapterId === chapterId) { setSelectedChapterId(null); setSelectedUnitId(null); setSelectedSubtopicId(null); setSelectedAssetId(null); }
  };

  const moveChapter = (index, dir) => {
    save((prev) => ({ ...prev, chapters: moveItem(prev.chapters.slice().sort((a, b) => a.order - b.order), index, dir) }));
  };

  const updateChapterTitle = (chapterId, title) => {
    save((prev) => ({ ...prev, chapters: prev.chapters.map((c) => c.id === chapterId ? { ...c, title } : c) }));
  };

  const updateChapterStatus = (chapterId, status) => {
    save((prev) => ({ ...prev, chapters: prev.chapters.map((c) => c.id === chapterId ? { ...c, status } : c) }));
  };

  const updateChapterGrade = (chapterId, grade) => {
    save((prev) => ({ ...prev, chapters: prev.chapters.map((c) => c.id === chapterId ? { ...c, grade } : c) }));
    if (selectedChapterId === chapterId && grade !== cmsGrade) {
      setSelectedChapterId(null);
      setSelectedUnitId(null);
      setSelectedSubtopicId(null);
      setSelectedAssetId(null);
    }
  };

  // ── Unit CRUD ─────────────────────────────────────────────────────────────
  const [newUnitTitle, setNewUnitTitle] = useState('');

  const addUnit = () => {
    if (!selectedChapter || !newUnitTitle.trim()) return;
    const chId = selectedChapter.id;
    const title = newUnitTitle.trim();
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const order = (ch.units?.length ?? 0) + 1;
      const newUnit = { id: `u-${nanoid()}`, order, title, subtopics: [] };
      const updated = { ...ch, units: [...(ch.units ?? []), newUnit] };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updated : c) };
    });
    setNewUnitTitle('');
    setAddingUnit(false);
  };

  const deleteUnit = (unitId) => {
    if (!window.confirm('Delete this unit and all its contents?')) return;
    const chId = selectedChapter.id;
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const updated = { ...ch, units: ch.units.filter((u) => u.id !== unitId) };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updated : c) };
    });
    if (selectedUnitId === unitId) { setSelectedUnitId(null); setSelectedSubtopicId(null); setSelectedAssetId(null); }
  };

  const moveUnit = (index, dir) => {
    const chId = selectedChapter.id;
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const updated = { ...ch, units: moveItem(getSortedUnits(ch), index, dir) };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updated : c) };
    });
  };

  const updateUnitTitle = (unitId, title) => {
    const chId = selectedChapter.id;
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const updated = { ...ch, units: ch.units.map((u) => u.id === unitId ? { ...u, title } : u) };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updated : c) };
    });
  };

  // ── Subtopic CRUD ─────────────────────────────────────────────────────────
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');

  const addSubtopic = () => {
    if (!selectedUnit || !newSubtopicTitle.trim()) return;
    const chId = selectedChapter.id;
    const uId = selectedUnit.id;
    const title = newSubtopicTitle.trim();
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const u = ch.units.find((u) => u.id === uId);
      if (!u) return prev;
      const order = (u.subtopics?.length ?? 0) + 1;
      const newSub = { id: `s-${nanoid()}`, order, title, assets: [] };
      const updU = { ...u, subtopics: [...(u.subtopics ?? []), newSub] };
      const updCh = { ...ch, units: ch.units.map((unit) => unit.id === uId ? updU : unit) };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updCh : c) };
    });
    setNewSubtopicTitle('');
    setAddingSubtopic(false);
  };

  const deleteSubtopic = (subtopicId) => {
    if (!window.confirm('Delete this subtopic and all its assets?')) return;
    const chId = selectedChapter.id;
    const uId = selectedUnit.id;
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const u = ch.units.find((u) => u.id === uId);
      if (!u) return prev;
      const updU = { ...u, subtopics: u.subtopics.filter((s) => s.id !== subtopicId) };
      const updCh = { ...ch, units: ch.units.map((unit) => unit.id === uId ? updU : unit) };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updCh : c) };
    });
    if (selectedSubtopicId === subtopicId) { setSelectedSubtopicId(null); setSelectedAssetId(null); }
  };

  const moveSubtopic = (index, dir) => {
    const chId = selectedChapter.id;
    const uId = selectedUnit.id;
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const u = ch.units.find((u) => u.id === uId);
      if (!u) return prev;
      const updU = { ...u, subtopics: moveItem(getSortedSubtopics(u), index, dir) };
      const updCh = { ...ch, units: ch.units.map((unit) => unit.id === uId ? updU : unit) };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updCh : c) };
    });
  };

  const updateSubtopicTitle = (subtopicId, title) => {
    const chId = selectedChapter.id;
    const uId = selectedUnit.id;
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const u = ch.units.find((u) => u.id === uId);
      if (!u) return prev;
      const updU = { ...u, subtopics: u.subtopics.map((s) => s.id === subtopicId ? { ...s, title } : s) };
      const updCh = { ...ch, units: ch.units.map((unit) => unit.id === uId ? updU : unit) };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updCh : c) };
    });
  };

  // ── Asset CRUD ────────────────────────────────────────────────────────────
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetData, setNewAssetData] = useState({});

  const startAddAsset = (type) => {
    setNewAssetType(type);
    setNewAssetTitle('');
    setNewAssetData({});
  };

  const _patchAssets = (chId, uId, sId, patchFn) => {
    save((prev) => {
      const ch = prev.chapters.find((c) => c.id === chId);
      if (!ch) return prev;
      const u = ch.units.find((u) => u.id === uId);
      if (!u) return prev;
      const s = u.subtopics.find((s) => s.id === sId);
      if (!s) return prev;
      const updS = patchFn(s);
      const updU = { ...u, subtopics: u.subtopics.map((sub) => sub.id === sId ? updS : sub) };
      const updCh = { ...ch, units: ch.units.map((unit) => unit.id === uId ? updU : unit) };
      return { ...prev, chapters: prev.chapters.map((c) => c.id === chId ? updCh : c) };
    });
  };

  const addAsset = () => {
    if (!selectedSubtopic || !newAssetTitle.trim() || !newAssetType) return;
    const chId = selectedChapter.id;
    const uId = selectedUnit.id;
    const sId = selectedSubtopic.id;
    const title = newAssetTitle.trim();
    const type = newAssetType;
    const data = newAssetData;
    _patchAssets(chId, uId, sId, (s) => {
      const order = (s.assets?.length ?? 0) + 1;
      const newAsset = { id: `a-${nanoid()}`, order, title, type, data };
      return { ...s, assets: [...(s.assets ?? []), newAsset] };
    });
    setAddingAsset(false);
    setNewAssetType(null);
  };

  const deleteAsset = (assetId) => {
    if (!window.confirm('Delete this asset?')) return;
    _patchAssets(selectedChapter.id, selectedUnit.id, selectedSubtopic.id, (s) => ({
      ...s, assets: s.assets.filter((a) => a.id !== assetId),
    }));
    if (selectedAssetId === assetId) setSelectedAssetId(null);
  };

  const moveAsset = (index, dir) => {
    _patchAssets(selectedChapter.id, selectedUnit.id, selectedSubtopic.id, (s) => ({
      ...s, assets: moveItem(getSortedAssets(s), index, dir),
    }));
  };

  const updateAssetTitle = (assetId, title) => {
    _patchAssets(selectedChapter.id, selectedUnit.id, selectedSubtopic.id, (s) => ({
      ...s, assets: s.assets.map((a) => a.id === assetId ? { ...a, title } : a),
    }));
  };

  const updateAssetData = (assetId, data) => {
    _patchAssets(selectedChapter.id, selectedUnit.id, selectedSubtopic.id, (s) => ({
      ...s, assets: s.assets.map((a) => a.id === assetId ? { ...a, data } : a),
    }));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main id="view-cms" className="view-container p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">FutureMinds</div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Course Content Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Changes save instantly and update all learner views automatically.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <select
              value={cmsGrade}
              onChange={(e) => {
                setCmsGrade(e.target.value);
                setSelectedChapterId(null);
                setSelectedUnitId(null);
                setSelectedSubtopicId(null);
                setSelectedAssetId(null);
              }}
              className="bg-transparent text-sm font-bold text-slate-900 dark:text-white px-3 py-1 outline-none cursor-pointer"
            >
              <option value="6">Grade 6 Content</option>
              <option value="7">Grade 7 Content</option>
              <option value="8">Grade 8 Content</option>
            </select>
          </div>
          
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to defaults
          </button>
          <button
            type="button"
            onClick={() => navigateTo('admin-dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20"
          >
            ← Admin Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* ── Column 1: Chapters ── */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Chapters</h2>
            </div>
            <button type="button" onClick={() => setAddingChapter(true)} className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center hover:bg-purple-100 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {addingChapter && (
            <div className="space-y-2">
              <input autoFocus type="text" className={inputCls()} placeholder="Chapter title..." value={newChapterTitle} onChange={(e) => setNewChapterTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addChapter()} />
              <div className="flex gap-2">
                <button type="button" onClick={addChapter} className="flex-1 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold">Add</button>
                <button type="button" onClick={() => setAddingChapter(false)} className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {chapters.map((chapter, ci) => (
              <div key={chapter.id} className={`group relative rounded-2xl border transition-all ${selectedChapterId === chapter.id ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                <button
                  type="button"
                  onClick={() => { setSelectedChapterId(chapter.id); setSelectedUnitId(null); setSelectedSubtopicId(null); setSelectedAssetId(null); }}
                  className="w-full text-left px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">Ch.{chapter.number}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">{chapter.title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${chapter.status === 'active' ? 'bg-emerald-100 text-emerald-700' : chapter.status === 'completed' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                      {chapter.status}
                    </span>
                  </div>
                </button>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5">
                  <button type="button" onClick={() => moveChapter(ci, 'up')} className="p-1 rounded text-slate-400 hover:text-purple-600"><ArrowUp className="w-3 h-3" /></button>
                  <button type="button" onClick={() => moveChapter(ci, 'down')} className="p-1 rounded text-slate-400 hover:text-purple-600"><ArrowDown className="w-3 h-3" /></button>
                  <button type="button" onClick={() => deleteChapter(chapter.id)} className="p-1 rounded text-slate-400 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Chapter detail when selected */}
          {selectedChapter && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <label className={labelCls()}>Edit Title</label>
              <input key={selectedChapter.id} type="text" className={inputCls()} defaultValue={selectedChapter.title} onBlur={(e) => updateChapterTitle(selectedChapter.id, e.target.value)} />
              <select className={inputCls()} value={selectedChapter.status} onChange={(e) => updateChapterStatus(selectedChapter.id, e.target.value)}>
                <option value="active">active</option>
                <option value="completed">completed</option>
                <option value="locked">locked</option>
              </select>
              <label className={labelCls()}>Grade</label>
              <select className={inputCls()} value={selectedChapter.grade || '6'} onChange={(e) => updateChapterGrade(selectedChapter.id, e.target.value)}>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
              </select>
            </div>
          )}
        </div>

        {/* ── Column 2: Units ── */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Units</h2>
            </div>
            {selectedChapter && (
              <button type="button" onClick={() => setAddingUnit(true)} className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {!selectedChapter && (
            <p className="text-xs text-slate-400 text-center py-4">← Select a chapter</p>
          )}

          {addingUnit && (
            <div className="space-y-2">
              <input autoFocus type="text" className={inputCls()} placeholder="Unit title..." value={newUnitTitle} onChange={(e) => setNewUnitTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addUnit()} />
              <div className="flex gap-2">
                <button type="button" onClick={addUnit} className="flex-1 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold">Add</button>
                <button type="button" onClick={() => setAddingUnit(false)} className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {units.map((unit, ui) => (
              <div key={unit.id} className={`group relative rounded-2xl border transition-all ${selectedUnitId === unit.id ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                <button
                  type="button"
                  onClick={() => { setSelectedUnitId(unit.id); setSelectedSubtopicId(null); setSelectedAssetId(null); }}
                  className="w-full text-left px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">U{unit.order}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{unit.title}</span>
                  </div>
                </button>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5">
                  <button type="button" onClick={() => moveUnit(ui, 'up')} className="p-1 rounded text-slate-400 hover:text-indigo-600"><ArrowUp className="w-3 h-3" /></button>
                  <button type="button" onClick={() => moveUnit(ui, 'down')} className="p-1 rounded text-slate-400 hover:text-indigo-600"><ArrowDown className="w-3 h-3" /></button>
                  <button type="button" onClick={() => deleteUnit(unit.id)} className="p-1 rounded text-slate-400 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>

          {selectedUnit && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <label className={labelCls()}>Edit Title</label>
              <input key={selectedUnit.id} type="text" className={inputCls()} defaultValue={selectedUnit.title} onBlur={(e) => updateUnitTitle(selectedUnit.id, e.target.value)} />
            </div>
          )}
        </div>

        {/* ── Column 3: Subtopics ── */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Subtopics</h2>
            </div>
            {selectedUnit && (
              <button type="button" onClick={() => setAddingSubtopic(true)} className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {!selectedUnit && <p className="text-xs text-slate-400 text-center py-4">← Select a unit</p>}

          {addingSubtopic && (
            <div className="space-y-2">
              <input autoFocus type="text" className={inputCls()} placeholder="Subtopic title..." value={newSubtopicTitle} onChange={(e) => setNewSubtopicTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSubtopic()} />
              <div className="flex gap-2">
                <button type="button" onClick={addSubtopic} className="flex-1 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold">Add</button>
                <button type="button" onClick={() => setAddingSubtopic(false)} className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {subtopics.map((sub, si) => (
              <div key={sub.id} className={`group relative rounded-2xl border transition-all ${selectedSubtopicId === sub.id ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                <button
                  type="button"
                  onClick={() => { setSelectedSubtopicId(sub.id); setSelectedAssetId(null); }}
                  className="w-full text-left px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-teal-600 dark:text-teal-400">S{sub.order}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{sub.title}</span>
                    <span className="text-[9px] text-slate-400 ml-auto">{sub.assets?.length ?? 0} assets</span>
                  </div>
                </button>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5">
                  <button type="button" onClick={() => moveSubtopic(si, 'up')} className="p-1 rounded text-slate-400 hover:text-teal-600"><ArrowUp className="w-3 h-3" /></button>
                  <button type="button" onClick={() => moveSubtopic(si, 'down')} className="p-1 rounded text-slate-400 hover:text-teal-600"><ArrowDown className="w-3 h-3" /></button>
                  <button type="button" onClick={() => deleteSubtopic(sub.id)} className="p-1 rounded text-slate-400 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>

          {selectedSubtopic && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <label className={labelCls()}>Edit Title</label>
              <input key={selectedSubtopic.id} type="text" className={inputCls()} defaultValue={selectedSubtopic.title} onBlur={(e) => updateSubtopicTitle(selectedSubtopic.id, e.target.value)} />
            </div>
          )}
        </div>

        {/* ── Column 4: Assets ── */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-rose-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Assets</h2>
            </div>
            {selectedSubtopic && !addingAsset && (
              <button type="button" onClick={() => setAddingAsset(true)} className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {!selectedSubtopic && <p className="text-xs text-slate-400 text-center py-4">← Select a subtopic</p>}

          {/* Asset type picker */}
          {addingAsset && !newAssetType && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 mb-2">Select asset type:</div>
              <div className="grid grid-cols-2 gap-2">
                {ASSET_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => startAddAsset(t.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold ${t.bg} ${t.color} transition-all hover:scale-[1.02]`}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setAddingAsset(false)} className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 py-1">Cancel</button>
            </div>
          )}

          {/* Asset form */}
          {addingAsset && newAssetType && (
            <div className="space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${ASSET_TYPE_MAP[newAssetType]?.color}`}>
                  New {ASSET_TYPE_MAP[newAssetType]?.label}
                </span>
                <button type="button" onClick={() => { setNewAssetType(null); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <label className={labelCls()}>Title</label>
                <input type="text" className={inputCls()} value={newAssetTitle} onChange={(e) => setNewAssetTitle(e.target.value)} placeholder="Asset title..." />
              </div>
              <AssetDataForm type={newAssetType} data={newAssetData} onChange={setNewAssetData} />
              <div className="flex gap-2">
                <button type="button" onClick={addAsset} className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Save Asset
                </button>
                <button type="button" onClick={() => { setAddingAsset(false); setNewAssetType(null); }} className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500">Cancel</button>
              </div>
            </div>
          )}

          {/* Asset list */}
          <div className="space-y-1.5">
            {assets.map((asset, ai) => {
              const meta = ASSET_TYPE_MAP[asset.type];
              const isSelected = selectedAssetId === asset.id;
              return (
                <div key={asset.id} className={`group relative rounded-2xl border transition-all ${isSelected ? `${meta?.bg || ''} border-slate-300` : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                  <button
                    type="button"
                    onClick={() => setSelectedAssetId(isSelected ? null : asset.id)}
                    className="w-full text-left px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400">{ai + 1}.</span>
                      {meta && <meta.icon className={`w-3.5 h-3.5 ${meta.color} flex-shrink-0`} />}
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">{asset.title}</span>
                      <span className={`text-[9px] font-bold ${meta?.color || ''}`}>{meta?.label || asset.type}</span>
                    </div>
                  </button>
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5">
                    <button type="button" onClick={() => moveAsset(ai, 'up')} className="p-1 rounded text-slate-400 hover:text-purple-600"><ArrowUp className="w-3 h-3" /></button>
                    <button type="button" onClick={() => moveAsset(ai, 'down')} className="p-1 rounded text-slate-400 hover:text-purple-600"><ArrowDown className="w-3 h-3" /></button>
                    <button type="button" onClick={() => deleteAsset(asset.id)} className="p-1 rounded text-slate-400 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Asset editor */}
          {selectedAsset && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Edit Asset</div>
              <div>
                <label className={labelCls()}>Title</label>
                <input
                  key={selectedAsset.id}
                  type="text"
                  className={inputCls()}
                  defaultValue={selectedAsset.title}
                  onBlur={(e) => updateAssetTitle(selectedAsset.id, e.target.value)}
                />
              </div>
              <AssetDataForm
                type={selectedAsset.type}
                data={selectedAsset.data || {}}
                onChange={(data) => updateAssetData(selectedAsset.id, data)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Course summary */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Course Structure Summary</div>
        <div className="flex flex-wrap gap-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
            📚 {chapters.length} Chapter{chapters.length !== 1 ? 's' : ''}
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
            📖 {chapters.reduce((t, c) => t + (c.units?.length ?? 0), 0)} Units
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
            🗂 {chapters.reduce((t, c) => t + (c.units?.reduce((u, unit) => u + (unit.subtopics?.length ?? 0), 0) ?? 0), 0)} Subtopics
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
            ⚡ {chapters.reduce((t, c) => t + (c.units?.reduce((u, unit) => u + (unit.subtopics?.reduce((s, sub) => s + (sub.assets?.length ?? 0), 0) ?? 0), 0) ?? 0), 0)} Assets
          </div>
          <div className="ml-auto text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Auto-saved to localStorage
          </div>
        </div>
      </div>
    </main>
  );
}
