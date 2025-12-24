
export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
export type RegionalFormat = 'US-Resume' | 'EU-CV' | 'UK-CV' | 'AU-Resume';

export interface SocialProfile {
  platform: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'email';
  handle: string;
  url: string;
}

export interface HillaryContext {
  conversionRate: number; // Interviews / Applications
  totalApplications: number;
  totalInterviews: number;
  totalOffers: number;
  recentStatus: Job[];
  lastAdviceGiven?: string;
  lastUpdate: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  lastContact: string;
  notes: string;
}

export interface Reminder {
  id: string;
  jobId: string;
  type: 'Follow-up' | 'Interview' | 'Deadline';
  date: string;
  completed: boolean;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  salary: string;
  location: string;
  dateApplied: string;
  description: string;
  coverLetter: string;
  interviewGuide: string;
  skillGapAnalysis: string;
  origin: 'application' | 'offer';
  rejectionReason?: string;
  interviewDate?: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
}

export interface Resume {
  fullName: string;
  summary: string;
  experience: Section[];
  education: Section[];
  projects: Project[];
  skills: string;
  avatar: string;
  regionalFormat: RegionalFormat;
}

export type ViewType = 'dashboard' | 'jobs' | 'offers' | 'resume' | 'networking' | 'discovery' | 'settings';
