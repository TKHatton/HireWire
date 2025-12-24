
import React from 'react';
import { useJobs } from '../context/JobContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, Target, Clock, Zap, Sparkles, Activity, Plus, TrendingUp, Bot, ArrowRight } from 'lucide-react';
import QuickActions from './QuickActions';

const Dashboard: React.FC = () => {
  const { jobs, setActiveView, hillaryContext } = useJobs();

  const stats = [
    { label: 'Total Applications', value: hillaryContext.totalApplications, icon: Briefcase, color: 'indigo', trend: 'Active' },
    { label: 'Interviews', value: hillaryContext.totalInterviews, icon: Clock, color: 'cyan', trend: `${hillaryContext.conversionRate.toFixed(0)}% Rate` },
    { label: 'Offers', value: hillaryContext.totalOffers, icon: Target, color: 'emerald', trend: 'Received' },
    { label: 'Success Rate', value: `${hillaryContext.conversionRate.toFixed(0)}%`, icon: Zap, color: 'amber', trend: hillaryContext.conversionRate > 20 ? 'Great' : 'Growing' },
  ];

  // Generate chart data from actual job applications
  const generateChartData = () => {
    if (jobs.length === 0) return [];

    // Group jobs by week
    const weekMap = new Map<string, number>();
    const now = new Date();
    const fiveWeeksAgo = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);

    jobs.forEach(job => {
      const jobDate = new Date(job.dateApplied);
      if (jobDate >= fiveWeeksAgo) {
        const weeksDiff = Math.floor((now.getTime() - jobDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        const weekLabel = `Week ${5 - weeksDiff}`;
        weekMap.set(weekLabel, (weekMap.get(weekLabel) || 0) + 1);
      }
    });

    // Create array for last 5 weeks
    const chartData = [];
    for (let i = 1; i <= 5; i++) {
      chartData.push({
        name: `Week ${i}`,
        apps: weekMap.get(`Week ${i}`) || 0
      });
    }

    return chartData;
  };

  const chartData = generateChartData();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Job Search <span className="text-indigo-600">Dashboard</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Track your applications, interviews, and offers in one place.</p>
        </div>
        <button
          onClick={() => setActiveView('jobs')}
          className="flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-100 font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </header>

      {/* Quick Access Logic */}
      <QuickActions />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="hire-card p-7 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-widest">
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Application Activity Chart */}
        <div className="lg:col-span-8 hire-card p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Application Activity</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Weekly applications submitted</p>
            </div>
            {jobs.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-600 font-bold text-[10px] uppercase tracking-widest border border-indigo-100">
                <TrendingUp className="w-3 h-3" />
                TRACKING
              </div>
            )}
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="apps" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Bot className="w-24 h-24" />
            </div>
            <h4 className="text-xl font-black tracking-tight mb-2">AI Career Coach</h4>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-bold italic opacity-90">
              "Your conversion rate is {hillaryContext.conversionRate.toFixed(1)}%. {hillaryContext.conversionRate > 20 ? "You're ahead of the curve!" : "Let's work on tailoring those applications."}"
            </p>
            <button
              onClick={() => setActiveView('discovery')}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg"
            >
              Find More Jobs
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hire-card p-7">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Activity className="w-4 h-4 text-indigo-500" />
              Recent Applications
            </h3>
            <div className="space-y-5">
              {jobs.slice(-4).reverse().map((job, i) => (
                <div key={job.id} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-indigo-300 text-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shadow-sm">
                    {job.company[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-slate-900 text-xs truncate">{job.role}</p>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">{job.company}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                    job.status === 'Interview' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'
                  }`}>{job.status}</div>
                </div>
              ))}
              {jobs.length === 0 && (
                <p className="text-center py-6 text-slate-400 text-xs font-bold uppercase tracking-widest italic opacity-50">No applications yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
