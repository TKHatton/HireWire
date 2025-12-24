
import React, { useState, useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import { X, Sparkles, Loader2, Globe, Send, Zap } from 'lucide-react';
import { generateCoverLetter, analyzeSkillGap } from '../services/gemini';

const JobModal: React.FC<{ isOpen: boolean; onClose: () => void; job?: any }> = ({ isOpen, onClose, job }) => {
  const { addJob, updateJob, resume, socialProfiles } = useJobs();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    salary: '',
    location: '',
    dateApplied: new Date().toISOString().split('T')[0],
    description: '',
    coverLetter: '',
    skillGapAnalysis: '',
    origin: 'application' as 'application' | 'offer'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (job) setFormData({ ...job });
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (job) {
      updateJob({ ...formData, id: job.id } as any);
    } else {
      addJob({ ...formData, id: Math.random().toString(36).substr(2, 9) } as any);
    }
    onClose();
  };

  const handleGenerateCoverLetter = async () => {
    if (!formData.role || !formData.company) return alert("Role and Company are required.");
    setIsGenerating(true);
    try {
      const socialContext = socialProfiles.map(p => `${p.platform}: ${p.url}`).join(', ');
      const letter = await generateCoverLetter(formData.role, formData.company, resume.skills, socialContext);
      setFormData(prev => ({ ...prev, coverLetter: letter }));
    } catch (error) {
      setFormData(prev => ({ ...prev, coverLetter: 'Failed to generate cover letter. Please check your API key and try again.' }));
    }
    finally { setIsGenerating(false); }
  };

  const handleAnalyzeGap = async () => {
    if (!formData.description) return alert("Please provide a job description for analysis.");
    setIsAnalyzing(true);
    try {
      const gap = await analyzeSkillGap(formData.description, resume.skills);
      setFormData(prev => ({ ...prev, skillGapAnalysis: gap }));
    } catch (error) {
      setFormData(prev => ({ ...prev, skillGapAnalysis: 'Analysis failed. Please check your API key and try again.' }));
    }
    finally { setIsAnalyzing(false); }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] border border-slate-200 overflow-hidden">
        <header className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Application <span className="text-indigo-600">Entry</span></h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Configure deployment parameters</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex bg-slate-50 p-1.5 rounded-xl w-fit border border-slate-100">
            <button 
              type="button"
              onClick={() => setFormData({...formData, origin: 'application'})}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.origin === 'application' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              <Send className="w-3 h-3" />
              Application
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, origin: 'offer'})}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.origin === 'offer' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              <Globe className="w-3 h-3" />
              Direct Offer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Organization</label>
              <input required type="text" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-sm" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Position Role</label>
              <input required type="text" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-sm" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Job Specification</label>
            <textarea className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all min-h-[100px] text-sm font-medium leading-relaxed" placeholder="Paste the full job description here..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  AI Cover Letter
                </h3>
                <button type="button" onClick={handleGenerateCoverLetter} disabled={isGenerating} className="text-[9px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'AUTO-GENERATE'}
                </button>
              </div>
              <textarea className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 focus:ring-4 focus:ring-indigo-50 transition-all min-h-[220px] text-xs font-medium leading-relaxed shadow-inner" value={formData.coverLetter} onChange={e => setFormData({...formData, coverLetter: e.target.value})} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3 text-cyan-500" />
                  Edge Analysis
                </h3>
                <button type="button" onClick={handleAnalyzeGap} disabled={isAnalyzing} className="text-[9px] font-black text-cyan-600 hover:text-cyan-800 flex items-center gap-1">
                  {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : 'RUN AI PROBE'}
                </button>
              </div>
              <div className="w-full px-6 py-5 rounded-xl bg-slate-50 border border-indigo-100 text-slate-700 min-h-[220px] text-xs leading-relaxed overflow-y-auto max-h-[220px] prose prose-slate prose-sm font-medium">
                {formData.skillGapAnalysis || "No analysis available. Provide a job description to trigger the AI probe."}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-[10px]">Cancel</button>
            <button type="submit" className="flex-1 py-4 font-black text-white uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all text-[10px]">Commit Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
