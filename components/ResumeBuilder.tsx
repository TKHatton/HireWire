
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Sparkles, Plus, Trash2, Save, Download, Loader2, Camera, Globe, Briefcase, Tag, ChevronDown, Rocket } from 'lucide-react';
import { generateResumeSummary, generateAvatar, reformatResume } from '../services/gemini';
import { RegionalFormat } from '../types';
import SocialHub from './SocialHub';

const ResumeBuilder: React.FC = () => {
  const { resume, setResume } = useJobs();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);
  const [isReformatting, setIsReformatting] = useState(false);

  const formats: RegionalFormat[] = ['US-Resume', 'EU-CV', 'UK-CV', 'AU-Resume'];

  const handleFormatChange = async (format: RegionalFormat) => {
    setResume(prev => ({ ...prev, regionalFormat: format }));
    setIsReformatting(true);
    try {
      const data = `${resume.summary}. ${resume.experience.map(e => e.title + ': ' + e.content).join('. ')}`;
      const newSummary = await reformatResume(data, format);
      setResume(prev => ({ ...prev, summary: newSummary }));
    } catch (e) {
      // Format change failed, keep existing summary
    } finally {
      setIsReformatting(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const experienceStr = resume.experience.map(e => `${e.title}: ${e.content}`).join(', ');
      const combined = `${experienceStr}. ${resume.projects.map(p => p.name).join(', ')}`;
      const summary = await generateResumeSummary(resume.skills, combined);
      setResume({ ...resume, summary });
    } catch (error) {
      // Summary generation failed, keep existing summary
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAvatar = async () => {
    setIsAvatarGenerating(true);
    try {
      const url = await generateAvatar(resume.skills);
      if (url) setResume({ ...resume, avatar: url });
    } catch (error) {
      // Avatar generation failed, keep existing avatar
    } finally {
      setIsAvatarGenerating(false);
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Identity <span className="text-indigo-600">Protocol</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Engineered for global technical leadership.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select 
              value={resume.regionalFormat} 
              onChange={(e) => handleFormatChange(e.target.value as RegionalFormat)}
              className="appearance-none bg-white border border-slate-200 text-slate-600 px-10 py-3 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs cursor-pointer focus:ring-4 focus:ring-indigo-50"
            >
              {formats.map(f => <option key={f} value={f}>{f.replace('-', ' ')}</option>)}
            </select>
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            {isReformatting && <Loader2 className="absolute -right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 animate-spin" />}
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold text-xs uppercase tracking-widest">
            <Save className="w-4 h-4" />
            Commit
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="hire-card p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
            <div className="relative w-40 h-40 mx-auto mb-8 group cursor-pointer" onClick={handleGenerateAvatar}>
              <img src={resume.avatar} alt="Avatar" className="w-full h-full rounded-[2.5rem] object-cover ring-8 ring-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-indigo-600/20 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                {isAvatarGenerating ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Camera className="w-8 h-8 text-white shadow-lg" />}
              </div>
            </div>
            <input type="text" className="w-full text-2xl font-black text-slate-900 text-center bg-transparent border-none focus:ring-0 mb-1 tracking-tight outline-none" value={resume.fullName} onChange={e => setResume({...resume, fullName: e.target.value})} />
            <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">System Verified Identity</p>
            <button onClick={handleGenerateAvatar} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              Sync AI Portrait
            </button>
          </div>

          <SocialHub />

          <div className="hire-card p-8">
            <h3 className="text-xs font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Tag className="w-4 h-4 text-indigo-500" />
              Core Competencies
            </h3>
            <textarea className="w-full p-5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-xs font-bold min-h-[180px] leading-loose text-slate-600 outline-none" value={resume.skills} onChange={e => setResume({...resume, skills: e.target.value})} />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <section className="hire-card p-8 border-indigo-50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Executive Intelligence</h3>
              <button onClick={handleGenerateSummary} disabled={isGenerating} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2.5 rounded-lg hover:bg-indigo-100 transition-all uppercase tracking-widest">
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Refactor
              </button>
            </div>
            <textarea className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium min-h-[140px] leading-relaxed text-slate-600 outline-none" value={resume.summary} onChange={e => setResume({...resume, summary: e.target.value})} />
          </section>

          <section className="hire-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                Experience History
              </h3>
              <button onClick={() => setResume({...resume, experience: [...resume.experience, { id: Math.random().toString(36).substr(2, 9), title: '', content: '', date: '' }]})} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-6">
              {resume.experience.map((exp, idx) => (
                <div key={exp.id} className="relative group p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Title & Company" className="px-5 py-3.5 bg-white rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-indigo-500" value={exp.title} onChange={e => {
                      const newArr = [...resume.experience]; newArr[idx].title = e.target.value; setResume({...resume, experience: newArr});
                    }} />
                    <input type="text" placeholder="Timeline" className="px-5 py-3.5 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500" value={exp.date} onChange={e => {
                      const newArr = [...resume.experience]; newArr[idx].date = e.target.value; setResume({...resume, experience: newArr});
                    }} />
                  </div>
                  <textarea placeholder="Achievements & impact..." className="w-full p-5 bg-white rounded-xl border border-slate-200 text-sm font-medium min-h-[100px] leading-relaxed focus:ring-2 focus:ring-indigo-500" value={exp.content} onChange={e => {
                    const newArr = [...resume.experience]; newArr[idx].content = e.target.value; setResume({...resume, experience: newArr});
                  }} />
                  <button onClick={() => setResume({...resume, experience: resume.experience.filter(item => item.id !== exp.id)})} className="absolute -right-2 -top-2 p-2 bg-white border border-slate-200 text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
