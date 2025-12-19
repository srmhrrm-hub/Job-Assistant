import React, { useState } from 'react';
import { SavedApplication, AppLanguage, ApplicationStatus } from '../types';
import { t } from '../utils/translations';

interface HistoryListProps {
  applications: SavedApplication[];
  onLoad: (app: SavedApplication) => void;
  onSoftDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  lang: AppLanguage;
}

export const HistoryList: React.FC<HistoryListProps> = ({ 
    applications, onLoad, onSoftDelete, onRestore, onPermanentDelete, onStatusChange, lang 
}) => {
  
  const [showTrash, setShowTrash] = useState(false);

  const activeApps = applications.filter(a => a.status !== 'trash');
  const trashApps = applications.filter(a => a.status === 'trash');

  const columns: { id: ApplicationStatus; label: string; color: string }[] = [
      { id: 'todo', label: t(lang, 'status_todo'), color: 'border-slate-500' },
      { id: 'applied', label: t(lang, 'status_applied'), color: 'border-blue-500' },
      { id: 'interview', label: t(lang, 'status_interview'), color: 'border-purple-500' },
      { id: 'offer', label: t(lang, 'status_offer'), color: 'border-emerald-500' },
      { id: 'rejected', label: t(lang, 'status_rejected'), color: 'border-red-500' },
  ];

  // Suppression "Douce" (Mise à la corbeille) - Pas de confirmation requise car réversible
  const handleSoftDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Empêche le comportement par défaut
    e.stopPropagation(); // Empêche l'ouverture de la carte
    onSoftDelete(id);
  };

  const handleRestore = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      onRestore(id);
  }

  // Suppression Définitive - Confirmation requise
  const handlePermanentDelete = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      if(confirm(t(lang, 'hist_purge_confirm'))) {
          onPermanentDelete(id);
      }
  }

  const handleMove = (e: React.MouseEvent, id: string, currentStatus: ApplicationStatus, direction: 'next' | 'prev') => {
      e.preventDefault();
      e.stopPropagation();
      const currentIndex = columns.findIndex(c => c.id === currentStatus);
      if (currentIndex === -1) return;

      const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex >= 0 && nextIndex < columns.length) {
          onStatusChange(id, columns[nextIndex].id);
      }
  };

  return (
    <div className="flex flex-col h-full">
        {/* Toggle View Bar */}
        <div className="flex justify-end px-4 py-2 shrink-0">
            <button 
                onClick={() => setShowTrash(!showTrash)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    showTrash 
                    ? 'bg-red-900/30 text-red-400 border-red-900' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
            >
                {showTrash ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
                        {t(lang, 'hist_view_board')}
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        {t(lang, 'hist_view_trash')} ({trashApps.length})
                    </>
                )}
            </button>
        </div>

        {/* TRASH VIEW */}
        {showTrash && (
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <h3 className="text-red-400 font-bold mb-4 uppercase tracking-wider text-sm">{t(lang, 'hist_trash_title')}</h3>
                {trashApps.length === 0 ? (
                    <div className="text-slate-600 text-center mt-10">Vide</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trashApps.map(app => (
                             <div 
                                key={app.id}
                                className="bg-slate-900 border border-slate-800 p-4 rounded-lg opacity-75 hover:opacity-100 transition-opacity"
                             >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-300 text-sm truncate w-full">{app.generatedContent.analysis.jobTitle}</h4>
                                </div>
                                <p className="text-xs text-slate-500 mb-3 truncate">{app.generatedContent.analysis.companyName}</p>
                                <div className="text-[10px] text-red-500 mb-4">
                                    Supprimé le : {app.deletedAt ? new Date(app.deletedAt).toLocaleDateString() : '?'}
                                </div>
                                
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => handleRestore(e, app.id)}
                                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs rounded border border-slate-700 flex justify-center items-center gap-1 z-10 relative"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                                        {t(lang, 'hist_restore')}
                                    </button>
                                    <button 
                                        onClick={(e) => handlePermanentDelete(e, app.id)}
                                        className="flex-1 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs rounded border border-red-900/50 flex justify-center items-center gap-1 z-10 relative"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        X
                                    </button>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* BOARD VIEW */}
        {!showTrash && (
             <div className="flex gap-4 p-4 h-full overflow-x-auto">
                {activeApps.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <p>{t(lang, 'hist_empty')}</p>
                    </div>
                )}
                {activeApps.length > 0 && columns.map(col => {
                    const appsInCol = activeApps.filter(a => a.status === col.id);
                    
                    return (
                        <div key={col.id} className="min-w-[280px] w-[280px] flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-800">
                            {/* Header */}
                            <div className={`p-3 border-t-4 ${col.color} bg-slate-900 rounded-t-xl flex justify-between items-center`}>
                                <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">{col.label}</h3>
                                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{appsInCol.length}</span>
                            </div>
                            
                            {/* List */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                                {appsInCol.map(app => (
                                    <div 
                                        key={app.id}
                                        onClick={() => onLoad(app)}
                                        className="bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-700 hover:border-slate-500 cursor-pointer group transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-200 text-sm truncate w-full">{app.generatedContent.analysis.jobTitle}</h4>
                                        </div>
                                        <p className="text-xs text-blue-400 font-medium mb-3 truncate">{app.generatedContent.analysis.companyName}</p>
                                        
                                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                                            <span>{new Date(app.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'numeric' })}</span>
                                            {app.generatedContent.ats && (
                                                <span className={`px-1.5 py-0.5 rounded font-bold ${app.generatedContent.ats.score >= 70 ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'}`}>
                                                    {app.generatedContent.ats.score}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                            <button 
                                                onClick={(e) => handleMove(e, app.id, app.status, 'prev')}
                                                disabled={col.id === 'todo'}
                                                className="p-2 text-slate-500 hover:text-slate-300 disabled:opacity-30 hover:bg-slate-700/50 rounded"
                                                title={t(lang, 'move_prev')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                            </button>

                                            <button 
                                                onClick={(e) => handleSoftDelete(e, app.id)}
                                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-slate-700/50 rounded"
                                                title="Corbeille"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                            </button>

                                            <button 
                                                onClick={(e) => handleMove(e, app.id, app.status, 'next')}
                                                disabled={col.id === 'rejected'}
                                                className="p-2 text-slate-500 hover:text-slate-300 disabled:opacity-30 hover:bg-slate-700/50 rounded"
                                                title={t(lang, 'move_next')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
             </div>
        )}
    </div>
  );
};