
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Bot, LayoutGrid, HeartPulse } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { chatWithHillary } from '../services/gemini';

const HillaryChat: React.FC = () => {
  const { jobs, resume, hillaryContext } = useJobs();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Hey! I'm Hillary. I've been crunching your career stats. Want to see where we stand on conversion rates or prep for an upcoming talk?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customMsg?: string) => {
    const msgToSend = customMsg || input.trim();
    if (!msgToSend || isLoading) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msgToSend }]);
    setIsLoading(true);

    try {
      const contextStr = `
        User metrics: 
        - Apps: ${hillaryContext.totalApplications}
        - Interviews: ${hillaryContext.totalInterviews}
        - Offers: ${hillaryContext.totalOffers}
        - Rate: ${hillaryContext.conversionRate.toFixed(1)}%
        - Current Status: ${hillaryContext.recentStatus.map(j => `${j.role} (${j.status})`).join(', ')}
        - Skills: ${resume.skills}
      `;
      const response = await chatWithHillary(msgToSend, contextStr);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "System overload! Let's try that again in a sec." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    "Analyze my stats",
    "How's my conversion rate?",
    "Need interview tips",
    "Encourage me!"
  ];

  return (
    <div className="fixed bottom-10 right-10 z-[300]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all relative group"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full border-4 border-white" />
          <Bot className="w-10 h-10" />
          <div className="absolute right-24 bg-white px-6 py-3 rounded-2xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Hillary AI is active</p>
          </div>
        </button>
      ) : (
        <div className="w-[440px] h-[680px] bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          <header className="p-8 bg-slate-900 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
              <HeartPulse className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tighter">Hillary</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Strategic Mentor</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors relative z-10">
              <X className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] px-6 py-4 rounded-[2rem] text-[13px] leading-relaxed font-bold shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-6 py-4 rounded-[2rem] rounded-tl-none flex items-center gap-3 shadow-sm">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <footer className="p-8 bg-white border-t border-slate-100 space-y-4">
            {!isLoading && messages.length < 5 && (
              <div className="flex flex-wrap gap-2">
                {quickReplies.map(reply => (
                  <button 
                    key={reply} 
                    onClick={() => handleSend(reply)}
                    className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-500 hover:text-indigo-600 transition-all uppercase tracking-widest"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Talk to Hillary..." 
                className="w-full pl-6 pr-16 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading}
                className="absolute right-2 p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default HillaryChat;
