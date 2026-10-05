import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import applicationService from '../services/applicationService';
import aiService from '../services/aiService';
import AIQuestionCard from '../components/AIQuestionCard';
import Toast from '../components/Toast';
import { Brain, Settings, ArrowRight,  Sparkles,BookOpen, Calendar, HelpCircle, Award,AlertCircle,Clock,Printer,Copy,Check, RefreshCw} from 'lucide-react';

const AIPreparation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  
  const [hasResume, setHasResume] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const [prepData, setPrepData] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Form options
  const [mode, setMode] = useState('stage'); // 'stage' or 'full'
  const [activeTab, setActiveTab] = useState('technical'); // 'technical', 'hr', 'roadmap', 'oa'
  const [copied, setCopied] = useState(false);

  const loadingSteps = [
    'Retrieving candidate resume context...',
    'Extracting target job description requirements...',
    'Running Technical Interview Agent for domain questions...',
    'Analyzing behavioral traits with HR Interview Agent...',
    'Assembling personalized study roadmap with Guidance Agent...',
    'Persisting generated content for instant cache recall...'
  ];
  const flattenRoadmap = (studyRoadmap) => {
  if (!studyRoadmap) return [];

  return [
    ...(studyRoadmap.week1 || []),
    ...(studyRoadmap.week2 || [])
  ];
};

const getCountdown = (date) => {
  if (!date) return null;

  const diff =
    new Date(date).getTime() - new Date().getTime();

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Completed";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";

  return `${days} days remaining`;
};

