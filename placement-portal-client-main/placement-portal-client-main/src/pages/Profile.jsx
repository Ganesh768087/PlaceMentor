import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import aiService from '../services/aiService';
import authService from '../services/authService';
import Toast from '../components/Toast';
import { 
  User, 
  Upload, 
  FileText, 
  Trash2, 
  Lock, 
  Save, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Key,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  // Profile fields state
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Resume state
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        const u = response.data;
        setName(u.name || '');
        setCollege(u.college || '');
        setBranch(u.branch || '');
        setGraduationYear(u.graduationYear ? String(u.graduationYear) : '');
      }
    } catch (err) {
      console.error('Failed to load profile details:', err);
    }
  };

  const loadResumeDetails = async () => {
    try {
      setResumeLoading(true);
      const response = await aiService.getResume();
      if (response.success && response.data) {
        setResume(response.data);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setResume(null);
      } else {
        console.error('Failed to fetch resume:', err);
      }
    } finally {
      setResumeLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadResumeDetails();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !college || !branch || !graduationYear) {
      showToast('All profile fields are required', 'error');
      return;
    }

    try {
      setProfileLoading(true);
      const result = await updateProfile({
        name,
        college,
        branch,
        graduationYear: Number(graduationYear),
      });

      if (result.success) {
        showToast('Profile details updated successfully');
      } else {
        showToast(result.message || 'Profile update failed', 'error');
      }
    } catch (err) {
      showToast('Failed to save profile changes', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are allowed', 'error');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      showToast('File size must not exceed 5 MB', 'error');
      return;
    }

    try {
      setUploading(true);
      const response = await aiService.uploadResume(file);
      if (response.success) {
        showToast('Resume PDF parsed and uploaded successfully');
        loadResumeDetails();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload resume', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your uploaded resume? AI features will be disabled until you upload a new one.')) return;
    
    try {
      const response = await aiService.deleteResume();
      if (response.success) {
        showToast('Resume deleted successfully');
        setResume(null);
      }
    } catch (err) {
      showToast('Failed to delete resume', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All password fields are required', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setPwdLoading(true);
      const response = await authService.changePassword(currentPassword, newPassword);
      if (response.success) {
        showToast('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Password change failed', 'error');
    } finally {
      setPwdLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Col 1 & 2: Details & Resume */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Profile Card Form */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-650" />
          
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Academic Profile
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address (Immutable)</label>
                <input 
                  type="text" 
                  value={user?.email || ''} 
                  disabled 
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-slate-500 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">College / University</label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="text" 
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Branch / Major</label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Graduation Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="number" 
                    value={graduationYear}
                    onChange={e => setGraduationYear(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 py-2.5 px-5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs cursor-pointer shadow-lg shadow-indigo-950/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{profileLoading ? 'Saving...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Resume PDF upload card */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-650" />

          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Managed Resume (PDF only)
          </h3>

          {resumeLoading ? (
            <div className="py-10 text-center flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-indigo-550/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : resume ? (
            /* Resume file detail */
            <div className="p-5 bg-slate-900/30 border border-slate-850 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm max-w-[200px] sm:max-w-md truncate">{resume.originalFileName}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {formatBytes(resume.fileSize)} • Uploaded on {new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 self-stretch sm:self-auto">
                <button
                  onClick={handleResumeDelete}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/25 text-slate-450 hover:text-rose-400 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            /* Upload box */
            <div className="border border-dashed border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-10 text-center bg-slate-950/20 transition-all group relative overflow-hidden">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleResumeUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-900 border border-slate-800 group-hover:border-indigo-500/30 group-hover:text-indigo-400 rounded-2xl text-slate-500 transition-colors">
                  <Upload className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <p className="text-slate-300 font-semibold text-sm">
                    {uploading ? 'Processing resume text extraction...' : 'Upload PDF resume'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1.5 leading-normal max-w-xs mx-auto">
                    Drag and drop or click to select file. Text-based PDF required (Max size 5 MB).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Col 3: Change Password */}
      <div className="space-y-6 lg:col-span-1">
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-650" />

          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" /> Security
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Password</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none placeholder:text-slate-700 focus:bg-slate-950 focus:ring-1"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none placeholder:text-slate-700 focus:bg-slate-950 focus:ring-1"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Confirm New Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm outline-none placeholder:text-slate-700 focus:bg-slate-950 focus:ring-1"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-400 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer disabled:opacity-50 mt-2"
            >
              <Key className="w-4 h-4" />
              <span>{pwdLoading ? 'Changing...' : 'Change Password'}</span>
            </button>
          </form>
        </div>

        {/* System parameters card */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h4 className="font-bold text-slate-350 text-xs uppercase tracking-wider">System Specifications</h4>
          <div className="space-y-2 text-xs leading-normal">
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">Framework</span>
              <span className="text-slate-300 font-medium">React 19 + Vite</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">Tailwind Engine</span>
              <span className="text-slate-300 font-medium">CSS v4.3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">API Connection</span>
              <span className="text-slate-300 font-semibold text-emerald-400">Local Proxy Active</span>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Profile;
