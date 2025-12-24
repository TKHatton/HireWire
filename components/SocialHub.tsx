
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Mail, Linkedin, Github, Twitter, Globe, Copy, Check, ExternalLink, Settings2 } from 'lucide-react';

const SocialHub: React.FC = () => {
  const { socialProfiles, setSocialProfiles } = useJobs();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = (format: 'markdown' | 'text') => {
    const list = socialProfiles.map(p => {
      if (format === 'markdown') return `- [${p.platform}](${p.url})`;
      return `${p.platform.toUpperCase()}: ${p.url}`;
    }).join('\n');
    navigator.clipboard.writeText(list);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  const icons = {
    email: Mail,
    linkedin: Linkedin,
    github: Github,
    twitter: Twitter,
    portfolio: Globe
  };

  return (
    <div className="hire-card p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Social Profiles</h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Connect your digital assets</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-100"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {socialProfiles.map((p, idx) => {
          const Icon = icons[p.platform] || Globe;
          return (
            <div key={p.platform} className="group relative flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-4 flex-1 mr-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                {isEditing ? (
                  <input 
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium"
                    value={p.url}
                    onChange={e => {
                      const newSocials = [...socialProfiles];
                      newSocials[idx].url = e.target.value;
                      setSocialProfiles(newSocials);
                    }}
                  />
                ) : (
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.platform}</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{p.handle || p.url.split('/').pop()}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleCopy(p.url, p.platform)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                  {copied === p.platform ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-slate-100">
        <button onClick={() => copyAll('markdown')} className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
          <Copy className="w-3 h-3" />
          MD List
        </button>
        <button onClick={() => copyAll('text')} className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
          <Copy className="w-3 h-3" />
          Text List
        </button>
      </div>
      {copied === 'all' && <div className="text-center mt-3 text-[9px] font-black text-emerald-500 uppercase animate-pulse">Copied Master List!</div>}
    </div>
  );
};

export default SocialHub;
