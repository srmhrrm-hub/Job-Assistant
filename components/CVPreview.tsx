import React from 'react';
import { CVData, DesignSettings } from '../types';

interface CVPreviewProps {
  data: CVData;
  settings: DesignSettings;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data, settings }) => {
  
  const getThemeClasses = () => {
    switch (settings.color) {
      case 'blue': return { primary: 'text-blue-700', bg: 'bg-blue-700', bgLight: 'bg-blue-50', border: 'border-blue-700', borderLight: 'border-blue-200' };
      case 'emerald': return { primary: 'text-emerald-700', bg: 'bg-emerald-700', bgLight: 'bg-emerald-50', border: 'border-emerald-700', borderLight: 'border-emerald-200' };
      case 'rose': return { primary: 'text-rose-700', bg: 'bg-rose-700', bgLight: 'bg-rose-50', border: 'border-rose-700', borderLight: 'border-rose-200' };
      case 'amber': return { primary: 'text-amber-700', bg: 'bg-amber-600', bgLight: 'bg-amber-50', border: 'border-amber-600', borderLight: 'border-amber-200' };
      case 'slate': default: return { primary: 'text-slate-800', bg: 'bg-slate-800', bgLight: 'bg-slate-100', border: 'border-slate-800', borderLight: 'border-slate-200' };
    }
  };
  
  const theme = getThemeClasses();
  const fontClass = settings.font === 'serif' ? 'font-serif' : settings.font === 'mono' ? 'font-mono' : 'font-sans';

  // --- SUB-COMPONENTS ---
  
  const ContactInfo = ({ align = 'center' }: { align?: 'center' | 'left' }) => (
    <div className={`flex flex-wrap gap-4 text-sm mt-3 ${align === 'center' ? 'justify-center' : 'justify-start'} ${settings.layout === 'modern' ? 'text-slate-300' : 'text-slate-600'}`}>
      {data.email && <span>📧 {data.email}</span>}
      {data.phone && <span>📱 {data.phone}</span>}
      {data.location && <span>📍 {data.location}</span>}
    </div>
  );

  const SkillsSection = () => (
    <div className="mb-6">
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${settings.layout === 'modern' ? 'text-slate-900 border-b-2 border-slate-300 pb-1' : `${theme.primary} border-b ${theme.borderLight} pb-1`}`}>
        Compétences
      </h3>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill, idx) => (
          <span key={idx} className={`text-sm px-2 py-1 rounded border ${settings.layout === 'modern' ? 'bg-white border-slate-200' : `${theme.bgLight} ${theme.borderLight} ${theme.primary}`}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  const ExperienceSection = () => (
    <div className="mb-6">
      <h3 className={`text-lg font-bold uppercase tracking-wider mb-4 ${settings.layout === 'modern' ? `text-slate-900 border-b-2 ${theme.border} pb-1` : `${theme.primary} border-b ${theme.borderLight} pb-1`}`}>
        Expérience Professionnelle
      </h3>
      <div className="space-y-6">
        {data.experience.map((exp, idx) => (
          <div key={idx} className={settings.layout === 'modern' ? "relative pl-4 border-l-2 border-slate-200" : ""}>
             {settings.layout === 'modern' && <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>}
            
            <div className="flex justify-between items-baseline mb-1 flex-wrap">
              <h4 className="font-bold text-slate-800 text-base">{exp.role}</h4>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${theme.bgLight} ${theme.primary}`}>{exp.duration}</span>
            </div>
            <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
            <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
              {exp.description.map((point, pIdx) => (
                <li key={pIdx} className="pl-1">{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const EducationSection = () => (
    <div className="mb-6">
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${settings.layout === 'modern' ? 'text-slate-900 border-b-2 border-slate-300 pb-1' : `${theme.primary} border-b ${theme.borderLight} pb-1`}`}>
        Formation
      </h3>
      <div className="space-y-4">
        {data.education.map((edu, idx) => (
          <div key={idx}>
            <div className="font-semibold text-sm text-slate-800">{edu.degree}</div>
            <div className="text-xs text-slate-600">{edu.institution}</div>
            <div className="text-xs text-slate-500 italic">{edu.year}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // CLASSIC LAYOUT (No Photo)
  if (settings.layout === 'classic') {
    return (
      <div id="cv-document" className={`w-full h-full p-12 flex flex-col ${fontClass}`}>
        <div className="text-center mb-8 border-b-2 border-slate-100 pb-8">
          <h1 className={`text-5xl font-bold uppercase tracking-tight mb-2 ${theme.primary}`}>{data.fullName}</h1>
          <h2 className="text-2xl text-slate-500 font-medium">{data.title}</h2>
          <ContactInfo align="center" />
        </div>

        <div className="mb-8 text-center px-12">
           <p className="text-sm leading-relaxed text-slate-700 italic border-l-4 border-slate-200 pl-4">{data.summary}</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
           <ExperienceSection />
           <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-100">
              <SkillsSection />
              <EducationSection />
           </div>
        </div>
      </div>
    );
  }

  // MINIMALIST LAYOUT (No Photo)
  if (settings.layout === 'minimal') {
    return (
      <div id="cv-document" className={`w-full h-full p-12 flex flex-col ${fontClass}`}>
        <div className="mb-12">
          <h1 className="text-6xl font-light tracking-tighter text-slate-900 mb-2">{data.fullName}</h1>
          <h2 className={`text-2xl font-medium mb-6 ${theme.primary}`}>{data.title}</h2>
          <div className="text-sm text-slate-500 border-t border-b border-slate-100 py-3">
             <ContactInfo align="left" />
          </div>
        </div>

        <div className="flex gap-12">
            <div className="w-2/3">
                 <div className="mb-10">
                    <h3 className={`text-xs font-bold uppercase tracking-widest text-slate-400 mb-4`}>À propos</h3>
                    <p className="text-sm leading-relaxed text-slate-700">{data.summary}</p>
                 </div>
                 <ExperienceSection />
            </div>
            <div className="w-1/3 border-l border-slate-100 pl-8">
                <SkillsSection />
                <EducationSection />
                {data.languages.length > 0 && (
                  <div>
                    <h3 className={`text-xs font-bold uppercase tracking-widest text-slate-400 mb-3`}>Langues</h3>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {data.languages.map((l, i) => <li key={i}>{l}</li>)}
                    </ul>
                  </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  // MODERN LAYOUT (No Photo)
  return (
    <div id="cv-document" className={`w-full h-full flex flex-col ${fontClass}`}>
      <div className={`${theme.bg} text-white p-10 print:text-white print-color-adjust-exact`}>
        <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{data.fullName}</h1>
        <h2 className={`text-2xl font-medium mb-4 text-white opacity-90`}>{data.title}</h2>
        <ContactInfo align="left" />
      </div>

      <div className="flex flex-row flex-1">
        <div className="w-1/3 bg-slate-50 p-8 border-r border-slate-200">
            <SkillsSection />
            <EducationSection />
             {data.languages.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1 mb-3">Langues</h3>
                    <ul className="text-sm text-slate-700 space-y-1">
                        {data.languages.map((lang, idx) => <li key={idx}>• {lang}</li>)}
                    </ul>
                </div>
             )}
        </div>

        <div className="w-2/3 p-8">
            <div className="mb-8">
                <h3 className={`text-lg font-bold uppercase tracking-wider text-slate-900 border-b-2 ${theme.border} pb-1 mb-3 inline-block`}>Profil</h3>
                <p className="text-sm leading-relaxed text-slate-700 text-justify">{data.summary}</p>
            </div>
            <ExperienceSection />
        </div>
      </div>
    </div>
  );
};