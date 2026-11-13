import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Info, Star } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const ICONS = {
  info: <Info className="w-5 h-5 text-purple-600" />,
  success: <Check className="w-5 h-5 text-emerald-500" />,
  error: <AlertTriangle className="w-5 h-5 text-red-500" />,
  star: (
    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
  ),
};

function ToastItem({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    const hide = window.setTimeout(() => setVisible(false), 3200);
    return () => {
      cancelAnimationFrame(show);
      window.clearTimeout(hide);
    };
  }, []);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/50 transform transition-all duration-300 z-50 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {ICONS[toast.icon] || ICONS.info}
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">{toast.title}</span>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{toast.message}</span>
      </div>
    </div>
  );
}

export default function Toast() {
  const { toasts } = useApp();

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
