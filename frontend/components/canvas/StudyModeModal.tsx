"use client";

import React, { useRef, useState, useEffect } from 'react';
import ChatMessage from '../ChatMessage';

interface PageNode {
  id: string;
  imageUrl: string;
  label: string;
}

interface StudyModeModalProps {
  selectedPage: PageNode | undefined;
  pages: PageNode[];
  selectedIndex: number;
  onClose: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  chatMessages: { role: 'user' | 'ai'; text: string }[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSendMessage: () => void;
  isChatting: boolean;
  BACKEND_BASE_URL: string;
  setChatMessages: React.Dispatch<React.SetStateAction<{ role: 'user' | 'ai'; text: string }[]>>;
}

export default function StudyModeModal({
  selectedPage,
  pages,
  selectedIndex,
  onClose,
  onPrevPage,
  onNextPage,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isChatting,
  BACKEND_BASE_URL,
  setChatMessages
}: StudyModeModalProps) {
  const [isMagicWandActive, setIsMagicWandActive] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionCurrent, setSelectionCurrent] = useState({ x: 0, y: 0 });
  
  // --- SPATIAL EXTRACTION LOADING STATE ---
  const [isSpatialAnalyzing, setIsSpatialAnalyzing] = useState(false);

  // --- SAFE RESIZABLE PANEL STATES ---
  const [desktopChatWidth, setDesktopChatWidth] = useState<number>(550);
  const [mobileChatHeight, setMobileChatHeight] = useState<number>(350);
  const [isResizingDesktop, setIsResizingDesktop] = useState(false);
  const [isResizingMobile, setIsResizingMobile] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  // Safe window dimensions check to prevent hydration errors
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingDesktop) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 350 && newWidth < window.innerWidth - 400) {
          setDesktopChatWidth(newWidth);
        }
      }
      if (isResizingMobile) {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 150 && newHeight < window.innerHeight - 150) {
          setMobileChatHeight(newHeight);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isResizingMobile && e.touches[0]) {
        const clientY = e.touches[0].clientY;
        const newHeight = window.innerHeight - clientY;
        if (newHeight > 150 && newHeight < window.innerHeight - 100) {
          setMobileChatHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingDesktop(false);
      setIsResizingMobile(false);
    };

    const handleTouchEnd = () => {
      setIsResizingMobile(false);
    };

    if (isResizingDesktop || isResizingMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isResizingDesktop, isResizingMobile]);

  if (!selectedPage) return null;

  // --- MAGIC WAND MOUSE LOGIC ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagicWandActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectionStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelectionCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectionCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = async () => {
    if (!isSelecting || !imgRef.current) return;
    setIsSelecting(false);
    
    const { x: x1, y: y1 } = selectionStart;
    const { x: x2, y: y2 } = selectionCurrent;
    if (Math.abs(x2 - x1) < 10 || Math.abs(y2 - y1) < 10) return;

    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    
    const realX1 = Math.max(0, Math.min(Math.round(x1 * scaleX), img.naturalWidth - 1));
    const realY1 = Math.max(0, Math.min(Math.round(y1 * scaleY), img.naturalHeight - 1));
    const realX2 = Math.max(0, Math.min(Math.round(x2 * scaleX), img.naturalWidth - 1));
    const realY2 = Math.max(0, Math.min(Math.round(y2 * scaleY), img.naturalHeight - 1));

    setChatMessages(prev => [...prev, { role: 'user', text: `🪄 Selected custom area for spatial analysis.` }]);
    
    // Turn on loading indicator for spatial extraction
    setIsSpatialAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("image_url", selectedPage.imageUrl);
      formData.append("x1", realX1.toString());
      formData.append("y1", realY1.toString());
      formData.append("x2", realX2.toString());
      formData.append("y2", realY2.toString());
      
      const response = await fetch(`${BACKEND_BASE_URL}/api/magic-wand`, { method: "POST", body: formData });
      const result = await response.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: result.reply }]);
      setIsMagicWandActive(false); 
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Failed to connect to backend server for spatial extraction." }]);
    } finally {
      // Turn off loading indicator
      setIsSpatialAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-slate-950/95 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
      
      {/* Left Side: PDF Page Viewer & Navigation */}
      <div className="flex-1 h-full relative flex flex-col overflow-hidden">
        
        {/* Top Floating Nav Bar */}
        <div className="flex justify-between items-center p-4 md:p-6 absolute top-0 w-full z-10 bg-gradient-to-b from-slate-950/90 to-transparent">
          <button 
            onClick={onClose} 
            className="px-4 py-2 md:px-5 md:py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-xl font-bold flex items-center gap-2 backdrop-blur-md transition-all border border-slate-800 shadow-lg text-xs"
          >
            ← Back to Grid
          </button>

          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-slate-200 shadow-lg">
            <button 
              onClick={onPrevPage} 
              disabled={selectedIndex === 0}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold disabled:opacity-30 transition-all"
            >
              ◀ Prev
            </button>
            <span className="text-xs font-black px-2 text-cyan-400">
              Page {selectedIndex + 1} of {pages.length}
            </span>
            <button 
              onClick={onNextPage} 
              disabled={selectedIndex === pages.length - 1}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold disabled:opacity-30 transition-all"
            >
              Next ▶
            </button>
          </div>
        </div>
        
        {/* Scrollable Image Canvas */}
        <div className="flex-1 overflow-auto flex justify-center items-start pt-24 pb-28 px-4 md:px-8 custom-scrollbar relative">
          <div 
            className="relative inline-block select-none shadow-2xl rounded-2xl border border-slate-800 bg-slate-900"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          >
            <img 
              ref={imgRef} src={selectedPage.imageUrl} alt={selectedPage.label} draggable={false}
              className={`max-w-full lg:max-w-4xl h-auto rounded-2xl transition-all ${isMagicWandActive ? 'cursor-crosshair' : 'cursor-default'}`}
            />
            {isSelecting && (
              <div className="absolute border-2 border-cyan-400 bg-cyan-500/20 pointer-events-none rounded-md"
                style={{ left: Math.min(selectionStart.x, selectionCurrent.x), top: Math.min(selectionStart.y, selectionCurrent.y), width: Math.abs(selectionCurrent.x - selectionStart.x), height: Math.abs(selectionCurrent.y - selectionStart.y) }}
              />
            )}
          </div>
          
          {/* Magic Wand Toggle Button */}
          <button 
            onClick={() => setIsMagicWandActive(!isMagicWandActive)} 
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl font-extrabold shadow-2xl transition-all flex items-center gap-2 z-20 text-xs ${
              isMagicWandActive 
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 animate-pulse ring-4 ring-cyan-500/30' 
                : 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span className="text-lg">🪄</span> {isMagicWandActive ? "Drag a Box on Diagram..." : "Enable Spatial Magic Wand"}
          </button>
        </div>
      </div>

      {/* --- DESKTOP RESIZE HANDLE --- */}
      <div 
        onMouseDown={(e) => { e.preventDefault(); setIsResizingDesktop(true); }}
        className="hidden lg:flex w-2 bg-slate-800 hover:bg-cyan-500/55 cursor-col-resize items-center justify-center transition-colors z-30"
        title="Drag to resize chat panel"
      >
        <div className="w-1 h-8 bg-slate-600 rounded-full"></div>
      </div>

      {/* Right Side: Fully Responsive & Resizable AI Chat Panel */}
      <div 
        className="lg:h-full bg-slate-900 shadow-2xl flex flex-col rounded-t-3xl lg:rounded-t-none overflow-hidden border-t lg:border-t-0 border-slate-800 z-30 transition-all duration-75"
        style={
          typeof window !== 'undefined' && window.innerWidth >= 1024 
            ? { width: `${desktopChatWidth}px` } 
            : { height: `${mobileChatHeight}px`, width: '100%' }
        }
      >
        <div className="flex flex-col h-full w-full bg-slate-900">
          {/* --- MOBILE RESIZE HANDLE --- */}
          <div 
            onMouseDown={() => setIsResizingMobile(true)}
            onTouchStart={() => setIsResizingMobile(true)}
            className="lg:hidden w-full h-4 bg-slate-950 flex items-center justify-center cursor-row-resize touch-none border-b border-slate-800"
            title="Drag up or down to resize chat"
          >
            <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
          </div>

          {/* Chat Header */}
          <div className="p-3 md:p-4 border-b border-slate-800 bg-slate-900/90 font-bold text-slate-100 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-xl text-cyan-400"><span className="text-lg">💬</span></div>
              <div>
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-extrabold">AI Tutor</div>
                <div className="text-xs md:text-sm text-slate-200">MUSPARA AI Spatial Vision</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block bg-slate-800 px-2 py-1 rounded-md">
              💡 Drag edge/top to resize
            </div>
          </div>
          
          {/* Messages Box */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col bg-slate-950/50">
            {chatMessages.length === 0 && (
              <div className="text-slate-400 text-sm text-center mt-4 bg-slate-900 p-5 rounded-2xl shadow-lg border border-slate-800 mx-auto w-full max-w-[95%]">
                <span className="text-3xl block mb-2">👋</span>
                <h3 className="font-bold text-white text-sm mb-1">Interactive Study Mode</h3>
                <div className="text-left bg-cyan-500/5 p-3 rounded-xl text-xs text-slate-300 border border-cyan-500/15 mt-3">
                  <ul className="space-y-1.5">
                    <li className="flex gap-2 text-cyan-300"><span>🪄</span> Click Magic Wand & <b>Drag</b> to extract diagrams</li>
                    <li className="flex gap-2 text-emerald-300"><span>✨</span> Ask questions about this specific page</li>
                  </ul>
                </div>
              </div>
            )}
            <div className="flex flex-col">
              {chatMessages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} content={msg.text} />
              ))}
            </div>

            {/* --- SPATIAL EXTRACTION LOADING INDICATOR --- */}
            {isSpatialAnalyzing && (
              <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-2xl text-cyan-300 text-xs font-medium animate-pulse my-3 shadow-md">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span>✨ MUSPARA AI Spatial Vision is analyzing your diagram...</span>
              </div>
            )}

            {/* General Chat Loading Indicator */}
            {isChatting && !isSpatialAnalyzing && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-medium animate-pulse ml-2 mt-4">
                <span>MUSPARA AI is processing...</span>
              </div>
            )}
          </div>
          
          {/* Chat Input Bar */}
          <div className="p-3 md:p-4 border-t border-slate-800 bg-slate-900 z-10 shadow-sm">
            <div className="flex gap-2 relative">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                placeholder="Ask a question about this page..." 
                className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-950 text-xs text-slate-100 placeholder-slate-500" 
              />
              <button 
                onClick={handleSendMessage} 
                disabled={isChatting || isSpatialAnalyzing || !chatInput.trim()} 
                className="px-5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 rounded-xl hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 font-extrabold text-xs transition-all shadow-md"
              >
                Send
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}