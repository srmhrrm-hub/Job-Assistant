import { AppLanguage } from "../types";

export const translations = {
  fr: {
    nav_profile: "Profils",
    nav_workspace: "Espace de Travail",
    nav_history: "Candidatures",
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
    ws_ats_score: "Score ATS",
    ws_ats_missing: "Mots-clés manquants",
    ws_reset_btn: "Nouvelle candidature",
    ws_reset_confirm: "Attention : Cela va effacer l'espace de travail actuel. Assurez-vous d'avoir sauvegardé si nécessaire. Continuer ?",
    ws_draft_loaded: "Brouillon restauré",
    
    // History (Kanban & Trash)
    hist_title: "Mes Candidatures",
    hist_empty: "Aucune candidature. Créez-en une dans l'Espace de Travail !",
    hist_restore: "Restaurer",
    hist_purge_confirm: "Supprimer DÉFINITIVEMENT ?",
    hist_trash_title: "Corbeille (7 jours avant suppression)",
    hist_view_trash: "Voir la Corbeille",
    hist_view_board: "Voir le Tableau",
    status_todo: "À faire",
    status_applied: "Envoyé",
    status_interview: "Entretien",
    status_offer: "Offre",
    status_rejected: "Refusé",
    move_next: "Avancer",
    move_prev: "Reculer",

    // Common
    btn_save: "Sauvegarder",
    btn_export: "Exporter PDF",
    btn_close: "Fermer",
    btn_print: "Imprimer / PDF",
  },
  en: {
    nav_profile: "Profiles",
    nav_workspace: "Workspace",
    nav_history: "Applications",
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
    ws_ats_score: "ATS Score",
    ws_ats_missing: "Missing Keywords",
    ws_reset_btn: "New Application",
    ws_reset_confirm: "Warning: This will clear the current workspace. Ensure you saved if needed. Continue?",
    ws_draft_loaded: "Draft restored",

    // History (Kanban & Trash)
    hist_title: "My Applications",
    hist_empty: "No applications yet. Create one in Workspace!",
    hist_restore: "Restore",
    hist_purge_confirm: "Delete PERMANENTLY?",
    hist_trash_title: "Trash (Deleted after 7 days)",
    hist_view_trash: "View Trash",
    hist_view_board: "View Board",
    status_todo: "To Do",
    status_applied: "Applied",
    status_interview: "Interview",
    status_offer: "Offer",
    status_rejected: "Rejected",
    move_next: "Move Next",
    move_prev: "Move Back",

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