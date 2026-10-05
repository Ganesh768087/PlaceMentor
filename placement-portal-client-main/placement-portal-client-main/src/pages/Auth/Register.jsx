import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, User, UserPlus, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import Toast from '../../components/Toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !college || !branch || !graduationYear) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setSubmitting(true);
    
    const result = await register({
      name,
      email,
      password,
      college,
      branch,
      graduationYear: Number(graduationYear),
    });
    
    setSubmitting(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] bg-premium flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg z-10 my-8">
        {/* Brand header */}
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
            <UserPlus className="w-5 h-5 text-indigo-400" /> Register Student Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid 2 Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Ladi Akshay"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-650 outline-none transition-all focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="e.g. ladi@iiest.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-650 outline-none transition-all focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-650 outline-none transition-all focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            {/* College */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">College / University</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. IIEST Shibpur"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-650 outline-none transition-all focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Branch */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Branch / Major</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. CST"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-650 outline-none transition-all focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              {/* Graduation Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Graduation Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="number"
                    placeholder="e.g. 2027"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-650 outline-none transition-all focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 cursor-pointer disabled:opacity-50 mt-4"
            >
              {submitting ? 'Creating Account...' : 'Register Account'}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </div>
  );
};

export default Register;
