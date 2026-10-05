import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Bot, 
  BarChart3, 
  User, 
  LogOut, 
  GraduationCap 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Applications', path: '/applications', icon: Briefcase },
    { name: 'AI Preparation', path: '/ai-prep', icon: Bot },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile & Resume', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
        <div className="bg-indigo-600/20 border border-indigo-500/30 p-2 rounded-lg text-indigo-400">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide text-white leading-none">PlaceMentor</h1>
          <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">Portal</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm ${
              isActive 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      {user && (
        <div className="p-4 border-t border-slate-800/60 bg-slate-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-slate-200 truncate leading-tight">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-900/30 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
