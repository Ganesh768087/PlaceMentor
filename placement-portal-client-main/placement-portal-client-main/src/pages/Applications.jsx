import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import applicationService from '../services/applicationService';
import ApplicationCard from '../components/ApplicationCard';
import Toast from '../components/Toast';
import { 
  Bot,
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Briefcase, 
  Building2, 
  Globe, 
  FileText, 
  Tag, 
  Clock, 
  Trash2, 
  X, 
  Check, 
  Edit3, 
  CalendarDays,
  History
} from 'lucide-react';

const Applications = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [sort, setSort] = useState('newest');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form fields (Add / Edit)
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [source, setSource] = useState('linkedin');
  const [jobLink, setJobLink] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentStage, setCurrentStage] = useState('Applied');
  const [jobDescription, setJobDescription] = useState('');
  const [notes, setNotes] = useState('');

  // Event Scheduler fields
  const [nextEventType, setNextEventType] = useState('');
  const [nextEventDate, setNextEventDate] = useState('');

  const stages = [
    'All',
    'Applied',
    'OA Scheduled',
    'OA Cleared',
    'Technical Interview',
    'HR Interview',
    'Offered',
    'Rejected'
  ];

  const sources = [
    { value: 'oncampus', label: 'On Campus' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'indeed', label: 'Indeed' },
    { value: 'glassdoor', label: 'Glassdoor' },
    { value: 'referral', label: 'Referral' },
    { value: 'companywebsite', label: 'Company Website' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'other', label: 'Other' }
  ];

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStage !== 'All') {
        params.stage = selectedStage;
      }
      if (search) {
        params.company = search;
      }
      params.sort = sort;
      params.limit = 100; // Load all matching for custom client side layout

      const response = await applicationService.getApplications(params);
      if (response.success) {
        setApplications(response.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [selectedStage, sort]);

  // Handle parameters passed from dashboard redirect
  useEffect(() => {
    if (location.state) {
      if (location.state.openAddModal) {
        setIsAddOpen(true);
      }
      if (location.state.selectedAppId) {
        fetchAppDetails(location.state.selectedAppId);
      }
    }
  }, [location.state]);

  // const fetchAppDetails = async (id) => {
  //   try {
  //     const response = await applicationService.getApplicationDetails(id);
  //     if (response.success) {
  //       setSelectedApp(response.data);
  //       resetEventForm(response.data);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     showToast('Failed to fetch details', 'error');
  //   }
  // };
  const fetchAppDetails = async (id) => {
  try {
    console.log("Fetching:", id);

    const response = await applicationService.getApplicationDetails(id);

    console.log("Response:", response);

    if (response.success) {
      console.log("Setting selected app");

      setSelectedApp(response.data);

      console.log("Selected app data:", response.data);

      resetEventForm(response.data);
    }
  } catch (err) {
    console.error(err);
    showToast("Failed to fetch details", "error");
  }
};

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadApplications();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!companyName || !role) {
      showToast('Company Name and Role are required', 'error');
      return;
    }

    try {
      const response = await applicationService.createApplication({
        companyName,
        role,
        source,
        jobLink,
        appliedDate: new Date(appliedDate),
        currentStage,
        jobDescription,
        notes
      });

      if (response.success) {
        showToast('Application created successfully');
        setIsAddOpen(false);
        resetForm();
        loadApplications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create application', 'error');
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await applicationService.updateApplicationDetails(selectedApp._id, {
        companyName,
        role,
        source,
        jobDescription,
        notes
      });
      if (response.success) {
        showToast('Details updated successfully');
        setIsEditMode(false);
        fetchAppDetails(selectedApp._id);
        loadApplications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleStageChange = async (newStage) => {
    try {
      const response = await applicationService.updateApplicationStage(selectedApp._id, newStage);
      if (response.success) {
        showToast(`Moved to ${newStage}`);
        fetchAppDetails(selectedApp._id);
        loadApplications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change stage', 'error');
    }
  };

  const handleScheduleEvent = async (e) => {
    e.preventDefault();
    if (!nextEventType || !nextEventDate) {
      showToast('Please specify both event type and date', 'error');
      return;
    }
    try {
      const response = await applicationService.updateApplicationEvent(
        selectedApp._id,
        nextEventType,
        new Date(nextEventDate)
      );
      if (response.success) {
        showToast('Upcoming event scheduled');
        fetchAppDetails(selectedApp._id);
        loadApplications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to schedule event', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application? This will soft delete the record.')) return;
    try {
      const response = await applicationService.deleteApplication(id);
      if (response.success) {
        showToast('Application deleted');
        setSelectedApp(null);
        loadApplications();
      }
    } catch (err) {
      showToast('Failed to delete application', 'error');
    }
  };

  const resetForm = () => {
    setCompanyName('');
    setRole('');
    setSource('linkedin');
    setJobLink('');
    setAppliedDate(new Date().toISOString().split('T')[0]);
    setCurrentStage('Applied');
    setJobDescription('');
    setNotes('');
  };

  const resetEventForm = (app) => {
    setNextEventType(app.nextEventType || '');
    setNextEventDate(app.nextEventDate ? app.nextEventDate.split('T')[0] : '');
  };

  const startEditMode = () => {
    setCompanyName(selectedApp.companyName);
    setRole(selectedApp.role);
    setSource(selectedApp.source || 'linkedin');
    setJobDescription(selectedApp.jobDescription || '');
    setNotes(selectedApp.notes || '');
    setIsEditMode(true);
  };
  console.log("Current selectedApp:", selectedApp);

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm placeholder:text-slate-600 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-250 border border-slate-700 rounded-xl text-sm font-semibold cursor-pointer transition-all"
          >
            Search
          </button>
        </form>

        {/* Buttons */}
        <div className="flex gap-3 items-center self-end md:self-auto">
          {/* Sorting */}
          <div className="relative">
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="pl-3 pr-8 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/55 rounded-xl text-xs font-semibold text-slate-300 outline-none cursor-pointer appearance-none min-w-[120px]"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company A-Z</option>
            </select>
            <Filter className="absolute right-3 top-3.5 text-slate-500 w-3.5 h-3.5 pointer-events-none" />
          </div>

          <button 
            onClick={() => { resetForm(); setIsAddOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold cursor-pointer transition-all shadow-lg shadow-indigo-600/15"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Stage tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setSelectedStage(stage)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              selectedStage === stage 
                ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-extrabold' 
                : 'bg-slate-900/30 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Applications Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-44 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card p-16 text-center rounded-3xl max-w-xl mx-auto border border-dashed border-slate-800">
          <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">No applications found</h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            We couldn't find any job applications matching your query. Add a new application or adjust filters to begin tracking.
          </p>
          <button 
            onClick={() => { resetForm(); setIsAddOpen(true); }}
            className="px-5 py-2.5 bg-indigo-605 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg"
          >
            Create Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <ApplicationCard 
              key={app._id} 
              application={app} 
              onClick={fetchAppDetails}
            />
          ))}
        </div>
      )}

      {/* MODAL: ADD APPLICATION */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative my-8">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Add Job Application
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Company Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Google"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none placeholder:text-slate-700 focus:bg-slate-950"
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Role / Position *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="SDE Intern"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none placeholder:text-slate-700 focus:bg-slate-950"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Source Platform */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Source Platform</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <select 
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none cursor-pointer appearance-none focus:bg-slate-950"
                    >
                      {sources.map(src => (
                        <option key={src.value} value={src.value}>{src.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Applied Date */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Applied Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="date"
                      value={appliedDate}
                      onChange={e => setAppliedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none focus:bg-slate-950 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Job Link */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Job Link (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://careers.google.com/jobs/..."
                    value={jobLink}
                    onChange={e => setJobLink(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none placeholder:text-slate-700 focus:bg-slate-950"
                  />
                </div>

                {/* Initial Stage */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Stage</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <select 
                      value={currentStage}
                      onChange={e => setCurrentStage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none cursor-pointer appearance-none focus:bg-slate-950"
                    >
                      {stages.filter(s => s !== 'All').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Job Description (Highly recommended for AI coach)</label>
                <textarea 
                  rows="4"
                  placeholder="Paste the job requirements, responsibilities, and target skills here..."
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none placeholder:text-slate-750 focus:bg-slate-950 resize-y"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Notes / Observations</label>
                <textarea 
                  rows="2"
                  placeholder="E.g. Referral from Senior, HR contact info..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none placeholder:text-slate-755 focus:bg-slate-950 resize-y"
                />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-800/60 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg"
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL SIDE DRAWER (APPLICATION DETAILS) */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 z-40 flex justify-end backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0d111d] border-l border-slate-800/80 h-full flex flex-col shadow-2xl relative animate-slideLeft">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{selectedApp.companyName}</h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{selectedApp.role}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDelete(selectedApp._id)}
                  className="text-slate-500 hover:text-rose-400 p-2 hover:bg-slate-800 rounded-xl transition-all"
                  title="Delete Application"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => setSelectedApp(null)} 
                  className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isEditMode ? (
                /* EDIT DETAILS FORM */
                <form onSubmit={handleUpdateDetails} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 block">Company Name</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 block">Role</label>
                    <input 
                      type="text" 
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 block">Source Platform</label>
                    <select 
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm"
                    >
                      {sources.map(src => (
                        <option key={src.value} value={src.value}>{src.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 block">Job Description</label>
                    <textarea 
                      rows="6"
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 block">Notes</label>
                    <textarea 
                      rows="3"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm outline-none"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* READ ONLY VIEWS */
                <>
                  {/* Stage flow pipeline switcher */}
                  <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Pipeline Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {stages.filter(s => s !== 'All').map((stg) => {
                        const isCurrent = selectedApp.currentStage === stg;
                        return (
                          <button
                            key={stg}
                            onClick={() => !isCurrent && handleStageChange(stg)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              isCurrent 
                                ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400' 
                                : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-350 hover:bg-slate-900'
                            }`}
                          >
                            {stg}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary / Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/20 border border-slate-800/50 rounded-2xl">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Applied Source</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block uppercase tracking-wide">
                        {selectedApp.source || 'other'}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-900/20 border border-slate-800/50 rounded-2xl">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Applied Date</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">
                        {new Date(selectedApp.appliedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Job Link */}
                  {selectedApp.jobLink && (
                    <div className="p-4 bg-slate-900/20 border border-slate-800/50 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Original Posting</span>
                        <a 
                          href={selectedApp.jobLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-indigo-400 font-semibold hover:underline block mt-0.5 truncate max-w-[400px]"
                        >
                          {selectedApp.jobLink}
                        </a>
                      </div>
                      <Globe className="w-5 h-5 text-indigo-400/40 shrink-0" />
                    </div>
                  )}

                  {/* Event Scheduler */}
                  <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" /> Schedule Next Event
                    </h4>
                    
                    <form onSubmit={handleScheduleEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Event Type</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Technical Round 1"
                          value={nextEventType}
                          onChange={e => setNextEventType(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Date</label>
                        <input 
                          type="date"
                          value={nextEventDate}
                          onChange={e => setNextEventDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 outline-none focus:border-indigo-500/50"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 border border-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Schedule
                      </button>
                    </form>
                  </div>

                  {/* Job Description details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> Job Description
                      </h4>
                      <button onClick={startEditMode} className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>
                    {selectedApp.jobDescription ? (
                      <p className="text-xs text-slate-350 bg-slate-950/40 p-4 rounded-2xl border border-slate-900 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line scrollbar-thin">
                        {selectedApp.jobDescription}
                      </p>
                    ) : (
                      <div 
                        onClick={startEditMode}
                        className="text-center p-6 border border-dashed border-slate-800 hover:border-indigo-500/30 rounded-2xl text-xs text-slate-500 cursor-pointer"
                      >
                        No job description saved. Click to edit and paste one to enable the AI coach.
                      </div>
                    )}
                  </div>

                  {/* Notes details */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> Notes
                    </h4>
                    {selectedApp.notes ? (
                      <p className="text-xs text-slate-350 bg-slate-950/40 p-4 rounded-2xl border border-slate-900 leading-relaxed whitespace-pre-line">
                        {selectedApp.notes}
                      </p>
                    ) : (
                      <div 
                        onClick={startEditMode}
                        className="p-4 border border-slate-900 rounded-2xl text-xs text-slate-500 hover:text-indigo-400 cursor-pointer"
                      >
                        No notes added yet.
                      </div>
                    )}
                  </div>

                  {/* Timeline History log */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-indigo-400" /> Audit Log (Status History)
                    </h4>
                    <div className="pl-3 border-l border-slate-850 space-y-4">
                      {selectedApp.statusHistory?.map((hist, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute left-[-16px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-slate-950 glow-indigo" />
                          <div className="text-xs">
                            <span className="font-bold text-slate-300">{hist.status}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {new Date(hist.changedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Read-only details Footer */}
            {!isEditMode && (
              <div className="p-6 border-t border-slate-800/80 flex justify-between bg-slate-950/20">
                <button
                  onClick={() => {
                    // Navigate to AI Prep with this application pre-selected
                    navigate('/ai-prep', { state: { targetAppId: selectedApp._id } });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  Generate AI Prep
                </button>

                <button 
                  onClick={startEditMode}
                  className="px-5 py-2.5 bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Edit Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Applications;
