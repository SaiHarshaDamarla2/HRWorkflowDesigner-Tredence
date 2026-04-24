import React, { useState } from 'react';
import { RotateCcw, RotateCw, Play, Download, Upload, AlertCircle } from 'lucide-react';
import { useStore } from 'zustand';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { WorkflowSandbox } from '../features/sandbox/WorkflowSandbox';
import { toast } from 'sonner';

export const Topbar = () => {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();

  // Access the temporal (history) store
  const { undo, redo, pastStates, futureStates } = useStore(useWorkflowStore.temporal, (state) => state);

  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  // BONUS: Export Workflow
  const handleExport = () => {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "workflow.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success('Workflow exported', {
            description: 'The JSON file has been downloaded.'
        });
    } catch {
        toast.error('Export failed');
    }
  };

  // BONUS: Import Workflow
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed.nodes && parsed.edges) {
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
          }
           toast.success('Workflow imported', {
            description: `Loaded ${parsed.nodes.length} nodes successfully.`
            });
        } catch (error) {
          console.error("Failed to import workflow JSON:", error); //For debugging purposes
          toast.error('Import failed', {
            description: 'Invalid workflow file format.'
          });
          alert("Invalid workflow file.");
        }
      };
    }
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-md">
            <AlertCircle size={18} className="text-white" />
          </div>
          <h1 className="font-bold text-slate-800 text-lg tracking-tight">Tredence HR WorkFlow Designer</h1>
        </div>

         {/* UNDO / REDO SECTION */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg gap-1">
          <button 
            onClick={() => undo()} 
            disabled={pastStates.length === 0}
            className="p-1.5 rounded hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            onClick={() => redo()} 
            disabled={futureStates.length === 0}
            className="p-1.5 rounded hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition" title="Export JSON">
            <Download size={18} />
          </button>
          
          <label className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition cursor-pointer" title="Import JSON">
            <Upload size={18} />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button 
            onClick={() => setIsSandboxOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
          >
            <Play size={16} />
            Test Workflow
          </button>
        </div>
      </header>
      
      {isSandboxOpen && <WorkflowSandbox onClose={() => setIsSandboxOpen(false)} />}
    </>
  );
};