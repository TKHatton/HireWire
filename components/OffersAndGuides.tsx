
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Trophy, FileCheck, Sparkles, Loader2, MessageSquareText, ShieldAlert, Zap } from 'lucide-react';
import { generateInterviewGuide, generateMockQuestions } from '../services/gemini';

const OffersAndGuides: React.FC = () => {
  const { jobs, updateJob } = useJobs();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [mockId, setMockId] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string | null>(null);

  const interviewJobs = jobs.filter(j => ['Interview', 'Offer', 'Accepted'].includes(j.status));

  const handleGenerateGuide = async (job: any) => {
    setLoadingId(job.id);
    try {
      const guide = await generateInterviewGuide(job.role, job.company);
      updateJob({ ...job, interviewGuide: guide });
      setActiveContent(guide);
    } catch (error) { console.error(error); } finally { setLoadingId(null); }
  };

  const handleGenerateMock = async (job: any) => {
    setMockId(job.id);
    try {
      const questions = await generateMockQuestions(job.role, job.company, job.description);
      setActiveContent(questions);
    } catch (error) { console.error(error); } finally { setMockId(null); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Mission <span className="text-indigo-600">Control</span></h1>
        <p className="text-slate-500 mt-1 font-medium italic">Conversion from interview to offer starts here.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <Trophy className="w-4 h-4 text-indigo-500" />
            Live Pipeline
          </h2>
          <div className="space-y-6">
            {interviewJobs.map(job => (
              <div key={job.id} className="hire-card p-8 group border-indigo-50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{job.role}</h3>
                    <p className="text-slate-500 font-bold text-xs">{job.company}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                    job.status === 'Offer' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  }`}>
                    {job.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleGenerateGuide(job)}
                    disabled={loadingId === job.id}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50"
                  >
                    {loadingId === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    Strategy
                  </button>
                  <button 
                    onClick={() => handleGenerateMock(job)}
                    disabled={mockId === job.id}
                    className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {mockId === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    Mock Sim
                  </button>
                </div>
                {job.status === 'Offer' && (
                  <button className="w-full mt-3 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                    <FileCheck className="w-3.5 h-3.5" />
                    Secure Offer
                  </button>
                )}
              </div>
            ))}
            {interviewJobs.length === 0 && (
              <div className="p-16 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <Sparkles className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold text-sm italic">No missions active in final stages.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <MessageSquareText className="w-4 h-4 text-cyan-500" />
            Strategic Workspace
          </h2>
          <div className="hire-card p-10 min-h-[600px] border-indigo-50/50 bg-white relative">
            {!activeContent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-40 opacity-40">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                  <Zap className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Protocol Dormant</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Initialize a strategy guide or mock simulation to populate the workspace.</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-2 mb-8 p-3 bg-indigo-50 rounded-xl w-fit">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Live Strategic Feed</span>
                </div>
                <div className="prose prose-slate prose-indigo max-w-none">
                  {activeContent.split('\n').map((line, i) => (
                    <p key={i} className="text-slate-600 text-sm leading-loose mb-4 font-medium">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersAndGuides;
