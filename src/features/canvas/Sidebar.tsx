import React, {useState} from 'react';
import { Play, CheckSquare, UserCheck, Settings, Square, Search} from 'lucide-react';
import type { NodeType } from '../../types/workflow';

const nodeDraggables: { type: NodeType; label: string; icon: React.ReactNode; color: string }[] =[
  { type: 'start', label: 'Start Node', icon: <Play size={18} />, color: 'text-green-600 bg-green-100' },
  { type: 'task', label: 'Task Node', icon: <CheckSquare size={18} />, color: 'text-blue-600 bg-blue-100' },
  { type: 'approval', label: 'Approval Node', icon: <UserCheck size={18} />, color: 'text-orange-600 bg-orange-100' },
  { type: 'automated', label: 'Automated Step', icon: <Settings size={18} />, color: 'text-purple-600 bg-purple-100' },
  { type: 'end', label: 'End Node', icon: <Square size={18} />, color: 'text-red-600 bg-red-100' },
];

export const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Filter nodes based on search term
  const filteredNodes = nodeDraggables.filter(node => 
    node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Iteration-02: Added Search Feature
    <aside className="w-64 border-r border-slate-200 bg-white p-4 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Workflow Nodes</h2>
        <p className="text-xs text-slate-500">Drag and drop nodes onto the canvas.</p>
      </div>

      {/* SEARCH INPUT */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={14} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto">
        {filteredNodes.length > 0 ? (
          filteredNodes.map((item) => (
            <div
              key={item.type}
              onDragStart={(e) => onDragStart(e, item.type)}
              draggable
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-primary/50 hover:bg-slate-50 transition-all group shadow-sm hover:shadow-md"
            >
              <div className={`p-2 rounded-lg transition-colors ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
                {item.label}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 italic">No nodes matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2">
        <div className="bg-slate-100 p-1 rounded-full text-slate-400">
           <Search size={12} />
        </div>
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
           Ver 1.0.0
        </span>
      </div>
    </aside>
    // --Iteration-01
    // <aside className="w-64 border-r border-slate-200 bg-white p-4 h-full flex flex-col">
    //   <h2 className="text-lg font-bold text-slate-800 mb-4">Workflow Nodes</h2>
    //   <p className="text-xs text-slate-500 mb-4">Drag and drop nodes onto the canvas.</p>
      
    //   <div className="flex flex-col gap-3">
    //     {nodeDraggables.map((item) => (
    //       <div
    //         key={item.type}
    //         onDragStart={(e) => onDragStart(e, item.type)}
    //         draggable
    //         className="flex items-center gap-3 p-3 border border-slate-200 rounded-md cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-colors"
    //       >
    //         <div className={`p-1.5 rounded-md ${item.color}`}>{item.icon}</div>
    //         <span className="text-sm font-medium text-slate-700">{item.label}</span>
    //       </div>
    //     ))}
    //   </div>
    // </aside>
  );
};