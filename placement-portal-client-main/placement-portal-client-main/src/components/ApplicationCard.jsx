import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Briefcase 
} from 'lucide-react';

const ApplicationCard = ({ application, onClick }) => {
  const getStageColor = (stage) => {
    switch (stage) {
      case 'Applied':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      case 'OA Scheduled':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'OA Cleared':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Technical Interview':
        return 'bg-violet-500/10 border-violet-500/30 text-violet-400';
      case 'HR Interview':
        return 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400';
      case 'Offered':
        return 'bg-green-500/15 border-green-500/40 text-green-400 shadow-md shadow-green-950/20';
      case 'Rejected':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  const getSourceLabel = (src) => {
    if (!src) return 'Other';
    if (src === 'companywebsite') return 'Website';
    return src.charAt(0).toUpperCase() + src.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div 
      onClick={() => onClick(application._id)}
      className="glass-card p-5 rounded-2xl cursor-pointer hover:shadow-lg relative overflow-hidden group"
    >
      {/* Glow Effect on Offered */}
      {application.currentStage === 'Offered' && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
              {application.companyName}
            </h3>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[150px] sm:max-w-[200px] flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              {application.role}
            </p>
          </div>
        </div>
        <button className="text-slate-500 group-hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-all duration-200">
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Badges & Date */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/40">
        <div className="flex gap-2">
          {/* Stage Badge */}
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border leading-none ${getStageColor(application.currentStage)}`}>
            {application.currentStage}
          </span>
          {/* Source Badge */}
          <span className="text-[10px] font-semibold px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg uppercase tracking-wider leading-none">
            {getSourceLabel(application.source)}
          </span>
        </div>
        
        {/* Applied Date */}
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(application.appliedDate)}
        </span>
      </div>

      {/* Next Event indicator if exists */}
      {application.nextEventDate && (
        <div className="mt-3 px-3 py-1.5 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 truncate max-w-[100px]">
            {application.nextEventType || 'Next Event'}
          </span>
          <span className="text-[10px] font-medium text-slate-400 shrink-0">
            {formatDate(application.nextEventDate)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
