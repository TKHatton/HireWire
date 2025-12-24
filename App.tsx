
import React from 'react';
import { JobProvider, useJobs } from './context/JobContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import JobTracker from './components/JobTracker';
import ResumeBuilder from './components/ResumeBuilder';
import OffersAndGuides from './components/OffersAndGuides';
import NetworkingHub from './components/NetworkingHub';
import JobDiscovery from './components/JobDiscovery';

const ViewRenderer: React.FC = () => {
  const { activeView, setResume, setJobs, setContacts, setReminders, setSocialProfiles } = useJobs();

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      setResume({
        fullName: '',
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: '',
        avatar: '',
        regionalFormat: 'US-Resume'
      });
      setJobs([]);
      setContacts([]);
      setReminders([]);
      setSocialProfiles([]);
      alert('All data has been cleared successfully.');
    }
  };

  const handleClearProfile = () => {
    if (window.confirm('Are you sure you want to clear your profile data? This will remove your name, avatar, and resume information.')) {
      setResume({
        fullName: '',
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: '',
        avatar: '',
        regionalFormat: 'US-Resume'
      });
      alert('Profile data has been cleared successfully.');
    }
  };

  switch (activeView) {
    case 'dashboard': return <Dashboard />;
    case 'jobs': return <JobTracker />;
    case 'offers': return <OffersAndGuides />;
    case 'resume': return <ResumeBuilder />;
    case 'networking': return <NetworkingHub />;
    case 'discovery': return <JobDiscovery />;
    case 'settings': return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">App <span className="text-indigo-600">Settings</span></h1>
          <p className="text-slate-500 mt-1 font-medium italic">Manage your app preferences and data.</p>
        </header>
        <div className="hire-card p-10 space-y-8">
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="font-black text-slate-900 text-sm uppercase tracking-widest">AI Features</p>
              <p className="text-xs text-slate-500 mt-1">Powered by Google Gemini AI</p>
            </div>
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest">Active</span>
          </div>
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="font-black text-slate-900 text-sm uppercase tracking-widest">Data Storage</p>
              <p className="text-xs text-slate-500 mt-1">Stored securely in your browser</p>
            </div>
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest">Active</span>
          </div>
          <div className="space-y-4">
            <button onClick={handleClearProfile} className="w-full py-4 bg-amber-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-100">
              Clear Profile Data
            </button>
            <button onClick={handleClearAllData} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-slate-100">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    );
    default: return <Dashboard />;
  }
};

const AppContent: React.FC = () => {
  return (
    <Layout>
      <ViewRenderer />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <JobProvider>
      <AppContent />
    </JobProvider>
  );
};

export default App;
