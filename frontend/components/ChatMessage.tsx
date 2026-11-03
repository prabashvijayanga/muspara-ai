"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// We are using Lucide icons for a highly premium, modern aesthetic
import { Bot, User, Sparkles } from 'lucide-react';

// Define the expected properties for the chat message component
interface ChatMessageProps {
  role: 'user' | 'ai' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  // Check if the message is from the AI to determine styling and alignment
  const isAI = role === 'ai' || role === 'assistant';

  return (
    // Main container with smooth slide-in animation and alignment based on role
    <div className={`flex gap-4 w-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isAI ? 'justify-start' : 'justify-end'
    }`}>
      
      {/* ================= AI AVATAR ================= */}
      {isAI && (
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-sm relative group mt-1">
          <Bot className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          {/* Sparkle badge for that extra "AI Magic" feel */}
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-yellow-400" />
          </div>
        </div>
      )}

      {/* ================= MESSAGE BUBBLE ================= */}
      <div className={`relative max-w-[85%] sm:max-w-[90%] px-5 py-4 shadow-sm overflow-hidden ${
        isAI 
          // Premium Glassmorphism UI for AI Responses
          ? 'bg-white/95 backdrop-blur-md border border-gray-100/80 rounded-2xl rounded-tl-sm text-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)]' 
          // Vibrant Modern Gradient for User Messages
          : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-blue-500/25 shadow-lg'
      }`}>
        
        {/* Sender Name Identifier */}
        <div className={`font-bold text-[10px] uppercase tracking-wider mb-2 ${
          isAI ? 'text-blue-600 flex items-center gap-1' : 'text-blue-200 text-right block'
        }`}>
          {isAI ? 'Muse Spark AI' : 'You'}
        </div>
        
        {/* Content Rendering */}
        {isAI ? (
          /* 
             =========================================================
             ULTRA-PREMIUM TYPOGRAPHY & GRAPHIC ELEMENTS FOR AI REPLY
             =========================================================
             Wrapped inside an overflow-x-auto container so tables never bleed out
          */
          <div className="overflow-x-auto w-full custom-scrollbar">
            <div className="prose prose-sm md:prose-base max-w-none break-words
                          /* Paragraphs & Text */
                          prose-p:leading-relaxed prose-p:mb-4 prose-p:text-gray-700
                          prose-strong:text-blue-900 prose-strong:font-bold prose-strong:bg-blue-50 prose-strong:px-1 prose-strong:rounded
                          
                          /* Beautiful Headings with Bottom Borders */
                          prose-headings:text-blue-800 prose-headings:font-bold prose-headings:border-b prose-headings:border-blue-100 prose-headings:pb-2 prose-headings:mt-6 prose-headings:mb-4
                          
                          /* Graphical Blockquotes for Highlights */
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-blue-50 prose-blockquote:to-transparent prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:font-medium prose-blockquote:shadow-sm
                          
                          /* Premium Lists */
                          prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:pl-6 prose-li:mb-2 prose-li:text-gray-700
                          before:prose-li:absolute before:prose-li:left-0 before:prose-li:top-2 before:prose-li:w-2 before:prose-li:h-2 before:prose-li:bg-blue-400 before:prose-li:rounded-full
                          
                          /* Ultra-premium Markdown Table Styling */
                          prose-tables:w-full prose-tables:border-collapse prose-tables:my-6 
                          prose-tables:rounded-xl prose-tables:overflow-hidden prose-tables:shadow-sm 
                          prose-tables:ring-1 prose-tables:ring-gray-200
                          
                          prose-th:bg-gradient-to-r prose-th:from-gray-100 prose-th:to-blue-50/50 
                          prose-th:text-gray-800 prose-th:font-semibold prose-th:p-3 prose-th:text-left
                          
                          prose-td:p-3 prose-td:border-t prose-td:border-gray-100 prose-td:text-gray-700
                          hover:prose-tr:bg-blue-50/30 transition-colors">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          /* Standard text rendering for user inputs */
          <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed font-medium break-words">
            {content}
          </div>
        )}
      </div>

      {/* ================= USER AVATAR ================= */}
      {!isAI && (
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md border-2 border-white mt-1">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
      
    </div>
  );
}