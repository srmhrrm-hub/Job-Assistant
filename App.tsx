import React, { useState, useEffect } from 'react';
import { ProfileEditor } from './components/ProfileEditor';
import { ChatInterface } from './components/ChatInterface';
import { CVPreview } from './components/CVPreview';
import { LetterPreview } from './components/LetterPreview';
import { HistoryList } from './components/HistoryList';
import { ExportModal } from './components/ExportModal';
import { DesignToolbar } from './components/DesignToolbar'; // Import added
import { generateOrRefineContent } from './services/geminiService';
import { 
  saveApplication, getApplications, 
  softDeleteApplication, restoreApplication, permanentlyDeleteApplication, cleanupTrash,
  updateApplicationStatus,
  getProfiles, saveProfiles, createProfile, updateProfile, deleteProfile,
  getActiveProfileId, setActiveProfileId,
  saveWorkspaceDraft, getWorkspaceDraft, clearWorkspaceDraft 
} from './services/storageService';
import { AppState, GeneratedContent, SavedApplication, ChatMessage, TabView, Profile, AppLanguage, ApplicationStatus, DesignSettings } from './types';
import { t } from './utils/translations';

const App: React.FC = () => {
  // --- STATE ---
  
  // Settings
  const [lang, setLang] = useState<AppLanguage>('fr');

  // Navigation
  const [currentView, setCurrentView] = useState<TabView>('PROFILE');
  
  // Profiles Data
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileIdState] = useState<string>('');
  
  // Workspace Data (Current Job)
  const [jobDesc, setJobDesc] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [generatedData, setGeneratedData] = useState<GeneratedContent | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  
  // Saved Apps
  const [savedApps, setSavedApps] = useState<SavedApplication[]>([]);

  // UI State
  const [previewTab, setPreviewTab] = useState<'CV' | 'LETTER'>('CV');
  const [showExportModal, setShowExportModal] = useState(false);

  // --- EFFECTS ---

  useEffect(() => {
    // 1. Load Profiles
    const loadedProfiles = getProfiles();
    setProfiles(loadedProfiles);
    
    // 2. Set Active Profile
    const storedActiveId = getActiveProfileId();
    const initialActiveId = loadedProfiles.find(p => p.id === storedActiveId) ? storedActiveId : loadedProfiles[0].id;
    setActiveProfileIdState(initialActiveId);
    
    // 3. Load Apps & Cleanup Trash
    cleanupTrash(); // Auto-delete old trash items
    setSavedApps(getApplications());

    // 4. LOAD WORKSPACE DRAFT (Auto-restore)
    const draft = getWorkspaceDraft();
    if (draft) {
        setJobDesc(draft.jobDesc);
        setChatHistory(draft.chatHistory);
        setGeneratedData(draft.generatedData);
        if (draft.generatedData) setAppState(AppState.SUCCESS);
    }
    
    // 5. Default View Logic
    const activeProfile = loadedProfiles.find(p => p.id === initialActiveId);
    if (!activeProfile || !activeProfile.cv) {
        setCurrentView('PROFILE');
    } else {
        setCurrentView('WORKSPACE');
    }
  }, []);

  // AUTO-SAVE DRAFT
  useEffect(() => {
      // Save only if there is something substantial
      if (jobDesc || chatHistory.length > 0 || generatedData) {
          saveWorkspaceDraft(jobDesc, chatHistory, generatedData);
      }
  }, [jobDesc, chatHistory, generatedData]);

  // --- PROFILE ACTIONS ---

  const handleSelectProfile = (id: string) => {
    setActiveProfileIdState(id);
    setActiveProfileId(id);
  };

  const handleCreateProfile = (name: string) => {
    const newProfile = createProfile(name);
    setProfiles(getProfiles());
    handleSelectProfile(newProfile.id);
  };

  const handleUpdateProfile = (profile: Profile) => {
    updateProfile(profile);
    setProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
  };

  const handleDeleteProfile = (id: string) => {
    const newProfiles = deleteProfile(id);
    setProfiles(newProfiles);
    if (id === activeProfileId) {
        handleSelectProfile(newProfiles[0].id);
    }
  };

  // --- WORKSPACE ACTIONS ---

  const handleSendMessage = async () => {
    if (!jobDesc.trim()) return;

    const activeProfile = profiles.find(p => p.id === activeProfileId);
    if (!activeProfile) {
        alert("Erreur: Aucun profil actif trouvé.");
        return;
    }

    const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        text: chatInput,
        timestamp: Date.now()
    };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput("");
    setAppState(AppState.GENERATING);

    try {
        const result = await generateOrRefineContent(
            jobDesc, 
            generatedData, 
            userMsg.text, 
            activeProfile.cv, 
            activeProfile.letter,
            lang // Pass language to AI
        );

        setGeneratedData(result);

        const aiMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'ai',
            text: result.design.rationale || "Modifications effectuées.",
            timestamp: Date.now()
        };
        setChatHistory(prev => [...prev, aiMsg]);
        setAppState(AppState.SUCCESS);

    } catch (e) {
        console.error(e);
        setAppState(AppState.ERROR);
        const errorMsg: ChatMessage = { id: crypto.randomUUID(), role: 'ai', text: "Désolé, une erreur est survenue.", timestamp: Date.now() };
        setChatHistory(prev => [...prev, errorMsg]);
    }
  };

  // NEW: Handle Manual Design Changes
  const handleDesignChange = (newSettings: DesignSettings) => {
    if (generatedData) {
      setGeneratedData({
        ...generatedData,
        design: newSettings
      });
    }
  };

  const handleSaveApplication = () => {
    if (!generatedData) return;
    saveApplication({
        jobDescription: jobDesc,
        chatHistory: chatHistory,
        generatedContent: generatedData,
        profileUsedId: activeProfileId,
        status: 'todo' // Default status
    });
    setSavedApps(getApplications());
    alert("Candidature sauvegardée dans l'historique.");
  };

  // --- RESET / NEW APPLICATION ---
  const handleResetWorkspace = () => {
      if (confirm(t(lang, 'ws_reset_confirm'))) {
          setJobDesc("");
          setChatHistory([]);
          setGeneratedData(null);
          setAppState(AppState.IDLE);
          clearWorkspaceDraft(); // Clear storage
      }
  };

  // --- HISTORY ACTIONS ---

  const handleStatusChange = (id: string, status: ApplicationStatus) => {
      const updated = updateApplicationStatus(id, status);
      setSavedApps(updated);
  };

  const handleSoftDelete = (id: string) => {
      const updated = softDeleteApplication(id);
      setSavedApps(updated);
  };

  const handleRestore = (id: string) => {
      const updated = restoreApplication(id);
      setSavedApps(updated);
  };

  const handlePermanentDelete = (id: string) => {
      const updated = permanentlyDeleteApplication(id);
      setSavedApps(updated);
  };

  const handleLoadApplication = (app: SavedApplication) => {
      setJobDesc(app.jobDescription);
      setChatHistory(app.chatHistory);
      setGeneratedData(app.generatedContent);
      setAppState(AppState.SUCCESS);
      setCurrentView('WORKSPACE');
  };
  
  // Navigation Handler
  const handleGoToWorkspace = () => {
      setCurrentView('WORKSPACE');
  };

  const activeProfileName = profiles.find(p => p.id === activeProfileId)?.name || "Profil";

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* 1. NAVBAR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20 text-sm">AI</div>
          <h1 className="font-semibold text-base text-slate-100 hidden md:block">{t(lang, 'app_title')}</h1>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-lg">
            <button onClick={() => setCurrentView('PROFILE')} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${currentView === 'PROFILE' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                {t(lang, 'nav_profile')}
            </button>
            <button onClick={handleGoToWorkspace} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${currentView === 'WORKSPACE' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                {t(lang, 'nav_workspace')}
            </button>
            <button onClick={() => setCurrentView('HISTORY')} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${currentView === 'HISTORY' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                {t(lang, 'nav_history')}
            </button>
        </div>

        <div className="flex gap-2">
            <button onClick={() => setLang('fr')} className={`text-xs px-2 py-1 rounded border ${lang === 'fr' ? 'bg-blue-900 border-blue-500 text-white' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}>FR</button>
             <button onClick={() => setLang('en')} className={`text-xs px-2 py-1 rounded border ${lang === 'en' ? 'bg-blue-900 border-blue-500 text-white' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}>EN</button>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 overflow-hidden relative">
        
        {/* VIEW: PROFILE EDITOR */}
        {currentView === 'PROFILE' && (
           <div className="h-full">
              <ProfileEditor 
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSelectProfile={handleSelectProfile}
                onCreateProfile={handleCreateProfile}
                onDeleteProfile={handleDeleteProfile}
                onUpdateProfile={handleUpdateProfile}
                lang={lang}
              />
           </div>
        )}

        {/* VIEW: HISTORY */}
        {currentView === 'HISTORY' && (
            <div className="h-full overflow-hidden flex flex-col">
                <h2 className="text-2xl font-bold text-white p-6 pb-2 shrink-0">{t(lang, 'hist_title')}</h2>
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <HistoryList 
                        applications={savedApps} 
                        onLoad={handleLoadApplication} 
                        onSoftDelete={handleSoftDelete}
                        onRestore={handleRestore}
                        onPermanentDelete={handlePermanentDelete}
                        onStatusChange={handleStatusChange}
                        lang={lang}
                    />
                </div>
            </div>
        )}

        {/* VIEW: WORKSPACE */}
        {currentView === 'WORKSPACE' && (
            <div className="flex h-full">
                
                {/* LEFT: CHAT */}
                <div className="w-[400px] shrink-0 border-r border-slate-800 h-full flex flex-col">
                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs flex justify-between items-center text-slate-400">
                        <span>{t(lang, 'ws_active_profile')}:</span>
                        <span className="text-blue-400 font-bold truncate max-w-[150px]">{activeProfileName}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ChatInterface 
                            messages={chatHistory}
                            inputValue={chatInput}
                            setInputValue={setChatInput}
                            onSend={handleSendMessage}
                            isSending={appState === AppState.GENERATING}
                            jobDesc={jobDesc}
                            setJobDesc={setJobDesc}
                            hasJobDescLocked={chatHistory.length > 0}
                            onReset={handleResetWorkspace}
                            lang={lang}
                        />
                    </div>
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="flex-1 bg-slate-950 h-full flex flex-col relative">
                    
                    {generatedData ? (
                        <>
                             {/* ATS SCORE PANEL */}
                             {generatedData.ats && (
                                <div className="bg-slate-900/80 backdrop-blur border-b border-slate-800 p-3 flex items-center justify-between gap-4 z-10 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t(lang, 'ws_ats_score')}</div>
                                            <div className={`text-xl font-bold ${generatedData.ats.score >= 80 ? 'text-emerald-400' : generatedData.ats.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                                {generatedData.ats.score}%
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-700"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">{t(lang, 'ws_ats_missing')}</span>
                                            <div className="flex gap-1 flex-wrap">
                                                {generatedData.ats.missingKeywords.slice(0, 3).map((kw, i) => (
                                                    <span key={i} className="text-xs bg-red-900/30 text-red-300 px-1.5 rounded border border-red-900/50">{kw}</span>
                                                ))}
                                                {generatedData.ats.missingKeywords.length > 3 && (
                                                    <span className="text-xs text-slate-500">+{generatedData.ats.missingKeywords.length - 3}</span>
                                                )}
                                                {generatedData.ats.missingKeywords.length === 0 && (
                                                    <span className="text-xs text-emerald-500">Aucun !</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             )}

                            {/* Toolbar */}
                            <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm z-10">
                                <div className="flex bg-slate-800 rounded p-1">
                                    <button onClick={() => setPreviewTab('CV')} className={`px-4 py-1 text-xs font-bold rounded transition-colors ${previewTab === 'CV' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>CV</button>
                                    <button onClick={() => setPreviewTab('LETTER')} className={`px-4 py-1 text-xs font-bold rounded transition-colors ${previewTab === 'LETTER' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>Lettre</button>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleSaveApplication} className="text-emerald-400 hover:text-emerald-300 text-xs font-bold px-3 py-2 transition-colors">
                                        {t(lang, 'btn_save')}
                                    </button>
                                    <button onClick={() => setShowExportModal(true)} className="bg-white text-slate-900 hover:bg-slate-200 px-4 py-2 rounded text-xs font-bold shadow transition-transform active:scale-95 flex items-center gap-2">
                                        {t(lang, 'btn_export')}
                                    </button>
                                </div>
                            </div>

                            {/* Canvas */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-950 flex flex-col items-center">
                                {/* INSERTED DESIGN TOOLBAR */}
                                <div className="w-full max-w-[210mm] mb-4">
                                  <DesignToolbar settings={generatedData.design} onChange={handleDesignChange} />
                                </div>

                                <div className={`a4-page transition-transform origin-top duration-300 scale-[0.8] lg:scale-[0.9] xl:scale-100 ${previewTab === 'CV' ? 'block' : 'hidden'}`}>
                                    <CVPreview data={generatedData.cv} settings={generatedData.design} />
                                </div>
                                <div className={`a4-page transition-transform origin-top duration-300 scale-[0.8] lg:scale-[0.9] xl:scale-100 ${previewTab === 'LETTER' ? 'block' : 'hidden'}`}>
                                    <LetterPreview content={generatedData.coverLetter} cvData={generatedData.cv} settings={generatedData.design} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 opacity-50">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-500 mb-2">{t(lang, 'ws_empty_title')}</h3>
                            <p className="max-w-md">
                                {t(lang, 'ws_empty_desc')} <br/>
                                <span className="text-blue-500 italic">"{t(lang, 'ws_empty_action')}"</span>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>

      {/* 3. EXPORT MODAL */}
      {generatedData && (
          <ExportModal 
            isOpen={showExportModal} 
            onClose={() => setShowExportModal(false)} 
            data={generatedData} 
          />
      )}

    </div>
  );
};

export default App;