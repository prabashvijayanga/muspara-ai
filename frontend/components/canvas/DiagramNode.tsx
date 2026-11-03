import React from 'react';
import { Handle, Position } from 'reactflow';

interface DiagramNodeData {
  imageUrl: string;
  label: string;
}

export default function DiagramNode({ data }: { data: DiagramNodeData }) {
  return (
    // INCREASED WIDTH: Fixed to 450px to make it massive and utilize screen width perfectly
    <div className="group bg-white p-5 rounded-3xl shadow-xl border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/30 transition-all duration-300 w-[450px]">
      
      {/* Top Handle for Edges */}
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-blue-600 border-none" />
      
      <div className="flex flex-col items-center cursor-pointer">
        {/* Larger, bolder label for professional view */}
        <span className="text-lg text-gray-800 font-extrabold mb-4 tracking-wide">{data.label}</span>
        
        {/* Image Container with inner shadow for depth */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner">
          <img 
            src={data.imageUrl} 
            alt="Extracted Document Page" 
            // INCREASED HEIGHT: Allows the page to be extremely readable by default (max 650px)
            className="w-full h-auto max-h-[650px] object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          />
          
          {/* Premium Hover Overlay for Study Mode */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full text-blue-700 font-bold text-base shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
              <span>🔍</span> Click to Open Study Mode
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Handle for Edges */}
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-blue-600 border-none" />
    </div>
  );
}