import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Menu } from 'lucide-react';

const Navbar = ({ onMobileToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Placement Dashboard';
      case '/applications':
        return 'Job Applications Tracker';
      case '/ai-prep':
        return 'AI Interview Coach';
      case '/analytics':
        return 'Placement Analytics';
      case '/profile':
        return 'User Profile & Resume';
      default:
        return 'PlaceMentor';
    }
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="h-20 glass-panel border-b border-slate-800/60 flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button 
          onClick={onMobileToggle}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight leading-none mb-1">{getPageTitle()}</h2>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">{getFormattedDate()}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Date Widget */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 font-medium">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Dev Version 1.0</span>
        </div>

        {/* Small User Widget */}
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 bg-slate-900/50 px-3 py-1.5 border border-slate-800 rounded-xl">
              {user.college || 'IIEST Shibpur'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
