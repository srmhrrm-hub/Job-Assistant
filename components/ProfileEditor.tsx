import React, { useState, useEffect } from 'react';
import { Profile } from '../types';

interface ProfileEditorProps {
  profiles: Profile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (id: string) => void;
  onUpdateProfile: (profile: Profile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ 
  profiles, activeProfileId, onSelectProfile, onCreateProfile, onDeleteProfile, onUpdateProfile 
}) => {
  
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  
  // State pour la création
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  // State pour le renommage
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    setIsRenaming(false);
  }, [activeProfileId]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName);
      setNewProfileName("");
      setIsCreating(false);
    }
  };

  const handleStartRename = () => {
    setRenameValue(activeProfile.name);
    setIsRenaming(true);
  };

  const handleSaveRename = () => {
    if (renameValue.trim()) {
      onUpdateProfile({ ...activeProfile, name: renameValue });
      setIsRenaming(false);
    }
  };

  const handleDeleteActive = () => {
    if (profiles.length <= 1) {
        alert("Impossible de supprimer le dernier profil.");
        return;
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer le profil "${activeProfile.name}" ? Cette action est irréversible.`)) {
        onDeleteProfile(activeProfile.id);
    }
  };

  if (!activeProfile) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="flex h-full bg-slate-950">
      
      {/* Sidebar Profiles List */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Mes Profils</h2>
          
          {isCreating ? (
            <form onSubmit={handleCreateSubmit} className="mb-2 animate-fade-in">
              <input 
                autoFocus
                type="text" 
                className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-sm text-white mb-2"
                placeholder="Nom du profil..."
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
              />
              <div className="flex gap-2 text-xs">
                <button type="submit" className="text-blue-400 font-bold hover:underline">OK</button>
                <button type="button" onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-white">Annuler</button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 border-dashed rounded-lg py-2 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nouveau Profil
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {profiles.map(profile => (
            <div 
              key={profile.id}
              onClick={() => onSelectProfile(profile.id)}
              className={`group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                profile.id === activeProfileId 
                  ? 'bg-slate-800 border-l-4 border-blue-500 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="truncate font-medium text-sm">{profile.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header avec Actions (Renommer / Supprimer) */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
            <div className="flex-1">
               {isRenaming ? (
                   <div className="flex items-center gap-2">
                       <input 
                         autoFocus
                         type="text" 
                         value={renameValue}
                         onChange={(e) => setRenameValue(e.target.value)}
                         className="bg-slate-900 border border-blue-500 text-white text-2xl font-bold px-3 py-1 rounded-lg focus:outline-none"
                       />
                       <button onClick={handleSaveRename} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                         </svg>
                       </button>
                       <button onClick={() => setIsRenaming(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                       </button>
                   </div>
               ) : (
                   <div className="flex items-center gap-3 group">
                       <h1 className="text-3xl font-bold text-white tracking-tight">{activeProfile.name}</h1>
                       <button 
                         onClick={handleStartRename}
                         className="text-slate-500 hover:text-blue-400 transition-colors p-1 rounded-md"
                         title="Renommer le profil"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                         </svg>
                       </button>
                   </div>
               )}
               <p className="text-slate-400 text-sm mt-1">Source de données pour l'IA.</p>
            </div>

            {profiles.length > 1 && (
                <button 
                  onClick={handleDeleteActive}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-red-400 hover:bg-red-900/20 hover:border-red-900 rounded-lg transition-colors text-sm font-medium"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                   </svg>
                   Supprimer
                </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex justify-between text-sm font-semibold text-blue-400 uppercase tracking-wider">
                <span>CV de Base (Texte/JSON)</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Source de vérité</span>
              </label>
              <textarea
                value={activeProfile.cv}
                onChange={(e) => onUpdateProfile({ ...activeProfile, cv: e.target.value })}
                className="w-full h-[600px] bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed custom-scrollbar shadow-inner"
                placeholder="Copiez ici tout le contenu textuel de votre CV. L'IA piochera dedans."
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex justify-between text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                <span>Lettre Type (Optionnel)</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Style & Ton</span>
              </label>
              <textarea
                value={activeProfile.letter}
                onChange={(e) => onUpdateProfile({ ...activeProfile, letter: e.target.value })}
                className="w-full h-[600px] bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none leading-relaxed custom-scrollbar shadow-inner"
                placeholder="Copiez une lettre type ou des paragraphes clés. L'IA s'en inspirera."
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};