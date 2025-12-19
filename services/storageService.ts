import { SavedApplication, Profile } from "../types";

const APP_KEY = 'cv_ai_apps_v2';
const PROFILES_KEY = 'cv_ai_profiles_v2';
const ACTIVE_PROFILE_KEY = 'cv_ai_active_profile_id';

// --- APPLICATIONS ---

export const saveApplication = (app: Omit<SavedApplication, 'id' | 'createdAt'>): SavedApplication => {
  const applications = getApplications();
  const newApp: SavedApplication = {
    ...app,
    id: crypto.randomUUID(),
    createdAt: Date.now()
  };
  
  const updatedList = [newApp, ...applications];
  localStorage.setItem(APP_KEY, JSON.stringify(updatedList));
  return newApp;
};

export const getApplications = (): SavedApplication[] => {
  try {
    const stored = localStorage.getItem(APP_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse applications", e);
    return [];
  }
};

export const deleteApplication = (id: string): SavedApplication[] => {
  const applications = getApplications();
  const updated = applications.filter(app => app.id !== id);
  localStorage.setItem(APP_KEY, JSON.stringify(updated));
  return updated;
};

// --- PROFILES MANAGEMENT ---

export const getProfiles = (): Profile[] => {
  try {
    const stored = localStorage.getItem(PROFILES_KEY);
    if (!stored) {
      // Créer un profil par défaut si aucun n'existe
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
  // Empêcher de supprimer le dernier profil
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