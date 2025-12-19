import React, { useRef, useEffect } from 'react';
import { ChatMessage, AppLanguage } from '../types';
import { t } from '../utils/translations';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  inputValue: string;
  setInputValue: (val: string) => void;
  onSend: () => void;
  isSending: boolean;
  jobDesc: string;
  setJobDesc: (val: string) => void;
  hasJobDescLocked: boolean;
  lang: AppLanguage;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages, inputValue, setInputValue, onSend, isSending, jobDesc, setJobDesc, hasJobDescLocked, lang
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      
      {/* 1. Job Description Area (Top) */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 z-10">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            {hasJobDescLocked ? t(lang, 'ws_job_locked') : t(lang, 'ws_job_placeholder')}
        </label>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          disabled={hasJobDescLocked}
          className={`w-full h-24 bg-slate-800 border ${hasJobDescLocked ? 'border-slate-800 text-slate-500' : 'border-slate-700 text-slate-200'} rounded-lg p-3 text-xs resize-none focus:ring-1 focus:ring-blue-500`}
          placeholder={t(lang, 'ws_job_input_placeholder')}
        />
      </div>

      {/* 2. Chat History (Middle) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/50">
        {messages.length === 0 && (
          <div className="text-center text-slate-600 mt-10 text-sm">
            <p>{t(lang, 'ws_chat_start_1')}</p>
            <p>{t(lang, 'ws_chat_start_2')}</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isSending && (
           <div className="flex justify-start">
             <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm border border-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
             </div>
           </div>
        )}
      </div>

      {/* 3. Input Area (Bottom) */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if(!isSending && jobDesc.trim()) onSend();
                }
            }}
            placeholder={!jobDesc.trim() ? t(lang, 'ws_chat_placeholder_empty') : t(lang, 'ws_chat_placeholder_active')}
            disabled={!jobDesc.trim() || isSending}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none h-14 disabled:opacity-50"
          />
          <button
            onClick={onSend}
            disabled={!jobDesc.trim() || !inputValue.trim() || isSending}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};