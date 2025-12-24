
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, Resume, ViewType, Contact, Reminder, SocialProfile, HillaryContext } from '../types';

interface JobContextType {
  jobs: Job[];
  resume: Resume;
  contacts: Contact[];
  reminders: Reminder[];
  socialProfiles: SocialProfile[];
  activeView: ViewType;
  hillaryContext: HillaryContext;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  setResume: React.Dispatch<React.SetStateAction<Resume>>;
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setSocialProfiles: React.Dispatch<React.SetStateAction<SocialProfile[]>>;
  setActiveView: (view: ViewType) => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  addContact: (contact: Contact) => void;
  addReminder: (reminder: Reminder) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const defaultResume: Resume = {
  fullName: 'Alex Venture',
  summary: 'Strategic technology leader with 8+ years experience in distributed systems and AI integration.',
  experience: [],
  education: [],
  projects: [],
  skills: 'React, TypeScript, Node.js, AWS, Kubernetes, LLM Orchestration',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  regionalFormat: 'US-Resume'
};

const defaultSocials: SocialProfile[] = [
  { platform: 'email', handle: 'alex@venture.com', url: 'mailto:alex@venture.com' },
  { platform: 'linkedin', handle: 'alex-venture', url: 'https://linkedin.com/in/alex-venture' }
];

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('hirewire_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('hirewire_contacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('hirewire_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>(() => {
    const saved = localStorage.getItem('hirewire_socials');
    return saved ? JSON.parse(saved) : defaultSocials;
  });

  const [resume, setResume] = useState<Resume>(() => {
    const saved = localStorage.getItem('hirewire_resume');
    return saved ? { ...defaultResume, ...JSON.parse(saved) } : defaultResume;
  });

  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  useEffect(() => localStorage.setItem('hirewire_jobs', JSON.stringify(jobs)), [jobs]);
  useEffect(() => localStorage.setItem('hirewire_contacts', JSON.stringify(contacts)), [contacts]);
  useEffect(() => localStorage.setItem('hirewire_reminders', JSON.stringify(reminders)), [reminders]);
  useEffect(() => localStorage.setItem('hirewire_resume', JSON.stringify(resume)), [resume]);
  useEffect(() => localStorage.setItem('hirewire_socials', JSON.stringify(socialProfiles)), [socialProfiles]);

  const addJob = (job: Job) => setJobs(prev => [...prev, job]);
  const updateJob = (updatedJob: Job) => setJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job));
  const deleteJob = (id: string) => setJobs(prev => prev.filter(job => job.id !== id));
  
  const addContact = (contact: Contact) => setContacts(prev => [...prev, contact]);
  const addReminder = (reminder: Reminder) => setReminders(prev => [...prev, reminder]);

  const hillaryContext: HillaryContext = {
    totalApplications: jobs.length,
    totalInterviews: jobs.filter(j => ['Interview', 'Offer', 'Accepted'].includes(j.status)).length,
    totalOffers: jobs.filter(j => ['Offer', 'Accepted'].includes(j.status)).length,
    conversionRate: jobs.length > 0 ? (jobs.filter(j => ['Interview', 'Offer', 'Accepted'].includes(j.status)).length / jobs.length) * 100 : 0,
    recentStatus: jobs.slice(-5),
    lastUpdate: new Date().toISOString()
  };

  return (
    <JobContext.Provider value={{
      jobs, resume, contacts, reminders, socialProfiles, activeView, hillaryContext,
      setJobs, setResume, setContacts, setReminders, setSocialProfiles, setActiveView,
      addJob, updateJob, deleteJob, addContact, addReminder
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error('useJobs must be used within a JobProvider');
  return context;
};
