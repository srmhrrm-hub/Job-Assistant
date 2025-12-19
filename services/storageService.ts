import { SavedApplication, Profile, ApplicationStatus, GeneratedContent, ChatMessage } from "../types";

const APP_KEY = 'cv_ai_apps_v2';
const PROFILES_KEY = 'cv_ai_profiles_v2';
const ACTIVE_PROFILE_KEY = 'cv_ai_active_profile_id';
const WORKSPACE_DRAFT_KEY = 'cv_ai_workspace_draft_v2';

// --- DRAFT (WORKSPACE PERSISTENCE) ---

interface WorkspaceDraft {
    jobDesc: string;
    chatHistory: ChatMessage[];
    generatedData: GeneratedContent | null;
    lastUpdated: number;
}

export const saveWorkspaceDraft = (jobDesc: string, chatHistory: ChatMessage[], generatedData: GeneratedContent | null) => {
    const draft: WorkspaceDraft = {
        jobDesc,
        chatHistory,
        generatedData,
        lastUpdated: Date.now()
    };
    localStorage.setItem(WORKSPACE_DRAFT_KEY, JSON.stringify(draft));
};

export const getWorkspaceDraft = (): WorkspaceDraft | null => {
    try {
        const stored = localStorage.getItem(WORKSPACE_DRAFT_KEY);
        if (!stored) return null;
        return JSON.parse(stored);
    } catch (e) {
        return null;
    }
};

export const clearWorkspaceDraft = () => {
    localStorage.removeItem(WORKSPACE_DRAFT_KEY);
};

// --- APPLICATIONS ---

export const saveApplication = (app: Omit<SavedApplication, 'id' | 'createdAt' | 'status'> & { status?: ApplicationStatus }): SavedApplication => {
  const applications = getApplications();
  const newApp: SavedApplication = {
    ...app,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    status: app.status || 'todo'
  };
  
  const updatedList = [newApp, ...applications];
  localStorage.setItem(APP_KEY, JSON.stringify(updatedList));
  return newApp;
};

export const getApplications = (): SavedApplication[] => {
  try {
    const stored = localStorage.getItem(APP_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((app: any) => ({
        ...app,
        status: app.status || 'todo'
    }));
  } catch (e) {
    console.error("Failed to parse applications", e);
    return [];
  }
};

// Suppression Douce (Move to Trash)
export const softDeleteApplication = (id: string): SavedApplication[] => {
    const applications = getApplications();
    const updated = applications.map(app => 
        app.id === id 
            ? { ...app, status: 'trash' as ApplicationStatus, deletedAt: Date.now() } 
            : app
    );
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
};

// Restauration
export const restoreApplication = (id: string): SavedApplication[] => {
    const applications = getApplications();
    const updated = applications.map(app => 
        app.id === id 
            ? { ...app, status: 'todo' as ApplicationStatus, deletedAt: undefined } 
            : app
    );
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
};

// Suppression Définitive
export const permanentlyDeleteApplication = (id: string): SavedApplication[] => {
  const applications = getApplications();
  const updated = applications.filter(app => app.id !== id);
  localStorage.setItem(APP_KEY, JSON.stringify(updated));
  return updated;
};

// Nettoyage Automatique (7 jours)
export const cleanupTrash = (): SavedApplication[] => {
    const applications = getApplications();
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const updated = applications.filter(app => {
        // Keep if status is NOT trash OR (status IS trash AND it's less than 1 week old)
        if (app.status !== 'trash') return true;
        if (!app.deletedAt) return true; // Safety check
        return (now - app.deletedAt) < ONE_WEEK_MS;
    });

    // Only update if changes occurred
    if (updated.length !== applications.length) {
        console.log(`Cleaned up ${applications.length - updated.length} old applications.`);
        localStorage.setItem(APP_KEY, JSON.stringify(updated));
    }
    return updated;
};

export const updateApplicationStatus = (id: string, newStatus: ApplicationStatus): SavedApplication[] => {
    const applications = getApplications();
    const updated = applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
    );
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
};

// --- PROFILES MANAGEMENT ---

export const getProfiles = (): Profile[] => {
  try {
    const stored = localStorage.getItem(PROFILES_KEY);
    if (!stored) {
      const defaultProfile: Profile = {
        id: 'default',
        name: 'Profil Principal',
        cv: '',
        letter: ''
      };
      saveProfiles([defaultProfile]);
      return [defaultProfile];
    }
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const saveProfiles = (profiles: Profile[]) => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

export const createProfile = (name: string): Profile => {
  const profiles = getProfiles();
  const newProfile: Profile = {
    id: crypto.randomUUID(),
    name: name,
    cv: '',
    letter: ''
  };
  saveProfiles([...profiles, newProfile]);
  return newProfile;
};

export const updateProfile = (updatedProfile: Profile) => {
  const profiles = getProfiles();
  const newProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
  saveProfiles(newProfiles);
};

export const deleteProfile = (id: string): Profile[] => {
  const profiles = getProfiles();
  if (profiles.length <= 1) return profiles;
  
  const newProfiles = profiles.filter(p => p.id !== id);
  saveProfiles(newProfiles);
  return newProfiles;
};

// --- ACTIVE STATE ---

export const getActiveProfileId = (): string => {
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'default';
};

export const setActiveProfileId = (id: string) => {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
};