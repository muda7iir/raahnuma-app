const PREFIX = 'nxraahnuma_';

export interface UserProfile {
  name: string;
  age: number;
  country: string;
  photo: string;
  educationLevel: string;
  institution: string;
  gpa: string;
  interests: string[];
  workPreferences: string[];
  budget: string;
  dreamStatement: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  feedback?: 'up' | 'down';
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapData {
  id: string;
  career: string;
  educationLevel: string;
  hoursPerWeek: number;
  startingPoint: string;
  milestones: RoadmapMilestone[];
  salaryProgression: { year: number; salary: number }[];
  createdAt: string;
}

export interface RoadmapMilestone {
  month: string;
  title: string;
  tasks: { text: string; completed: boolean }[];
  resources: string[];
  skills: string[];
}

export interface AssessmentResult {
  id: string;
  scores: Record<string, number>;
  personalityType: string;
  careerMatches: { name: string; matchPercent: number; salary: string; demand: string }[];
  completedAt: string;
}

export interface SavedScholarship {
  id: string;
  name: string;
  country: string;
  university: string;
  amount: string;
  deadline: string;
  eligibility: string;
  coverage: string;
  link: string;
  savedAt: string;
}

export interface ResumeData {
  id: string;
  personalInfo: {
    name: string; email: string; phone: string; linkedin: string; location: string; photo: string;
  };
  summary: string;
  experience: { company: string; role: string; startDate: string; endDate: string; description: string }[];
  education: { institution: string; degree: string; startDate: string; endDate: string; gpa: string }[];
  skills: string[];
  projects: { name: string; description: string; techStack: string; link: string }[];
  certifications: { name: string; issuer: string; date: string; credentialId: string }[];
  languages: { name: string; proficiency: string }[];
  template: 'modern' | 'classic' | 'creative';
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  voiceId: string;
  voiceSpeed: number;
  voicePitch: number;
  autoPlayVoice: boolean;
}

export interface BookedSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorPhoto: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  meetLink: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Storage helpers
export function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write failed:', e);
  }
}

export function storageRemove(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export function storageClear(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}

// Typed accessors
export const getProfile = () => storageGet<UserProfile>('profile');
export const setProfile = (p: UserProfile) => storageSet('profile', p);

export const getChats = () => storageGet<ChatConversation[]>('chats') || [];
export const setChats = (c: ChatConversation[]) => storageSet('chats', c);

export const getRoadmaps = () => storageGet<RoadmapData[]>('roadmaps') || [];
export const setRoadmaps = (r: RoadmapData[]) => storageSet('roadmaps', r);

export const getAssessments = () => storageGet<AssessmentResult[]>('assessments') || [];
export const setAssessments = (a: AssessmentResult[]) => storageSet('assessments', a);

export const getScholarships = () => storageGet<SavedScholarship[]>('scholarships') || [];
export const setScholarships = (s: SavedScholarship[]) => storageSet('scholarships', s);

export const getResumes = () => storageGet<ResumeData[]>('resumes') || [];
export const setResumes = (r: ResumeData[]) => storageSet('resumes', r);

export const getSettings = (): AppSettings => storageGet<AppSettings>('settings') || {
  theme: 'light', fontSize: 'medium', voiceId: '', voiceSpeed: 1, voicePitch: 1, autoPlayVoice: false,
};
export const setSettings = (s: AppSettings) => storageSet('settings', s);

export const getBookings = () => storageGet<BookedSession[]>('bookings') || [];
export const setBookings = (b: BookedSession[]) => storageSet('bookings', b);

export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => {
    try { data[k.replace(PREFIX, '')] = JSON.parse(localStorage.getItem(k)!); } catch { data[k.replace(PREFIX, '')] = localStorage.getItem(k); }
  });
  return JSON.stringify(data, null, 2);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
