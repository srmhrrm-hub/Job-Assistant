import React from 'react';
import { SavedApplication } from '../types';

interface HistoryListProps {
  applications: SavedApplication[];
  onLoad: (app: SavedApplication) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ applications, onLoad, onDelete }) => {
  if (applications.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 opacity-20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p>Historique vide.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {applications.map((app) => (
        <div 
          key={app.id} 
          className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700 hover:border-blue-500/50 hover:shadow-blue-900/10 transition-all group relative cursor-pointer"
          onClick={() => onLoad(app)}
        >
          <div>
            <h3 className="font-bold text-slate-200 line-clamp-1">
              {app.generatedContent.analysis.jobTitle || "Poste Inconnu"}
            </h3>
            <p className="text-sm text-blue-400 font-medium mb-2">
              {app.generatedContent.analysis.companyName || "Entreprise Inconnue"}
            </p>
            <div className="flex justify-between items-center mt-3">
                 <p className="text-xs text-slate-500">
                {new Date(app.createdAt).toLocaleDateString('fr-FR', { 
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
                </p>
                <div className="flex gap-2">
                    <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-600">CV</span>
                    <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-600">Lettre</span>
                </div>
            </div>
           
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if(confirm("Supprimer cette candidature ?")) onDelete(app.id);
            }}
            className="absolute top-3 right-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-800 rounded-md"
            title="Supprimer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};