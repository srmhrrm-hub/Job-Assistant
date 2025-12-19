import { AppLanguage } from "../types";

export const translations = {
  fr: {
    nav_profile: "Profils",
    nav_workspace: "Espace de Travail",
    nav_history: "Historique",
    app_title: "Assistant Emploi",
    
    // Profile
    profile_title: "Mes Profils",
    profile_new: "Nouveau Profil",
    profile_delete_confirm: "Êtes-vous sûr de vouloir supprimer le profil",
    profile_source_cv: "CV de Base (Texte/JSON)",
    profile_source_cv_placeholder: "Copiez ici tout le contenu textuel de votre CV. L'IA piochera dedans.",
    profile_source_letter: "Lettre Type (Optionnel)",
    profile_source_letter_placeholder: "Une lettre générique pour le style...",
    profile_save_auto: "Sauvegarde automatique",
    profile_delete_btn: "Supprimer ce profil",

    // Workspace
    ws_active_profile: "Profil actif",
    ws_job_locked: "Offre d'emploi (Verrouillée)",
    ws_job_placeholder: "1. Collez l'annonce ici...",
    ws_job_input_placeholder: "Texte de l'annonce...",
    ws_chat_start_1: "Commencez par coller l'annonce ci-dessus.",
    ws_chat_start_2: "Ensuite, dites-moi ce que vous voulez faire.",
    ws_chat_placeholder_empty: "Collez d'abord l'annonce...",
    ws_chat_placeholder_active: "Message à l'IA...",
    ws_empty_title: "Prêt à travailler",
    ws_empty_desc: "Collez l'offre d'emploi à gauche et dites à l'IA :",
    ws_empty_action: "Fais-moi un CV pour ce poste",
    
    // History
    hist_title: "Mes Candidatures",
    hist_empty: "Historique vide.",
    hist_delete_confirm: "Supprimer définitivement cette candidature ?",
    hist_date_format: 'fr-FR',

    // Common
    btn_save: "Sauvegarder",
    btn_export: "Exporter PDF",
    btn_close: "Fermer",
    btn_print: "Imprimer / PDF",
  },
  en: {
    nav_profile: "Profiles",
    nav_workspace: "Workspace",
    nav_history: "History",
    app_title: "Career Assistant",
    
    // Profile
    profile_title: "My Profiles",
    profile_new: "New Profile",
    profile_delete_confirm: "Are you sure you want to delete profile",
    profile_source_cv: "Master CV (Text/JSON)",
    profile_source_cv_placeholder: "Paste your full CV content here. AI will use it as source.",
    profile_source_letter: "Master Letter (Optional)",
    profile_source_letter_placeholder: "A generic cover letter for tone and style...",
    profile_save_auto: "Auto-saved",
    profile_delete_btn: "Delete this profile",

    // Workspace
    ws_active_profile: "Active Profile",
    ws_job_locked: "Job Description (Locked)",
    ws_job_placeholder: "1. Paste job description here...",
    ws_job_input_placeholder: "Job description text...",
    ws_chat_start_1: "Start by pasting the job description above.",
    ws_chat_start_2: "Then, tell me what you want to do.",
    ws_chat_placeholder_empty: "Paste job ad first...",
    ws_chat_placeholder_active: "Message the AI...",
    ws_empty_title: "Ready to work",
    ws_empty_desc: "Paste the job description on the left and tell the AI:",
    ws_empty_action: "Make a CV for this job",

    // History
    hist_title: "My Applications",
    hist_empty: "History is empty.",
    hist_delete_confirm: "Permanently delete this application?",
    hist_date_format: 'en-US',

    // Common
    btn_save: "Save",
    btn_export: "Export PDF",
    btn_close: "Close",
    btn_print: "Print / PDF",
  }
};

export const t = (lang: AppLanguage, key: keyof typeof translations['fr']) => {
  return translations[lang][key] || translations['fr'][key];
};