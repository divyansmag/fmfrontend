import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function AuthLogin() {
  const { currentView, handleLogin, navigateTo, showToast } = useApp();
  
  // Extract role from currentView (e.g. 'teacher-login' -> 'teacher')
  const roleId = currentView.split('-')[0];
  
  // Set up dynamic content based on role
  const roleConfig = {
    student: {
      title: 'Student',
      placeholder: 'Email / Student ID',
      image: '/dist/assets/lumi_login.gif',
      theme: 'purple',
    },
    teacher: {
      title: 'Teacher',
      placeholder: 'Email / Teacher ID',
      image: '/dist/assets/sage_login.gif',
      theme: 'emerald',
      imgClass: 'scale-[1.25]',
    },
    parent: {
      title: 'Parent',
      placeholder: 'Email / Phone Number',
      image: '/dist/assets/eli_login.gif',
      theme: 'blue',
      imgClass: '',
    },
    admin: {
      title: 'Admin',
      placeholder: 'Admin Email',
      image: '/dist/orin_login.gif',
      theme: 'amber',
      imgClass: '-scale-x-100',
    }
  };
  
  const config = roleConfig[roleId] || roleConfig.student;
  
  const themeColors = {
    purple: {
      border: 'border-purple-100/80',
      gradient: 'from-purple-600 to-indigo-500',
      shadow: 'shadow-purple-600/30 text-purple-600/20',
      text: 'text-purple-600 dark:text-purple-400',
      ring: 'focus:ring-purple-600 dark:focus:ring-purple-500',
      btnHover: 'hover:from-purple-700 hover:to-indigo-600',
    },
    emerald: {
      border: 'border-emerald-100/80',
      gradient: 'from-emerald-600 to-teal-500',
      shadow: 'shadow-emerald-600/30 text-emerald-600/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      ring: 'focus:ring-emerald-600 dark:focus:ring-emerald-500',
      btnHover: 'hover:from-emerald-700 hover:to-teal-600',
    },
    blue: {
      border: 'border-sky-100/80',
      gradient: 'from-sky-500 to-blue-500',
      shadow: 'shadow-sky-500/30 text-sky-500/20',
      text: 'text-sky-600 dark:text-sky-400',
      ring: 'focus:ring-sky-500 dark:focus:ring-sky-400',
      btnHover: 'hover:from-sky-600 hover:to-blue-600',
    },
    amber: {
      border: 'border-amber-100/80',
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/30 text-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      ring: 'focus:ring-amber-500 dark:focus:ring-amber-400',
      btnHover: 'hover:from-amber-600 hover:to-orange-600',
    }
  };
  
  const t = themeColors[config.theme];
  
  const [email, setEmail] = useState(`${roleId}@futureminds.demo`);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await handleLogin(event, email.trim(), roleId, password);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main id={`view-${currentView}`} className="view-container flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center justify-center">
      <div className={`w-full bg-white dark:bg-slate-800/95 rounded-3xl p-8 sm:p-10 shadow-xl border ${t.border} dark:border-slate-700/80 relative backdrop-blur-md`}>
        <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${t.gradient} p-1 mx-auto -mt-16 shadow-lg ${t.shadow} mb-4 flex items-center justify-center overflow-hidden`}>
          <img
            src={config.image}
            alt={`${config.title} Mascot`}
            className={`w-full h-full object-cover rounded-full bg-white dark:bg-slate-800 ${config.imgClass || ''}`}
          />
        </div>

        <div className="text-center mb-7">
          <h2 className={`text-2xl font-extrabold ${t.text} font-display`}>Welcome Back, {config.title}!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to continue your journey.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">{config.placeholder}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="login-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 ${t.ring} text-slate-800 dark:text-white transition-all`}
                placeholder={`Enter your ${config.placeholder.toLowerCase()}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 text-slate-800 dark:text-white transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className={`w-4 h-4 rounded ${t.text} ${t.ring} border-slate-300`}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => showToast('Password Reset', 'Password reset instructions sent to your demo email', 'info')}
              className={`${t.text} font-semibold hover:underline`}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" disabled={busy} className={`w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-wait rounded-2xl bg-gradient-to-r ${t.gradient} ${t.btnHover} text-white font-bold text-sm shadow-lg ${t.shadow} transition-all flex items-center justify-center gap-2 group`}>
            <span>{busy ? 'Signing in…' : 'Login'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => showToast('Registration', 'Demo accounts are pre-registered.', 'info')}
              className={`${t.text} font-bold hover:underline`}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigateTo('role-select')}
        className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to role selection</span>
      </button>
    </main>
  );
}
