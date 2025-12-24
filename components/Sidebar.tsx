
import React from 'react';
import { LayoutDashboard, Briefcase, Trophy, FileText, Settings, Zap, Users, Telescope, LogOut, ChevronRight } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { ViewType } from '../types';

const Sidebar: React.FC = () => {
  const { activeView, setActiveView, resume } = useJobs();

  const menuItems: { id: ViewType; icon: any; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Control Room' },
    { id: 'jobs', icon: Briefcase, label: 'Applications' },
    { id: 'offers', icon: Trophy, label: 'Wins & Prep' },
    { id: 'networking', icon: Users, label: 'The Nexus' },
    { id: 'discovery', icon: Telescope, label: 'Discovery' },
    { id: 'resume', icon: FileText, label: 'Protocol' },
    { id: 'settings', icon: Settings, label: 'System' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full hidden lg:flex relative">
      <div className="p-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-slate-900 block leading-none">HireWire</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 block">AI Career Engine</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1.5 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-200 group ${
              activeView === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className={`w-4.5 h-4.5 ${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </div>
            {activeView === item.id && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>
        ))}
      </nav>

      <div className="p-8">
        <div className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <img src={resume.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="User" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate">{resume.fullName}</p>
              <p className="text-[9px] font-bold text-indigo-500 uppercase truncate">Verified Profile</p>
            </div>
          </div>
          <button className="w-full py-2.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
