import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import Toast from '../../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] bg-premium flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic glow objects in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Main card */}
      <div className="w-full max-w-md z-10">
        {/* Brand logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600/20 border border-indigo-500/30 p-3 rounded-2xl text-indigo-400 mb-3 shadow-lg shadow-indigo-500/10">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">PlaceMentor</h1>
          <p className="text-slate-400 text-sm mt-1">Accelerate your campus placement prep</p>
        </div>

        {/* Card Panel */}
        <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-indigo-400" /> Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  placeholder="e.g. sai@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Bottom links */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  );
};

export default Login;
