"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onUploadClick: () => void;
  onGenerateGuideClick: () => void;
  isProcessing: boolean;
  isActionDisabled: boolean;
}

export default function Header({ 
  onUploadClick, 
  onGenerateGuideClick,
  isProcessing, 
  isActionDisabled 
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md z-10">
      
      {/* Brand Title Clickable to Home */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-md">
          <span>⚡</span>
        </div>
        <div>
          <h1 className="font-black text-white text-base sm:text-lg tracking-tight">MUSPARA AI Workspace</h1>
          <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Spatial Knowledge Engine</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        <button 
          onClick={onUploadClick}
          className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <span>📁</span> Upload PDF
        </button>

        {/* Generate Concept Web / Study Guide Button */}
        <button 
          onClick={onGenerateGuideClick}
          disabled={isActionDisabled}
          className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm border border-slate-700 disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {isProcessing ? <span className="animate-spin text-cyan-400">⏳</span> : <span>🕸️</span>}
          <span>{isProcessing ? "Generating Web..." : "AI Concept Web"}</span>
        </button>
      </div>
    </header>
  );
}