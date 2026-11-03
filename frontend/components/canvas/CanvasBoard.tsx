"use client";

import React, { useState, useEffect } from 'react';
import UploadModal from '../upload-modal';
import Header from '../layout/Header';
import ConceptWebModal from './ConceptWebModal';
import StudyModeModal from './StudyModeModal';

// Ensure the backend URL is formatted correctly for direct client-to-server API calls
const rawBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
const BACKEND_BASE_URL = rawBaseUrl.replace(/\/$/, "");

interface PageNode {
  id: string;
  imageUrl: string;
  label: string;
  selected?: boolean;
  difficulty?: { level: string; score: number; reason: string; };
}

interface GraphNode {
  id: string;
  label: string;
  memorable_note: string;
}

interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export default function CanvasBoard() {
  // --- STATES ---
  const [pages, setPages] = useState<PageNode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  // Concept Web States
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);

  // --- HANDLERS ---
  const handleUploadSuccess = (data: any) => {
    const newPages: PageNode[] = data.nodes_data.map((node: any) => ({
      id: node.id,
      imageUrl: `${BACKEND_BASE_URL}${node.imageUrl}`,
      label: node.label,
      selected: false,
      difficulty: node.difficulty
    }));
    setPages(newPages);
  };

  const selectedIndex = pages.findIndex(p => p.selected);
  const selectedPage = selectedIndex !== -1 ? pages[selectedIndex] : undefined;

  // Reset chat when switching pages
  useEffect(() => {
    setChatMessages([]);
  }, [selectedPage?.id]);

  const handlePrevPage = () => {
    if (selectedIndex > 0) {
      setPages(pgs => pgs.map((p, i) => ({ ...p, selected: i === selectedIndex - 1 })));
    }
  };

  const handleNextPage = () => {
    if (selectedIndex < pages.length - 1) {
      setPages(pgs => pgs.map((p, i) => ({ ...p, selected: i === selectedIndex + 1 })));
    }
  };

  // Handle Chat API requests
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedPage) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsChatting(true);
    
    try {
      const formData = new FormData();
      formData.append("image_url", selectedPage.imageUrl);
      formData.append("message", userMsg);
      
      const response = await fetch(`${BACKEND_BASE_URL}/api/chat`, { method: "POST", body: formData });
      const result = await response.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: result.reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI Tutor." }]);
    } finally {
      setIsChatting(false);
    }
  };

  // --- KNOWLEDGE GRAPH LOGIC ---
  const handleGenerateConceptWeb = async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    try {
      const pageIds = pages.map(p => p.id);
      const response = await fetch(`${BACKEND_BASE_URL}/api/knowledge-graph`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_ids: pageIds })
      });
      const result = await response.json();
      setGraphNodes(result.nodes || []);
      setGraphEdges(result.edges || []);
      setIsGraphOpen(true);
    } catch (error) {
      alert("Failed to generate Concept Web.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- DOWNLOAD NOTES (.md) ---
  const handleDownloadNotes = () => {
    let content = "# 🕸️ MUSPARA AI - Concept Web & Smart Notes\n\n";
    
    graphNodes.forEach(node => {
      content += `## ${node.label}\n\n${node.memorable_note}\n\n`;
      
      const related = graphEdges.filter(e => e.source === node.id || e.target === node.id);
      if (related.length > 0) {
        content += `**Connections:**\n`;
        related.forEach(e => {
          const targetId = e.source === node.id ? e.target : e.source;
          const targetNode = graphNodes.find(n => n.id === targetId);
          content += `- *${e.relationship}* ➔ ${targetNode?.label}\n`;
        });
        content += `\n`;
      }
      content += `---\n\n`;
    });
    
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MUSPARA_Smart_Notes.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col relative overflow-hidden text-slate-100">
      
      {/* Top Header Component */}
      <Header 
        onUploadClick={() => setIsModalOpen(true)}
        onGenerateGuideClick={handleGenerateConceptWeb}
        isProcessing={isProcessing}
        isActionDisabled={isProcessing || pages.length === 0}
      />

      {/* Main Document Grid View Container */}
      <div className="flex-1 w-full h-full overflow-y-auto bg-slate-900/50 custom-scrollbar p-4 md:p-8">
        {pages.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
            <span className="text-6xl mb-4">📄</span>
            <h2 className="text-2xl font-bold text-slate-300">No Document Uploaded</h2>
            <p className="text-xs text-slate-500 mt-2">Upload a PDF document to initialize spatial analysis.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 max-w-[1800px] mx-auto pb-20">
            {pages.map((page, index) => {
              const difficultyColor = 
                page.difficulty?.level === 'Hard' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                page.difficulty?.level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                
              const borderGlow = page.difficulty?.level === 'Hard' ? 'hover:border-rose-500 hover:shadow-rose-500/20' : 'hover:border-cyan-500 hover:shadow-cyan-500/20';

              return (
                <div key={page.id} onClick={() => setPages(pgs => pgs.map((p, i) => ({ ...p, selected: i === index })))} className={`group bg-slate-900 p-5 rounded-3xl shadow-xl hover:shadow-2xl border border-slate-800 transition-all duration-300 cursor-pointer flex flex-col items-center relative ${borderGlow}`}>
                  
                  {page.difficulty && (
                    <div title={page.difficulty.reason} className={`absolute -top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm flex items-center gap-1 z-10 ${difficultyColor}`}>
                      {page.difficulty.level === 'Hard' ? '🔥 Hard' : page.difficulty.level === 'Medium' ? '⚡ Medium' : '🌱 Easy'}
                    </div>
                  )}
                  
                  <span className="text-sm text-slate-200 font-extrabold mb-4 mt-2 tracking-wide text-center">{page.label}</span>
                  
                  <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={page.imageUrl} alt={page.label} className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
                    
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 px-6 py-3 rounded-full font-extrabold text-xs shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
                        <span>🔍</span> Open Study Mode
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modular Concept Web Modal Component */}
      <ConceptWebModal 
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
        nodes={graphNodes}
        edges={graphEdges}
        onDownloadNotes={handleDownloadNotes}
      />

      {/* Modular Study Mode & Magic Wand Modal Component */}
      <StudyModeModal 
        selectedPage={selectedPage}
        pages={pages}
        selectedIndex={selectedIndex}
        onClose={() => setPages(pgs => pgs.map(p => ({ ...p, selected: false })))}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleSendMessage={handleSendMessage}
        isChatting={isChatting}
        BACKEND_BASE_URL={BACKEND_BASE_URL}
        setChatMessages={setChatMessages}
      />

      {/* Upload Modal */}
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}