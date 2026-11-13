import { useEffect, useState } from 'react';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { api, getCmsToken, setCmsToken } from '../lib/api.js';

export default function CmsGate({ children }) {
  const { navigateTo, scheduleServerSave, courseData } = useApp();
  const [status, setStatus] = useState('checking'); // 'checking' | 'unlocked' | 'locked'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const token = getCmsToken();
    if (!token) {
      setStatus('locked');
      return;
    }

    api
      .cmsStatus()
      .then((res) => {
        if (!active) return;
        if (res?.unlocked) {
          setStatus('unlocked');
        } else {
          setCmsToken(null);
          setStatus('locked');
        }
      })
      .catch(() => {
        if (!active) return;
        setCmsToken(null);
        setStatus('locked');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleRelock = () => {
      setStatus('locked');
      setError('CMS locked, please re-enter the password');
    };
    window.addEventListener('cms-relock', handleRelock);
    return () => {
      window.removeEventListener('cms-relock', handleRelock);
    };
  }, []);

  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.cmsUnlock(password);
      if (res?.cmsToken) {
        setCmsToken(res.cmsToken);
        setStatus('unlocked');
        setPassword('');
        if (typeof scheduleServerSave === 'function' && courseData) {
          scheduleServerSave(courseData);
        }
      } else {
        setError('Failed to unlock CMS. Please try again.');
      }
    } catch (err) {
      if (err.status === 503) {
        setError(err.message || 'CMS password is not configured on the server');
      } else if (err.status === 429) {
        setError('Too many attempts. Please wait a minute before trying again.');
      } else {
        setError(err.message || 'Incorrect CMS password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (status === 'unlocked') {
    return children;
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-md shadow-purple-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Content CMS is locked</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Enter the second-layer CMS administrator password to manage courses, upload lessons, and save curriculum changes.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="text-left">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter CMS password"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400 text-left">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying…</span>
              </>
            ) : (
              <span>Unlock</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => navigateTo('admin-dashboard')}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

