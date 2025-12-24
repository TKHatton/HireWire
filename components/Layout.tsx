
import React from 'react';
import Sidebar from './Sidebar';
import HillaryChat from './HillaryChat';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
        <HillaryChat />
      </main>
    </div>
  );
};

export default Layout;
