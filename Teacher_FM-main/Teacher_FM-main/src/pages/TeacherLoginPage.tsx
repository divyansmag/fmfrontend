import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthHeader } from '../components/AuthHeader';
import { AuthFooter } from '../components/AuthFooter';
import { ArrowLeft, ArrowRight, AlertCircle, Eye, EyeOff, Lock, User } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const TeacherLoginPage: React.FC = () => {
  const [email, setEmail] = useState('teacher@futureminds.demo');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your Email / Teacher ID and password.');
      return;
    }

    setError('');
    login('teacher', { name: 'Anaya Sharma', email });
    navigate('/teacher/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-white to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 flex flex-col justify-between antialiased selection:bg-purple-100">
      <AuthHeader />
      <main className="view-container flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full bg-white dark:bg-slate-800/95 rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-100/80 dark:border-slate-700/80 relative backdrop-blur-md">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 mx-auto -mt-16 shadow-lg shadow-emerald-600/30 mb-4 flex items-center justify-center overflow-hidden">
            <img
              src="http://localhost:5173/dist/assets/sage_login.gif"
              alt="Teacher Mascot"
              className="w-full h-full object-cover rounded-full bg-white dark:bg-slate-800"
            />
          </div>



          <div className="text-center mb-7">
            <h2 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">Welcome Back, Teacher!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to continue your journey.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left flex items-center space-x-2 text-red-600 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Email / Teacher ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email / teacher id"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-slate-800 dark:text-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-slate-800 dark:text-white transition-all"
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
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 transition-all"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.location.href = 'http://localhost:5173/?view=role-select'}
          className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to role selection</span>
        </button>
      </main>
      <AuthFooter />
    </div>
  );
};


