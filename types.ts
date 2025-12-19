export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface CVData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  languages: string[];
}

export interface AnalysisData {
  companyName: string;
  jobTitle: string;
}

// Nouveau: Analyse ATS
export interface AtsAnalysis {
  score: number;
  missingKeywords: string[];
  feedback: string;
}

export type DesignLayout = 'modern' | 'classic' | 'minimal';
export type DesignColor = 'blue' | 'emerald' | 'slate' | 'rose' | 'amber';
export type DesignFont = 'sans' | 'serif' | 'mono';

export interface DesignSettings {
  layout: DesignLayout;
  color: DesignColor;
  font: DesignFont;
  rationale?: string;
}

export interface GeneratedContent {
  analysis: AnalysisData;
  ats: AtsAnalysis;
  design: DesignSettings;
  cv: CVData;
  coverLetter: string;
}

export interface Profile {
  id: string;
  name: string;
  cv: string;
  letter: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

// Ajout du statut 'trash'
export type ApplicationStatus = 'todo' | 'applied' | 'interview' | 'offer' | 'rejected' | 'trash';

export interface SavedApplication {
  id: string;
  createdAt: number;
  profileUsedId: string;
  jobDescription: string;
  chatHistory: ChatMessage[];
  generatedContent: GeneratedContent;
  status: ApplicationStatus;
  deletedAt?: number; // Nouveau: Date de mise à la corbeille
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type TabView = 'PROFILE' | 'WORKSPACE' | 'HISTORY';

export type AppLanguage = 'fr' | 'en';