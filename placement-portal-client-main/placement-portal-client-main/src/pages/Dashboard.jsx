import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import applicationService from '../services/applicationService';
import aiService from '../services/aiService';
import ApplicationCard from '../components/ApplicationCard';
import { 
  Plus, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  TrendingUp,
  Brain,
  Upload,
  AlertCircle
} from 'lucide-react';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsData = await applicationService.getApplicationStats();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch applications (page 1, limit 4 to show recent ones)
      const appsData = await applicationService.getApplications({ page: 1, limit: 4 });
      if (appsData.success) {
        setRecentApps(appsData.data);
      }

      // Check if resume uploaded
      try {
        const resumeData = await aiService.getResume();
        if (resumeData.success && resumeData.data) {
          setHasResume(true);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setHasResume(false);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getActiveCount = () => {
    if (!stats) return 0;
    const summary = stats.summary;
    return stats.totalApplications - (summary.Offered || 0) - (summary.Rejected || 0);
  };

  const getRejectionRate = () => {
    if (!stats || stats.totalApplications === 0) return '0%';
    const summary = stats.summary;
    const rate = ((summary.Rejected || 0) / stats.totalApplications) * 100;
    return `${rate.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-900/40 border border-slate-800 rounded-3xl" />
          ))}
        </div>
        {/* Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-900/40 border border-slate-800 rounded-3xl" />
          <div className="h-96 bg-slate-900/40 border border-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  const summary = stats?.summary || {};

  return (
    <div className="space-y-8">
      {/* Top Banner Warning for missing resume */}
      {!hasResume && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white leading-tight">Resume required for AI Coach</p>
              <p className="text-xs text-amber-400/80 mt-0.5">Please upload your PDF resume to unlock personalized mock questions and roadmaps.</p>
            </div>
          </div>
          <Link 
            to="/profile" 
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold shrink-0 w-fit transition-all duration-200"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Now
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Apps */}
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</span>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats?.totalApplications || 0}</h3>
          </div>
          <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Active Processes */}
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Stages</span>
            <h3 className="text-3xl font-extrabold text-white mt-1">{getActiveCount()}</h3>
          </div>
          <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Offers */}
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Offers Received</span>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{summary.Offered || 0}</h3>
          </div>
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Rejection Rate */}
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rejection Rate</span>
            <h3 className="text-3xl font-extrabold text-rose-450 mt-1">{getRejectionRate()}</h3>
          </div>
          <div className="p-3.5 bg-rose-500/10 text-rose-450 rounded-2xl border border-rose-500/20">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" /> Recent Applications
            </h3>
            <button 
              onClick={() => navigate('/applications')}
              className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 hover:underline"
            >
              View All
            </button>
          </div>

          {recentApps.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl border border-dashed border-slate-800/80">
              <Briefcase className="w-12 h-12 text-slate-650 mx-auto mb-4" />
              <p className="text-slate-400 font-medium mb-4">No job applications tracked yet.</p>
              <button 
                onClick={() => navigate('/applications', { state: { openAddModal: true } })}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                <Plus className="w-4 h-4" />
                Add Your First Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentApps.map((app) => (
                <ApplicationCard 
                  key={app._id} 
                  application={app} 
                  onClick={() => navigate('/applications', { state: { selectedAppId: app._id } })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side Panel: AI Prep Promotion / Overview */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" /> AI Coach Quick Start
          </h3>

          <div className="glass-card p-6 rounded-3xl bg-gradient-to-b from-indigo-950/20 to-transparent border border-indigo-900/10 space-y-5">
            <div className="bg-indigo-600/10 p-3 rounded-2xl border border-indigo-500/20 text-indigo-400 w-fit">
              <Brain className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Generate Tailored Interview Questions</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Connect your targets to Gemini! Paste a target job description, select your application, and get immediately generated role-specific technical questions, HR STAR scenarios, and a custom study roadmap.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/ai-prep')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-660 hover:bg-indigo-600 text-white rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-660/15"
            >
              <span>Launch AI Coach</span>
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics list */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-slate-300 text-sm">Stage Summary</h4>
            <div className="space-y-3">
              {[
                { name: 'Applied', count: summary.Applied || 0, color: 'bg-indigo-500' },
                { name: 'Online Assessments', count: (summary['OA Scheduled'] || 0) + (summary['OA Cleared'] || 0), color: 'bg-blue-500' },
                { name: 'Technical Interviews', count: summary['Technical Interview'] || 0, color: 'bg-violet-500' },
                { name: 'HR Interviews', count: summary['HR Interview'] || 0, color: 'bg-fuchsia-500' },
              ].map((stage) => (
                <div key={stage.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-slate-400 font-medium">{stage.name}</span>
                  </div>
                  <span className="font-bold text-slate-200">{stage.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  );
};

export default Dashboard;
