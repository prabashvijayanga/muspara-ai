import React from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideText: string;
}

export default function GuideModal({ isOpen, onClose, guideText }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-300">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-3xl">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>📚</span> Smart Study Guide
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center transition-all">&times;</button>
        </div>
        
        {/* Content Area - Renders the AI Markdown Text safely */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/50 custom-scrollbar">
          <pre className="text-slate-300 font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {guideText}
          </pre>
        </div>
        
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900 rounded-b-3xl">
          <button 
            onClick={() => navigator.clipboard.writeText(guideText)}
            className="px-5 py-2.5 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl transition-all font-bold text-xs border border-cyan-500/20"
          >
            Copy Text
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition-all font-extrabold text-xs shadow-lg shadow-cyan-500/20"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}