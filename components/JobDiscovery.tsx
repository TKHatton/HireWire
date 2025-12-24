
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Telescope, Sparkles, Loader2, Target, ArrowUpRight } from 'lucide-react';
import { discoverRelatedJobs } from '../services/gemini';

const JobDiscovery: React.FC = () => {
  const { jobs, resume } = useJobs();
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);

  const handleDiscover = async () => {
    setIsDiscovering(true);
    try {
      const jobContext = jobs.map(j => `${j.role} at ${j.company}`).join(', ');
      const res = await discoverRelatedJobs(jobContext, resume.skills);
      setRecommendations(res);
    } catch (error) {
      setRecommendations('Discovery failed. Please check your API key and try again.');
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Target <span className="text-indigo-600">Discovery</span></h1>
          <p className="text-slate-500 mt-1 font-medium">AI-orchestrated search for high-probability opportunities.</p>
        </div>
        <button 
          onClick={handleDiscover}
          disabled={isDiscovering}
          className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-indigo-100 font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isDiscovering ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Run Discovery Engine
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="hire-card p-10 min-h-[500px] border-indigo-50">
            {!recommendations ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-32">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  <Telescope className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Analysis Required</h3>
                <p className="text-slate-400 text-sm max-w-sm mt-2 font-medium">Click above to analyze your current pipeline and generate a new set of strategic targets.</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700 prose prose-slate max-w-none">
                {recommendations.split('\n').map((line, i) => (
                  <p key={i} className="text-slate-600 text-sm leading-relaxed mb-4 font-medium">{line}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Target className="w-24 h-24" />
            </div>
            <h4 className="text-xl font-black mb-4">Discovery Logic</h4>
            <ul className="space-y-4 text-sm font-medium opacity-80">
              <li className="flex gap-3">
                <ArrowUpRight className="w-5 h-5 text-cyan-300 shrink-0" />
                Cross-references skills with current market volatility.
              </li>
              <li className="flex gap-3">
                <ArrowUpRight className="w-5 h-5 text-cyan-300 shrink-0" />
                Identifies roles adjacent to your success history.
              </li>
              <li className="flex gap-3">
                <ArrowUpRight className="w-5 h-5 text-cyan-300 shrink-0" />
                Predicts cultural match based on company mission data.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDiscovery;
