import React from 'react';
import { DesignSettings, DesignLayout, DesignColor, DesignFont } from '../types';

interface DesignToolbarProps {
  settings: DesignSettings;
  onChange: (newSettings: DesignSettings) => void;
}

export const DesignToolbar: React.FC<DesignToolbarProps> = ({ settings, onChange }) => {
  
  const update = (key: keyof DesignSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const colors: { id: DesignColor; bg: string }[] = [
    { id: 'slate', bg: 'bg-slate-800' },
    { id: 'blue', bg: 'bg-blue-600' },
    { id: 'emerald', bg: 'bg-emerald-600' },
    { id: 'rose', bg: 'bg-rose-600' },
    { id: 'amber', bg: 'bg-amber-500' },
  ];

  return (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-col md:flex-row gap-4 items-center justify-between no-print">
      
      {/* Layout Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase">Mise en page</span>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['modern', 'classic', 'minimal'] as DesignLayout[]).map((layout) => (
            <button
              key={layout}
              onClick={() => update('layout', layout)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                settings.layout === layout ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      {/* Font Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase">Police</span>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => update('font', 'sans')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${settings.font === 'sans' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
          >
            Aa (Sans)
          </button>
          <button
            onClick={() => update('font', 'serif')}
            className={`px-3 py-1 text-xs font-serif rounded-md transition-all ${settings.font === 'serif' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
          >
            Aa (Serif)
          </button>
        </div>
      </div>

      {/* Color Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase">Couleur</span>
        <div className="flex gap-1">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => update('color', c.id)}
              className={`w-6 h-6 rounded-full ${c.bg} transition-transform hover:scale-110 border-2 ${
                settings.color === c.id ? 'border-slate-400 ring-2 ring-slate-200' : 'border-transparent'
              }`}
              title={c.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
