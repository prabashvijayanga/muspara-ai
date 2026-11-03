"use client"; 

import React, { useState } from 'react';
import { uploadPdfToBackend } from '../lib/api-client';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (data: any) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  // State to hold the selected file
  const [file, setFile] = useState<File | null>(null);
  // State to show loading status while uploading
  const [isUploading, setIsUploading] = useState(false);

  // If the modal is not open, do not render anything
  if (!isOpen) return null;

  // Function to handle when a user selects a file from their device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Function to handle the upload button click
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Send the file to our FastAPI backend directly from the browser
      const result = await uploadPdfToBackend(file);
      
      // Pass the backend response (image URLs & data) back to CanvasBoard
      onUploadSuccess(result);
      
      // Close the modal popup upon success
      onClose();
    } catch (error) {
      alert("Error uploading file. Please check if the backend is running and CORS is configured.");
    } finally {
      setIsUploading(false);
      setFile(null); // Reset the file input
    }
  };

  return (
    // Background overlay (dims the screen with high-end glassmorphism)
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      
      {/* The actual modal box in Dark Slate & Cyan/Green theme */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
          <span>📁</span> Upload Document
        </h2>
        <p className="text-xs text-slate-400 mb-6">Upload your academic PDF to initialize spatial AI processing.</p>
        
        {/* File input field styled with Cyan & Green accents */}
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
          className="block w-full text-xs text-slate-300 mb-6
            file:mr-4 file:py-3 file:px-5
            file:rounded-xl file:border-0
            file:text-xs file:font-extrabold
            file:bg-cyan-500/10 file:text-cyan-400
            hover:file:bg-cyan-500/20 transition-all cursor-pointer border border-slate-800 rounded-2xl bg-slate-950 p-2"
        />
        
        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all font-bold text-xs border border-slate-700"
            disabled={isUploading}
          >
            Cancel
          </button>
          
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition-all disabled:opacity-40 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {isUploading ? <span className="animate-spin">⏳</span> : <span>🚀</span>}
            <span>{isUploading ? "Processing PDF..." : "Upload & Analyze"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}