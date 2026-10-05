import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] bg-premium text-slate-100 flex">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`md:block shrink-0 ${mobileSidebarOpen ? 'block' : 'hidden'}`}>
        <Sidebar />
      </div>

      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <Navbar onMobileToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
