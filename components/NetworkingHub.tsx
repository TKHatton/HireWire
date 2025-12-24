
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Users, Plus, Mail, Building, Briefcase, Calendar, Search, Trash2 } from 'lucide-react';

const NetworkingHub: React.FC = () => {
  const { contacts, setContacts, addContact } = useJobs();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', company: '', role: '', email: '', notes: '' });

  const handleAdd = () => {
    if (!newContact.name) return;
    addContact({ ...newContact, id: Math.random().toString(36).substr(2, 9), lastContact: new Date().toISOString().split('T')[0] });
    setNewContact({ name: '', company: '', role: '', email: '', notes: '' });
    setIsAdding(false);
  };

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My <span className="text-indigo-600">Contacts</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your professional network and track your connections.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2.5 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-100 font-bold">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </header>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search network..." 
            className="w-full pl-12 pr-6 py-3 bg-slate-50 rounded-xl text-sm font-medium border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(contact => (
          <div key={contact.id} className="hire-card p-7 group relative">
            <button 
              onClick={() => setContacts(prev => prev.filter(c => c.id !== contact.id))}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black text-lg mb-6">
              {contact.name[0]}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">{contact.name}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <Building className="w-3.5 h-3.5 text-slate-300" />
                {contact.company}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <Briefcase className="w-3.5 h-3.5 text-slate-300" />
                {contact.role}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <Mail className="w-3.5 h-3.5 text-slate-300" />
                {contact.email}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Strategy Notes</p>
              <p className="text-xs text-slate-600 leading-relaxed italic">{contact.notes || 'No notes added yet.'}</p>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-black mb-6">New Network Node</h2>
            <div className="space-y-4 mb-8">
              <input placeholder="Full Name" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-slate-200 focus:ring-4 focus:ring-indigo-100" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Organization" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-slate-200" value={newContact.company} onChange={e => setNewContact({...newContact, company: e.target.value})} />
                <input placeholder="Position" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-slate-200" value={newContact.role} onChange={e => setNewContact({...newContact, role: e.target.value})} />
              </div>
              <input placeholder="Email Address" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-slate-200" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
              <textarea placeholder="Strategy notes..." className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-slate-200 min-h-[100px]" value={newContact.notes} onChange={e => setNewContact({...newContact, notes: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest">Abort</button>
              <button onClick={handleAdd} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Commit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkingHub;
