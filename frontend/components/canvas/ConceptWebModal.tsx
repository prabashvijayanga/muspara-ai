"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

interface ConceptWebModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: GraphNode[];
  edges: GraphEdge[];
  onDownloadNotes: () => void;
}

export default function ConceptWebModal({ isOpen, onClose, nodes, edges, onDownloadNotes }: ConceptWebModalProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Check if a node is connected to the currently hovered node
  const isNodeConnected = (nodeId: string) => {
    if (!hoveredNodeId) return true;
    if (hoveredNodeId === nodeId) return true;
    return edges.some(e => 
      (e.source === hoveredNodeId && e.target === nodeId) || 
      (e.target === hoveredNodeId && e.source === nodeId)
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
      
      {/* Modal Header */}
      <div className="p-6 flex justify-between items-center border-b border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <span className="text-3xl">🕸️</span> AI Concept Web & Smart Notes
          </h2>
          <p className="text-xs text-slate-400 mt-1">Explore interconnected knowledge nodes and structured study notes.</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onDownloadNotes} 
            className="px-5 py-2.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 rounded-xl font-extrabold transition-all flex items-center gap-2 border border-cyan-500/20 text-xs shadow-lg shadow-cyan-500/10"
          >
            📥 Download Notes (.md)
          </button>
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition-all text-xs border border-rose-500/20"
          >
            Close Web ✖
          </button>
        </div>
      </div>
      
      {/* Concept Web Cards Grid Container */}
      <div className="flex-1 overflow-auto p-6 sm:p-10 custom-scrollbar relative flex flex-wrap gap-8 justify-center content-start bg-slate-950/50">
        {nodes.length === 0 ? (
          <div className="text-cyan-400 text-center mt-20 text-xl animate-pulse font-medium">Extracting Knowledge Graph & Concepts...</div>
        ) : (
          nodes.map((node) => {
            const connected = isNodeConnected(node.id);
            return (
              <div 
                key={node.id}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`w-[400px] bg-slate-900 border rounded-3xl p-6 shadow-2xl transition-all duration-300 transform flex flex-col justify-between
                  ${connected ? 'scale-100 opacity-100 border-slate-800 shadow-cyan-500/5' : 'scale-95 opacity-30 blur-[2px]'}
                  ${hoveredNodeId === node.id ? 'scale-105 z-10 border-cyan-500 ring-2 ring-emerald-400/50 shadow-emerald-500/10' : 'z-0'}
                `}
              >
                <div>
                  {/* Node Title Header */}
                  <div className="text-base font-black text-white mb-4 border-b border-slate-800 pb-3 flex items-center justify-between">
                    <span>{node.label}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  </div>
                  
                  {/* Highly Readable Clean Markdown Typography for Card Content */}
                  <div className="prose prose-sm prose-invert text-slate-300 text-xs leading-relaxed mb-4 
                    prose-p:mb-3 prose-p:leading-relaxed 
                    prose-strong:text-cyan-400 prose-strong:font-bold 
                    prose-ul:my-2 prose-ul:pl-4 prose-li:mb-1.5 prose-li:marker:text-cyan-400">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {node.memorable_note}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Connections Footer */}
                {hoveredNodeId === node.id && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 animate-in fade-in duration-200">
                    <div className="text-[10px] font-extrabold text-emerald-400 mb-2 uppercase tracking-wider">Connected Relationships:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {edges.filter(e => e.source === node.id || e.target === node.id).map((e, idx) => {
                        const relatedNodeId = e.source === node.id ? e.target : e.source;
                        const relatedNode = nodes.find(n => n.id === relatedNodeId);
                        return (
                          <span key={idx} className="bg-emerald-500/10 text-emerald-300 text-[10px] px-2.5 py-1 rounded-lg font-semibold border border-emerald-500/20">
                            {e.relationship} ➔ {relatedNode?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}