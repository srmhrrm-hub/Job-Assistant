import React, { useState, useEffect } from 'react';
import { ProfileEditor } from './components/ProfileEditor';
import { ChatInterface } from './components/ChatInterface';
import { CVPreview } from './components/CVPreview';
import { LetterPreview } from './components/LetterPreview';
import { HistoryList } from './components/HistoryList';
import { ExportModal } from './components/ExportModal';
import { generateOrRefineContent } from './services/geminiService';
import { 
  saveApplication, getApplications, deleteApplication, 
  getProfiles, saveProfiles, createProfile, updateProfile, deleteProfile,
  getActiveProfileId, setActiveProfileId
} from './services/storageService';
import { AppState, GeneratedContent, SavedApplication, ChatMessage, TabView, Profile, AppLanguage } from './types';
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
    
    // 3. Load Apps
    setSavedApps(getApplications());
    
    // 4. Default View Logic
    const activeProfile = loadedProfiles.find(p => p.id === initialActiveId);
    if (!activeProfile || !activeProfile.cv) {
        setCurrentView('PROFILE');
    } else {
        setCurrentView('WORKSPACE');
    }
  }, []);

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

  const handleSaveApplication = () => {
    if (!generatedData) return;
    saveApplication({
        jobDescription: jobDesc,
        chatHistory: chatHistory,
        generatedContent: generatedData,
        profileUsedId: activeProfileId
    });
    setSavedApps(getApplications());
    alert("Candidature sauvegardée.");
  };

  const handleLoadApplication = (app: SavedApplication) => {
      setJobDesc(app.jobDescription);
      setChatHistory(app.chatHistory);
      setGeneratedData(app.generatedContent);
      setAppState(AppState.SUCCESS);
      setCurrentView('WORKSPACE');
  };
  
  const handleNewApplication = () => {
      setJobDesc("");
      setChatHistory([]);
      setGeneratedData(null);
      setAppState(AppState.IDLE);
      setCurrentView('WORKSPACE');
  }

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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {t(lang, 'nav_profile')}
            </button>
            <button onClick={() => { handleNewApplication(); setCurrentView('WORKSPACE'); }} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${currentView === 'WORKSPACE' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.111 48.111 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
                {t(lang, 'nav_workspace')}
            </button>
            <button onClick={() => setCurrentView('HISTORY')} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${currentView === 'HISTORY' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t(lang, 'nav_history')}
            </button>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-2">
            <button 
                onClick={() => setLang('fr')} 
                className={`text-xs px-2 py-1 rounded border ${lang === 'fr' ? 'bg-blue-900 border-blue-500 text-white' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}
            >
                FR
            </button>
             <button 
                onClick={() => setLang('en')} 
                className={`text-xs px-2 py-1 rounded border ${lang === 'en' ? 'bg-blue-900 border-blue-500 text-white' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}
            >
                EN
            </button>
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
            <div className="h-full overflow-y-auto custom-scrollbar max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-white p-6 pb-0">{t(lang, 'hist_title')}</h2>
                <HistoryList 
                    applications={savedApps} 
                    onLoad={handleLoadApplication} 
                    onDelete={(id) => { setSavedApps(deleteApplication(id)); }}
                    lang={lang}
                />
            </div>
        )}

        {/* VIEW: WORKSPACE (CHAT + PREVIEW) */}
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
                            lang={lang}
                        />
                    </div>
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="flex-1 bg-slate-950 h-full flex flex-col relative">
                    
                    {generatedData ? (
                        <>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 001.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                        </svg>
                                        {t(lang, 'btn_export')}
                                    </button>
                                </div>
                            </div>

                            {/* Canvas */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-950 flex justify-center">
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