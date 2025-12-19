import React from 'react';
import { CVData, DesignSettings } from '../types';

interface LetterPreviewProps {
  content: string;
  cvData: CVData;
  settings: DesignSettings;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({ content, cvData, settings }) => {
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const getThemeColor = () => {
    switch (settings.color) {
        case 'blue': return 'text-blue-700';
        case 'emerald': return 'text-emerald-700';
        case 'rose': return 'text-rose-700';
        case 'amber': return 'text-amber-700';
        default: return 'text-slate-800';
    }
  };
  
  const fontClass = settings.font === 'serif' ? 'font-serif' : settings.font === 'mono' ? 'font-mono' : 'font-sans';
  const headerColor = getThemeColor();

  return (
    <div id="letter-document" className={`w-full h-full p-12 text-slate-800 ${fontClass} leading-relaxed flex flex-col`}>
      
      {/* Header Info */}
      {settings.layout === 'minimal' ? (
        <div className="mb-16 border-l-4 border-slate-200 pl-6">
             <h1 className="text-3xl font-light mb-1">{cvData.fullName}</h1>
             <p className={`text-sm font-bold uppercase tracking-widest ${headerColor}`}>{cvData.title}</p>
             <div className="mt-4 text-xs text-slate-500">
                <p>{cvData.email} • {cvData.phone}</p>
                <p>{cvData.location}</p>
             </div>
        </div>
      ) : (
        <div className="flex justify-between mb-12 items-start border-b border-slate-100 pb-8">
            <div className="text-sm">
            <p className={`font-bold text-xl mb-1 ${headerColor}`}>{cvData.fullName}</p>
            <p className="font-medium text-slate-500 mb-2">{cvData.title}</p>
            <p>{cvData.email}</p>
            <p>{cvData.phone}</p>
            <p>{cvData.location}</p>
            </div>
            
            <div className="text-sm text-right mt-8">
            <p className="mb-1">{cvData.location ? cvData.location.split(',')[0] : 'Ville'}, le {today}</p>
            </div>
        </div>
      )}

      {/* Content */}
      <div className="text-justify text-base space-y-4 max-w-prose flex-1">
         {paragraphs.map((para, idx) => (
           <p key={idx} className="mb-4">{para}</p>
         ))}
      </div>

      {/* Signature */}
      <div className="mt-16 pb-12">
        <p className="text-sm">Cordialement,</p>
        <p className={`mt-8 font-bold text-lg ${headerColor}`}>{cvData.fullName}</p>
      </div>

    </div>
  );
};