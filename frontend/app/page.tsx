"use client";

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Background ambient glow effects with Cyan and Green tones */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <span className="text-xl font-bold text-slate-950">⚡</span>
          </div>
          <span className="text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-white via-cyan-100 to-emerald-400 bg-clip-text text-transparent">
            MUSPARA AI
          </span>
        </div>
        
        {/* Navigation Link to Workspace Canvas */}
        <Link 
          href="/canvas"
          className="px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-lg shadow-cyan-500/20 text-slate-950"
        >
          Launch Workspace 🚀
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center z-10 my-auto py-12">
        
        {/* Feature Highlights Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-6 sm:mb-8 animate-pulse shadow-sm">
          <span>✨</span> Next-Generation Spatial AI Study Environment
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
          Transform Any PDF Into An <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Interactive AI Study Hub
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 font-normal leading-relaxed">
          Upload your lecture notes, execute lightning-fast concurrent text extraction, crop and query complex diagrams with spatial vision, and generate smart concept webs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link 
            href="/canvas"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/20 text-center transition-all transform hover:-translate-y-0.5"
          >
            Get Started Free ➔
          </Link>
          <a 
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold text-sm sm:text-base border border-slate-800 text-center transition-all"
          >
            Explore Features 📖
          </a>
        </div>

        {/* Technical Feature Highlights */}
        <div id="features" className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 sm:mt-24 text-left">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/50 transition-all">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-white text-base sm:text-lg mb-1">Async Processing</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Concurrent asynchronous execution for instant document breakdown.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-emerald-500/50 transition-all">
            <div className="text-3xl mb-3">🪄</div>
            <h3 className="font-bold text-white text-base sm:text-lg mb-1">Spatial Vision</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Spatial segmentation and bounding box extraction for deep diagram analysis.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/50 transition-all">
            <div className="text-3xl mb-3">🕸️</div>
            <h3 className="font-bold text-white text-base sm:text-lg mb-1">Knowledge Graphs</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Synthesizes multi-page document context into interactive node webs & markdown notes.</p>
          </div>
        </div>
      </div>
    </main>
  );
}