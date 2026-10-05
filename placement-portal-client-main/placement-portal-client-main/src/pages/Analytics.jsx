import React, { useState, useEffect } from 'react';
import applicationService from '../services/applicationService';
import Toast from '../components/Toast';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon, 
  Activity, 
  Award, 
  Target, 
  AlertCircle,
  Briefcase
} from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplicationAnalytics();
      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch analytics metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-900/40 border border-slate-800 rounded-3xl" />
          ))}
        </div>
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-slate-900/40 border border-slate-800 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.overview.totalApplications === 0) {
    return (
      <div className="glass-card p-16 text-center rounded-3xl max-w-xl mx-auto border border-dashed border-slate-800 my-8">
        <BarChart3 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
        <h4 className="text-lg font-bold text-white mb-2">No placement metrics available</h4>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Add job applications and move them through different stages to populate your analytics dashboard with funnel conversions and charts.
        </p>
      </div>
    );
  }

  const { overview, stageDistribution, sourceDistribution, monthlyApplicationTrend, conversionRates } = data;

  // Chart 1: Stage Distribution Donut
  const stageData = Object.entries(stageDistribution)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);

  const stageColors = {
    'Applied': '#6366f1', // indigo
    'OA Scheduled': '#3b82f6', // blue
    'OA Cleared': '#10b981', // emerald
    'Technical Interview': '#8b5cf6', // violet
    'HR Interview': '#d946ef', // fuchsia
    'Offered': '#22c55e', // green
    'Rejected': '#ef4444' // red
  };

  // Chart 2: Funnel Attrition
  const funnelData = [
    { name: 'Applied', rate: 100 },
    { name: 'OA Scheduled', rate: conversionRates.appliedToOA || 0 },
    { name: 'OA Cleared', rate: ((conversionRates.appliedToOA || 0) * (conversionRates.oaScheduledToCleared || 0) / 100) || 0 },
    { name: 'Technical Round', rate: (((conversionRates.appliedToOA || 0) * (conversionRates.oaScheduledToCleared || 0) / 100) * (conversionRates.oaClearedToTechnical || 0) / 100) || 0 },
    { name: 'HR Round', rate: (((((conversionRates.appliedToOA || 0) * (conversionRates.oaScheduledToCleared || 0) / 100) * (conversionRates.oaClearedToTechnical || 0) / 100)) * (conversionRates.technicalToHR || 0) / 100) || 0 },
    { name: 'Offer', rate: (((((((conversionRates.appliedToOA || 0) * (conversionRates.oaScheduledToCleared || 0) / 100) * (conversionRates.oaClearedToTechnical || 0) / 100)) * (conversionRates.technicalToHR || 0) / 100)) * (conversionRates.hrToOffer || 0) / 100) || 0 }
  ].map(item => ({
    ...item,
    // Format rate to 1 decimal place
    rate: Number(item.rate.toFixed(1))
  }));

  // Chart 3: Source Distribution Horizontal Bar
  const sourceData = Object.entries(sourceDistribution)
    .map(([name, count]) => ({
      name: name === 'companywebsite' ? 'Website' : name.toUpperCase(),
      count
    }));

  return (
    <div className="space-y-8">
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Applications */}
        <div className="glass-card p-5 rounded-3xl flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Tracked</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">{overview.totalApplications} Jobs</span>
          </div>
        </div>

        {/* Active Applications */}
        <div className="glass-card p-5 rounded-3xl flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Processes</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">{overview.activeApplications} Stages</span>
          </div>
        </div>

        {/* Offer Success Rate */}
        <div className="glass-card p-5 rounded-3xl flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Award className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Conversion Rate</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">{overview.offerRate}%</span>
          </div>
        </div>

        {/* Rejection attrition */}
        <div className="glass-card p-5 rounded-3xl flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-rose-500/10 text-rose-450 rounded-2xl border border-rose-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rejection Rate</span>
            <span className="text-xl font-extrabold text-rose-450 mt-0.5 block">{overview.rejectionRate}%</span>
          </div>
        </div>
      </div>

      {/* Grid of Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Graph 1: Stage Attrition Funnel */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-indigo-400" /> Pipeline Stage Funnel (%)
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} 
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="rate" fill="url(#indigoGrad)" radius={[8, 8, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#22c55e' : '#6366f1'} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Stage Distribution Donut */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <PieIcon className="w-4.5 h-4.5 text-indigo-400" /> Current Stage Distribution
          </h4>
          <div className="h-72 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 w-full h-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stageData.map((entry) => (
                      <Cell key={entry.name} fill={stageColors[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="w-full sm:w-48 grid grid-cols-2 sm:grid-cols-1 gap-2 self-start sm:self-auto py-2">
              {stageData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: stageColors[entry.name] }} />
                  <span className="text-slate-400 truncate max-w-[100px]">{entry.name}</span>
                  <span className="font-bold text-slate-200 ml-auto shrink-0">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graph 3: Monthly submission trends */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-indigo-400" /> Monthly Application Volume Trend
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyApplicationTrend}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Source Distribution */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Briefcase className="w-4.5 h-4.5 text-indigo-400" /> Job Application Source Channels
          </h4>
          <div className="h-72">
            {sourceData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">No channel logs.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} tickLine={false} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Analytics;
