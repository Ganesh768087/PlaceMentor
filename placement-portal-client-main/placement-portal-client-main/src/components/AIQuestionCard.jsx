import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Award, Lightbulb } from 'lucide-react';

const AIQuestionCard = ({ questionItem, index, type = 'technical' }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const getDifficultyColor = (diff) => {
    if (!diff) return 'bg-slate-900 text-slate-400 border-slate-800';
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(questionItem.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasDetail = type === 'technical' 
    ? (questionItem.expectedAnswer || questionItem.hint) 
    : questionItem.starHint;

  return (
    <div 
      onClick={() => hasDetail && setExpanded(!expanded)}
      className={`glass-card p-5 rounded-2xl border transition-all duration-300 ${
        expanded 
          ? 'border-indigo-500/30 bg-slate-900/40' 
          : 'border-slate-800/60'
      } ${hasDetail ? 'cursor-pointer hover:bg-slate-900/30' : 'cursor-default'}`}
    >
      {/* Top Header Row */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-600/10 px-2 py-0.5 rounded border border-indigo-500/10 uppercase tracking-wider">
              Q{index + 1}
            </span>
            {questionItem.topic && (
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wide">
                {questionItem.topic}
              </span>
            )}
            {questionItem.difficulty && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDifficultyColor(questionItem.difficulty)}`}>
                {questionItem.difficulty}
              </span>
            )}
          </div>
          {/* Question Text */}
          <h4 className="text-slate-100 font-semibold text-base leading-snug group-hover:text-white">
            {questionItem.question}
          </h4>
        </div>

        {/* Action button row */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
          <button 
            onClick={handleCopy}
            className="text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-all duration-200"
            title="Copy question text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          
          {hasDetail && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-all"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Solution Detail */}
      {expanded && hasDetail && (
        <div className="mt-4 pt-4 border-t border-slate-800/60 animate-fadeIn">
          {type === 'technical' ? (
            <div className="space-y-3">
              {questionItem.expectedAnswer && (
                <div>
                  <h5 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Expected Answer
                  </h5>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-900">
                    {questionItem.expectedAnswer}
                  </p>
                </div>
              )}
              {questionItem.hint && (
                <div>
                  <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Key Concept / Hint
                  </h5>
                  <p className="text-xs text-slate-400 italic">
                    {questionItem.hint}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h5 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                STAR Framework Response Hint
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-900">
                {questionItem.starHint}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIQuestionCard;
