import React from 'react';
import { Cpu, Layers, MousePointer2 } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';

export const Footer = () => {
  const { nodes, edges } = useWorkflowStore();

  return (
    <footer className="h-8 bg-slate-900 text-slate-400 px-4 flex items-center justify-between text-[11px] font-medium shrink-0 z-20">
      {/* Left Side: System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 border-r border-slate-700 pr-4">
          <Cpu size={12} className="text-green-500" />
          <span className="uppercase tracking-wider">Engine: React Flow v11</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Layers size={12} /> {nodes.length} Nodes
          </span>
          <span className="flex items-center gap-1">
            <MousePointer2 size={12} /> {edges.length} Connections
          </span>
        </div>
      </div>

      {/* Middle Side: Project Attribution */}
      <div className="hidden md:block text-slate-500 italic">
        HR Workflow Designer — Built for Tredence Studio
      </div>

      {/* Right Side: Personal Branding */}
      <div className="flex items-center gap-4">
        <span className="text-slate-300">Developed by <span className="font-bold text-white">D. Sai Harsha</span></span>
        <span>2026. All Rights Reserved.</span>
      </div>
    </footer>
  );
};