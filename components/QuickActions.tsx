
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Plus, Clock, ShieldAlert, Trophy, X, Calendar, DollarSign, CheckCircle2, Sparkles } from 'lucide-react';
import { Job, JobStatus } from '../types';

const QuickActions: React.FC = () => {
  const { jobs, updateJob, setActiveView } = useJobs();
  const [activeModal, setActiveModal] = useState<'interview' | 'reject' | 'offer' | null>(null);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [extraData, setExtraData] = useState({ date: '', reason: '', salary: '' });

  const handleUpdate = () => {
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;

    let newStatus: JobStatus = job.status;
    let update: Partial<Job> = {};

    if (activeModal === 'interview') {
      newStatus = 'Interview';
      update = { interviewDate: extraData.date };
    } else if (activeModal === 'reject') {
      newStatus = 'Rejected';
      update = { rejectionReason: extraData.reason };
    } else if (activeModal === 'offer') {
      newStatus = 'Offer';
      update = { salary: extraData.salary };
    }

    updateJob({ ...job, status: newStatus, ...update });
    setActiveModal(null);
    setSelectedJobId('');
    setExtraData({ date: '', reason: '', salary: '' });
  };

  const getFilteredJobs = () => {
    if (activeModal === 'interview') return jobs.filter(j => j.status === 'Applied');
    if (activeModal === 'reject') return jobs.filter(j => j.status !== 'Rejected' && j.status !== 'Accepted');
    if (activeModal === 'offer') return jobs.filter(j => j.status === 'Interview');
    return [];
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Quick Update</span>
        <div className="h-6 w-px bg-slate-100 hidden sm:block" />
        
        <button 
          onClick={() => setActiveView('jobs')} 
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-100"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-500" />
          Add Job
        </button>

        <button 
          onClick={() => setActiveModal('interview')}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all border border-indigo-100"
        >
          <Clock className="w-3.5 h-3.5" />
          Logged Interview
        </button>

        <button 
          onClick={() => setActiveModal('reject')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all border border-red-100"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Rejection
        </button>

        <button
          onClick={() => setActiveModal('offer')}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all border border-emerald-100"
        >
          <Trophy className="w-3.5 h-3.5" />
          Got Offer
        </button>

        <button
          onClick={() => setActiveView('resume')}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all border border-purple-100"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Build Avatar
        </button>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[250] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 capitalize">
                {activeModal === 'offer' && <Trophy className="w-6 h-6 text-amber-500" />}
                {activeModal === 'interview' && <Clock className="w-6 h-6 text-indigo-500" />}
                {activeModal === 'reject' && <ShieldAlert className="w-6 h-6 text-red-500" />}
                {activeModal} Update
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-50 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Active Role</label>
                <select 
                  className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                >
                  <option value="">Choose a job...</option>
                  {getFilteredJobs().map(j => (
                    <option key={j.id} value={j.id}>{j.role} at {j.company}</option>
                  ))}
                </select>
              </div>

              {activeModal === 'interview' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Interview Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                      value={extraData.date}
                      onChange={e => setExtraData({...extraData, date: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {activeModal === 'reject' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Reason (Optional)</label>
                  <input 
                    placeholder="Ghosted, technical mismatch, etc." 
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                    value={extraData.reason}
                    onChange={e => setExtraData({...extraData, reason: e.target.value})}
                  />
                </div>
              )}

              {activeModal === 'offer' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Salary Package</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      placeholder="120k + Equity" 
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                      value={extraData.salary}
                      onChange={e => setExtraData({...extraData, salary: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={handleUpdate}
                disabled={!selectedJobId}
                className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Commit Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
