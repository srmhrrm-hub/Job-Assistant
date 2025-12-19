import React from 'react';

interface InputSectionProps {
  jobDesc: string;
  setJobDesc: (val: string) => void;
  cvText: string;
  setCvText: (val: string) => void;
  letterText: string;
  setLetterText: (val: string) => void;
  instruction: string;
  setInstruction: (val: string) => void;
  onAction: () => void;
  isGenerating: boolean;
  isInitial: boolean;
  canUndo: boolean;
  onUndo: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  jobDesc, setJobDesc, cvText, setCvText, letterText, setLetterText, 
  instruction, setInstruction,
  onAction, isGenerating, isInitial, canUndo, onUndo
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900">
      
      {/* Scrollable Inputs */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Context Section */}
        <div className="bg-slate-800/50 p-4 rounded-xl shadow-inner border border-slate-800">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Données Source</h2>
          
          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-400 mb-2">Description du Poste</label>
            <textarea
              className="w-full h-24 p-3 text-sm bg-slate-900 border border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-600 resize-none transition-all"
              placeholder="Collez l'offre d'emploi ici..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>

          <div className="mb-5">
             <label className="block text-xs font-medium text-slate-400 mb-2">Votre CV (Texte brut)</label>
             <textarea
              className="w-full h-24 p-3 text-sm bg-slate-900 border border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-600 resize-none transition-all"
              placeholder="Votre expérience, diplômes..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
            />
          </div>

           <div>
             <label className="block text-xs font-medium text-slate-400 mb-2">Votre Lettre (Optionnel)</label>
             <textarea
              className="w-full h-24 p-3 text-sm bg-slate-900 border border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-600 resize-none transition-all"
              placeholder="Une ancienne lettre pour le style..."
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
            />
          </div>
        </div>

      </div>

      {/* Action Area (Fixed at bottom) */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shadow-2xl z-10">
        <div className="mb-3">
          <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
             {isInitial ? "Instructions de départ" : "Chat avec l'IA"}
          </label>
          <textarea
            className="w-full h-20 p-3 text-sm bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 resize-none"
            placeholder={isInitial 
                ? "Ex: Fais un CV moderne et une lettre convaincante pour ce poste." 
                : "Ex: Change la couleur en bleu, raccourcis le résumé..."}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isGenerating) onAction();
                }
            }}
          />
        </div>

        <div className="flex gap-2">
           {/* Undo Button */}
           <button
             onClick={onUndo}
             disabled={!canUndo || isGenerating}
             className={`px-3 rounded-lg border flex items-center justify-center transition-colors
                ${!canUndo || isGenerating 
                    ? 'border-slate-800 text-slate-700 bg-slate-900 cursor-not-allowed' 
                    : 'border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white bg-slate-900'}`}
             title="Annuler la dernière modification"
           >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
           </button>

           <button
            onClick={onAction}
            disabled={isGenerating || !jobDesc.trim() || !cvText.trim()}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-white shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2
            ${isGenerating || !jobDesc.trim() || !cvText.trim() 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20 active:scale-[0.98]'}`}
            >
            {isGenerating ? (
            <>
                <svg className="animate-spin h-5 w-5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Traitement...</span>
            </>
            ) : (
            <>
                <span>{isInitial ? "Générer la candidature" : "Appliquer"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </>
            )}
            </button>
        </div>
      </div>
    </div>
  );
};