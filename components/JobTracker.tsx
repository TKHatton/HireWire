
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Search, Plus, Sparkles, MapPin, DollarSign, Trash2, ArrowRight, Briefcase } from 'lucide-react';
import JobModal from './JobModal';

const JobTracker: React.FC = () => {
  const { jobs, deleteJob } = useJobs();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(search.toLowerCase()) || 
                          job.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === 'All' || job.status === filter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My <span className="text-indigo-600">Jobs</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Track and manage all your job applications in one place.</p>
        </div>
        <button 
          onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
          className="flex items-center gap-2.5 bg-slate-900 text-white px-7 py-3.5 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          Deploy New Job
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-slate-900 text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-full xl:w-auto">
          {['All', 'Applied', 'Interview', 'Offer'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 xl:flex-none px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="hire-card p-7 flex flex-col group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-300 font-black text-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                {job.company[0]}
              </div>
              <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                job.status === 'Offer' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
              }`}>
                {job.status}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{job.role}</h3>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">{job.company}</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-slate-300" />
                <span>{job.salary || 'Salary Undisclosed'}</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditingJob(job); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <Sparkles className="w-4 h-4" />
                </button>
                <button onClick={() => deleteJob(job.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => { setEditingJob(job); setIsModalOpen(true); }}
                className="flex items-center gap-2 py-2 px-4 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
              >
                Inspect
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900">Pipeline Empty</h3>
          <p className="text-slate-400 text-sm font-medium mt-2">Ready to deploy your first career move?</p>
        </div>
      )}

      {isModalOpen && (
        <JobModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          job={editingJob} 
        />
      )}
    </div>
  );
};

export default JobTracker;