const urgencyColor = (bucket) => {
  switch (bucket) {
    case "crash":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    case "compressed":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";

    case "focused":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";

    case "broad":
      return "bg-green-500/10 text-green-400 border-green-500/20";

    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
};

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const checkResumeAndLoadApps = async () => {
      try {
        setResumeLoading(true);
        const resResponse = await aiService.getResume();
        if (resResponse.success && resResponse.data) {
          setHasResume(true);
        }
      } catch (err) {
        setHasResume(false);
      } finally {
        setResumeLoading(false);
      }

      try {
        const appsResponse = await applicationService.getApplications({ limit: 100 });
        if (appsResponse.success) {
          setApplications(appsResponse.data);
          
          // Pre-select app if redirected from applications list details
          const targetId = location.state?.targetAppId;
          if (targetId) {
            setSelectedAppId(targetId);
            const appObj = appsResponse.data.find(a => a._id === targetId);
            if (appObj) {
              setSelectedApp(appObj);
              checkExistingPrep(targetId);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkResumeAndLoadApps();
  }, [location.state]);

  const handleAppChange = (appId) => {
    setSelectedAppId(appId);
    setPrepData(null);
    if (!appId) {
      setSelectedApp(null);
      return;
    }
    const app = applications.find(a => a._id === appId);
    setSelectedApp(app);
    checkExistingPrep(appId);
  };

  const checkExistingPrep = async (appId) => {
    try {
      const response = await aiService.getLatestHistory(appId);
      if (response.success && response.data?.exists) {
        // Load latest prep data structure
        const prep = response.data;
        const formattedPrep = {
          mode: prep.mode,
          technicalQuestions: prep.result?.technicalQuestions || [],
          hrQuestions: prep.result?.hrQuestions || [],
          studyRoadmap: prep.result?.studyRoadmap || {},
          oaPreparation: prep.result?.oaPreparation || {},
          generatedAt: prep.result?.generatedAt,
          promptVersion: prep.promptVersion
        };
        setPrepData(formattedPrep);
      }
    } catch (err) {
      console.error('Failed to check existing prep:', err);
    }
  };

  const generatePrep = async (forceRegenerate = false) => {
    if (loading) return;
    if (!selectedAppId) {
      showToast('Please select a job application first', 'error');
      return;
    }
    if (!selectedApp.jobDescription) {
      showToast('Please add a Job Description to the application first', 'error');
      return;
    }

   let interval;

try {

  setLoading(true);
  setLoadingStep(0);

  interval = setInterval(() => {
    setLoadingStep((prev) => {
      if (prev < loadingSteps.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, 1600);

  const response = await aiService.prepareAI(
    selectedAppId,
    mode,
    forceRegenerate
  );

  if (response.success) {
    const prep = response.data;
    setPrepData(prep);
    if (prep.studyRoadmap && flattenRoadmap(prep.studyRoadmap).length > 0) {
  setActiveTab("roadmap");
} else if (
  prep.oaPreparation?.practiceQuestions?.length > 0 ||
  prep.oaPreparation?.focusTopics?.length > 0
) {
  setActiveTab("oa");
} else if (prep.technicalQuestions?.length > 0) {
  setActiveTab("technical");
} else if (prep.hrQuestions?.length > 0) {
  setActiveTab("hr");
}
    showToast("AI Prep content generated successfully");
  }

} catch (err) {

  console.error(err);
  showToast(
    err.response?.data?.message ||
    "Failed to generate prep content",
    "error"
  );

} finally {

  if (interval) clearInterval(interval);

  setLoading(false);

}
  };

  const handlePrint = () => {
    window.print();
  };

  const copyPrepToClipboard = () => {
    if (!prepData) return;
    
    let text = `AI INTERVIEW PREPARATION SHEET - ${selectedApp.companyName} (${selectedApp.role})\n`;
    text += `Generated At: ${new Date(prepData.generatedAt || Date.now()).toLocaleDateString()}\n\n`;
    
    text += `--- TECHNICAL QUESTIONS ---\n`;
    prepData.technicalQuestions.forEach((q, i) => {
      text += `Q${i + 1}: ${q.question} [${q.difficulty || 'Medium'}]\n`;
      text += `Expected Answer: ${q.expectedAnswer || 'N/A'}\n\n`;
    });
    
    text += `--- HR & BEHAVIORAL QUESTIONS ---\n`;
    prepData.hrQuestions.forEach((q, i) => {
      text += `Q${i + 1}: ${q.question}\n`;
      text += `STAR Framework Advice: ${q.starHint || 'N/A'}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Preparation content copied to clipboard');
  };

  if (resumeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  const stageButtonLabels = {
  Applied: "Study Roadmap",
  "OA Scheduled": "OA Preparation",
  "OA Cleared": "OA Preparation",
  "Technical Interview": "Technical Preparation",
  "HR Interview": "HR Preparation",
};

const stageName =
  stageButtonLabels[selectedApp?.currentStage] || "AI Preparation";

const generateText =
  mode === "full"
    ? "Generate Complete Interview Preparation"
    : `Generate ${stageName}`;

const recallText =
  mode === "full"
    ? "Load Complete Interview Preparation"
    : `Load ${stageName}`;

const regenerateText =
  mode === "full"
    ? "Regenerate Complete Interview Preparation"
    : `Regenerate ${stageName}`;

  return (
    <div className="space-y-6">
      {/* Missing Resume Warning Banner */}
      {!hasResume && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/25 rounded-3xl text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="p-3 bg-rose-500/15 rounded-2xl border border-rose-500/20 shrink-0 text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Resume Required for AI Coaching</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                PlaceMentor uses multi-agent prompts comparing your resume details against target Job Descriptions to generate tailored hints. Please upload your PDF resume first in your settings.
              </p>
            </div>
          </div>
          <Link 
            to="/profile" 
            className="flex items-center gap-1.5 px-5 py-3 bg-rose-650 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-lg shadow-rose-950/20 w-fit transition-all duration-200"
          >
            Go to Settings
          </Link>
        </div>
      )}

      {/* Main Form selection card if Resume exists */}
      {hasResume && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Column */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass-card p-6 rounded-3xl space-y-5">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" /> Prep Settings
              </h3>

              {/* Select Application */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Job Application</label>
                <select
                  value={selectedAppId}
                  onChange={e => handleAppChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-350 text-sm outline-none cursor-pointer focus:bg-slate-950"
                >
                  <option value="">-- Choose Target Job --</option>
                  {applications.map(app => (
                    <option key={app._id} value={app._id}>
                      {app.companyName} - {app.role} ({app.currentStage})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Mode */}
              {selectedApp && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Coaching Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMode('stage')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        mode === 'stage'
                          ? 'bg-indigo-600/10 border-indigo-500/35 text-indigo-400 font-extrabold'
                          : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Stage Specific
                    </button>
                    <button
                      onClick={() => setMode('full')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        mode === 'full'
                          ? 'bg-indigo-600/10 border-indigo-500/35 text-indigo-400 font-extrabold'
                          : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Full Prep Guide
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">
                    {mode === 'stage' 
                      ? `Generates questions customized specifically for the upcoming stage: ${selectedApp.currentStage}.`
                      : 'Generates comprehensive prep covering technical coding, core theory, and general HR behavioral rounds.'
                    }
                  </p>
                </div>
              )}

              {/* Generate Trigger */}
              {selectedApp && (
                <div className="space-y-3 pt-3 border-t border-slate-800/60">
                  {!selectedApp.jobDescription ? (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-450 leading-relaxed">
                        Job description is missing. <Link to="/applications" className="text-indigo-400 underline font-semibold">Go to applications</Link> and paste the JD in the details drawer to enable AI Coach.
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => generatePrep(false)}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                       <span>{loading? "Generating...": prepData? recallText: generateText}</span>
                      </button>

                      {prepData && (
                        <button
                          onClick={() => generatePrep(true)}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-750 text-slate-300 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{regenerateText}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Target Job Detail Card */}
            {selectedApp && (
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <h4 className="font-bold text-white text-sm">Target Metadata</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Company</span>
                    <span className="font-semibold text-slate-200">{selectedApp.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Role</span>
                    <span className="font-semibold text-slate-200">{selectedApp.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Stage</span>
                    <span className="font-bold text-indigo-400">{selectedApp.currentStage}</span>
                  </div>
                  {selectedApp.nextEventDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Event Scheduled</span>
                      <span className="font-medium text-slate-200">
                        {new Date(selectedApp.nextEventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Prep Display Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Loading Stepper Panel */}
            {loading ? (
              <div className="glass-card p-12 text-center rounded-3xl space-y-6 flex flex-col items-center justify-center min-h-[500px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <Brain className="w-6 h-6 text-indigo-400 absolute top-5 left-5 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-base">Assembling Interview Coaching Pack</h4>
                  <p className="text-xs text-indigo-400/90 font-semibold uppercase tracking-wide">
                    Step {loadingStep + 1} of {loadingSteps.length}
                  </p>
                  <p className="text-xs text-slate-450 italic mt-1 leading-normal max-w-sm mx-auto">
                    "{loadingSteps[loadingStep]}"
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-64 h-1 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : !prepData ? (
              /* Zero state */
              <div className="glass-card p-16 text-center rounded-3xl flex flex-col items-center justify-center min-h-[500px] border border-dashed border-slate-800/80">
                <Brain className="w-16 h-16 text-slate-700 mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Launch Interview Coach</h4>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                  Select a target job application from the sidebar, verify the settings, and trigger the generator to prepare customized mock content.
                </p>
              </div>
            ) : (
              /* RESULTS PANEL */
              <div className="space-y-6">
                
                {/* Header info / action bar */}
                <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        AI Preparation Sheet for {selectedApp.companyName}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Generated using prompt version {prepData.promptVersion} • {new Date(prepData.generatedAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 self-stretch sm:self-auto">
                    <button
                      onClick={copyPrepToClipboard}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-450 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                      title="Copy full sheet"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy All</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-450 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                      title="Print preparation sheet"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Print Sheet Styling Block (hidden on screen, visible on print) */}
                <div className="hidden print:block print:bg-white print:text-black p-8 space-y-6">
                  <h1 className="text-2xl font-bold">PLACE-MENTOR PREPARATION SHEET</h1>
                  <h2 className="text-lg">Target Company: {selectedApp.companyName} • Role: {selectedApp.role}</h2>
                  <p className="text-xs">Generated At: {new Date(prepData.generatedAt).toLocaleString()}</p>
                  
                  <div className="border-t border-black my-4" />
                  
                  <h3 className="text-base font-bold uppercase mt-6">Technical Interview Questions</h3>
                  {prepData.technicalQuestions.map((q, idx) => (
                    <div key={idx} className="my-4">
                      <p className="font-semibold">Q{idx + 1}: {q.question} ({q.difficulty || 'Medium'})</p>
                      <p className="text-sm pl-4 italic">Expected: {q.expectedAnswer}</p>
                    </div>
                  ))}

                  <h3 className="text-base font-bold uppercase mt-6">HR Behavioral STAR Scenarios</h3>
                  {prepData.hrQuestions.map((q, idx) => (
                    <div key={idx} className="my-4">
                      <p className="font-semibold">Q{idx + 1}: {q.question}</p>
                      <p className="text-sm pl-4 italic">STAR Hint: {q.starHint}</p>
                    </div>
                  ))}
                </div>

                {/* Tab layout switches */}
                <div className="flex border-b border-slate-800/60 pb-px gap-1">
                 {[
  ...(prepData.studyRoadmap &&
  flattenRoadmap(prepData.studyRoadmap).length > 0
    ? [
        {
          id: "roadmap",
          label: "Study Roadmap",
          icon: Calendar,
        },
      ]
    : []),

  ...(prepData.oaPreparation?.focusTopics?.length > 0 ||
  prepData.oaPreparation?.practiceQuestions?.length > 0
    ? [
        {
          id: "oa",
          label: "Online Assessment",
          icon: BookOpen,
        },
      ]
    : []),

  ...(prepData.technicalQuestions?.length > 0
    ? [
        {
          id: "technical",
          label: "Technical Rounds",
          icon: HelpCircle,
        },
      ]
    : []),

  ...(prepData.hrQuestions?.length > 0
    ? [
        {
          id: "hr",
          label: "Behavioral STAR",
          icon: Award,
        },
      ]
    : [])
].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-t border-x transition-all cursor-pointer select-none leading-none ${
                        activeTab === tab.id
                          ? 'bg-[#0d111d] border-slate-800 text-indigo-400 border-b-transparent translate-y-px z-10'
                          : 'bg-transparent border-transparent text-slate-500 hover:text-slate-350'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

              {/* TAB CONTENT: TECHNICAL */}
{activeTab === "technical" && (
  <div className="space-y-6 animate-fadeIn">

    {/* Technical Focus Topics */}
    {prepData.technicalFocusTopics?.length > 0 && (
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-lg font-bold text-indigo-400 mb-4">
          Focus Topics
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {prepData.technicalFocusTopics.map((topic, idx) => (
            <div
              key={idx}
              className="border border-slate-700 rounded-xl p-4 bg-slate-900/50"
            >
              <div className="flex justify-between items-center">

                <h4 className="font-semibold text-white">
                  {topic.topic}
                </h4>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    topic.priority === "High"
                      ? "bg-red-500/20 text-red-400"
                      : topic.priority === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {topic.priority}
                </span>

              </div>

              <p className="text-slate-400 text-sm mt-3">
                {topic.reason}
              </p>

            </div>
          ))}
        </div>
      </div>
    )}

    {/* Technical Questions */}
    <div>
      <h3 className="text-lg font-bold text-indigo-400 mb-4">
        Technical Questions
      </h3>

      {prepData.technicalQuestions.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs">
          No technical questions generated.
        </div>
      ) : (
        prepData.technicalQuestions.map((q, idx) => (
          <AIQuestionCard
            key={idx}
            questionItem={q}
            index={idx}
            type="technical"
          />
        ))
      )}
    </div>

    {/* Interview Strategy */}
    {prepData.interviewStrategy?.length > 0 && (
      <div className="glass-card rounded-2xl p-5">

        <h3 className="text-lg font-bold text-green-400 mb-4">
          Interview Strategy
        </h3>

        <ul className="space-y-3">
          {prepData.interviewStrategy.map((tip, idx) => (
            <li
              key={idx}
              className="flex gap-3 text-sm text-slate-300"
            >
              <span className="text-green-400 font-bold">
                ✓
              </span>

              <span>{tip}</span>

            </li>
          ))}
        </ul>

      </div>
    )}

  </div>
)}
            {/* TAB CONTENT: HR */}
{activeTab === "hr" && (
  <div className="space-y-6 animate-fadeIn">

    {/* HR Questions */}

    <div>

      <h3 className="text-lg font-bold text-pink-400 mb-4">
        Behavioural Questions
      </h3>

      {prepData.hrQuestions.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs">
          No behavioral questions generated.
        </div>
      ) : (
        prepData.hrQuestions.map((q, idx) => (
          <AIQuestionCard
            key={idx}
            questionItem={q}
            index={idx}
            type="hr"
          />
        ))
      )}

    </div>

    {/* HR Strategy */}

    {prepData.hrStrategy?.length > 0 && (

      <div className="glass-card rounded-2xl p-5">

        <h3 className="text-lg font-bold text-pink-400 mb-4">
          HR Interview Strategy
        </h3>

        <ul className="space-y-3">

          {prepData.hrStrategy.map((tip, idx) => (

            <li
              key={idx}
              className="flex gap-3 text-sm text-slate-300"
            >
              <span className="text-pink-400 font-bold">
                ✓
              </span>

              <span>{tip}</span>

            </li>

          ))}

        </ul>

      </div>

    )}

  </div>
)}

                {/* TAB CONTENT: ROADMAP */}
                {activeTab === 'roadmap' && (
                  <div className="glass-card p-6 rounded-3xl space-y-6 animate-fadeIn">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-850">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                        <Clock className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">Timeline Study Plan</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Day-by-day prep milestones aligned to your targets.</p>
                      </div>
                    </div>

                    <div className="pl-4 border-l border-slate-800 space-y-8 py-2">
                      {flattenRoadmap(prepData.studyRoadmap).length > 0 ? (
                        flattenRoadmap(prepData.studyRoadmap).map((dayPlan, idx) => (
                          <div key={idx} className="relative pl-6">
                            {/* Bullet */}
                            <div className="absolute left-[-22px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-[#0b0f19] glow-indigo flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                            
                            {/* Day focus card */}
                            <div className="space-y-2">
                             <h5 className="text-sm font-bold text-indigo-400">
    {dayPlan.day}
</h5>

<p className="text-white font-semibold">
    {dayPlan.topic}
</p>

{dayPlan.description && (
    <p className="text-xs text-slate-400 leading-relaxed mt-2">
        {dayPlan.description}
    </p>
)}
                              
                              

                              {/* Resources */}
                              {dayPlan.resources && dayPlan.resources.length > 0 && (
                                <div className="space-y-1 pt-1.5">
                                  <span className="text-[10px] font-bold text-indigo-500/70 uppercase tracking-wider block">Suggested Resources</span>
                                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {dayPlan.resources.map((resource, rIdx) => (
                                      <span key={rIdx} className="text-[10px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-900">
                                        {resource}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-500 text-xs">Roadmap format invalid or empty.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: ONLINE ASSESSMENT */}
                {activeTab === 'oa' && (
                  <div className="glass-card p-6 rounded-3xl space-y-6 animate-fadeIn">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-850">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">Online Assessment Strategy</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Custom tactics and practice vectors for coding rounds.</p>
                      </div>
                    </div>

                    <div className="space-y-6 text-xs leading-relaxed">
                      {/* Strategy */}
                      {prepData.oaPreparation?.oaStrategy && prepData.oaPreparation.oaStrategy.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">Tackling OA / Coding Round</h5>
                          <ul className="list-disc pl-4 space-y-1.5 text-slate-350">
                            {prepData.oaPreparation.oaStrategy.map((str, sIdx) => <li key={sIdx}>{str}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* Focus Topics */}
                      {prepData.oaPreparation?.focusTopics && prepData.oaPreparation.focusTopics.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">High Probability Algorithms / Topics</h5>
                          <div className="flex flex-wrap gap-2">
                            {prepData.oaPreparation.focusTopics.map((topic, idx) => (
                              <div
    key={idx}
    className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2"
>

<h4 className="font-semibold text-white">
    {topic.topic}
</h4>

<span className={`inline-block px-2 py-1 rounded-lg text-[10px] border ${
topic.priority==="High"
? "border-red-500/20 text-red-400 bg-red-500/10"
: topic.priority==="Medium"
? "border-yellow-500/20 text-yellow-400 bg-yellow-500/10"
: "border-green-500/20 text-green-400 bg-green-500/10"
}`}>

{topic.priority}

</span>

<p className="text-xs text-slate-400">
    {topic.reason}
</p>

</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Practice Questions */}
                      {prepData.oaPreparation?.practiceQuestions && prepData.oaPreparation.practiceQuestions.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">Curated Practice Challenges</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {prepData.oaPreparation.practiceQuestions.map((q, qIdx) => (
                              <div
  key={qIdx}
  className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 hover:border-indigo-500/30 transition-all"
>
  <div className="flex justify-between items-center">
    <h4 className="font-bold text-white">
      Question {qIdx + 1}
    </h4>

    <span
      className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${
        q.difficulty === "Hard"
          ? "bg-red-500/10 text-red-400"
          : q.difficulty === "Medium"
          ? "bg-yellow-500/10 text-yellow-400"
          : "bg-green-500/10 text-green-400"
      }`}
    >
      {q.difficulty}
    </span>
  </div>

  <p className="text-sm text-slate-200 leading-relaxed">
    {q.question}
  </p>

  <div className="flex flex-wrap gap-2">
    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px]">
      {q.topic}
    </span>
  </div>

  <p className="text-xs text-slate-400 leading-relaxed">
    {q.reason}
  </p>
</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AIPreparation;
