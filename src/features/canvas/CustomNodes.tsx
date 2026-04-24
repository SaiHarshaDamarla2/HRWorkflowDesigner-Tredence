import { Handle, Position, type NodeProps } from 'reactflow';
import { Play, CheckSquare, UserCheck, Settings, Square } from 'lucide-react';

// Common wrapper for clean UI
const NodeWrapper = ({ children, selected, borderColor }: { children: React.ReactNode, selected: boolean, borderColor: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border-2 transition-all ${selected ? borderColor : 'border-slate-200'} min-w-[200px]`}>
    {children}
  </div>
);

export const StartNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper selected={selected} borderColor="border-green-500 shadow-green-100">
    <div className="p-3 flex items-center gap-3">
      <div className="bg-green-100 p-2 rounded-md text-green-600"><Play size={16} /></div>
      <div className="font-semibold text-slate-700 text-sm">{data.title || 'Start'}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500" />
  </NodeWrapper>
);

export const TaskNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper selected={selected} borderColor="border-blue-500 shadow-blue-100">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
    <div className="p-3 flex items-center gap-3">
      <div className="bg-blue-100 p-2 rounded-md text-blue-600"><CheckSquare size={16} /></div>
      <div className="font-semibold text-slate-700 text-sm">{data.title || 'Task'}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400" />
  </NodeWrapper>
);

export const ApprovalNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper selected={selected} borderColor="border-orange-500 shadow-orange-100">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
    <div className="p-3 flex items-center gap-3">
      <div className="bg-orange-100 p-2 rounded-md text-orange-600"><UserCheck size={16} /></div>
      <div className="font-semibold text-slate-700 text-sm">{data.title || 'Approval'}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400" />
  </NodeWrapper>
);

export const AutomatedNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper selected={selected} borderColor="border-purple-500 shadow-purple-100">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
    <div className="p-3 flex items-center gap-3">
      <div className="bg-purple-100 p-2 rounded-md text-purple-600"><Settings size={16} /></div>
      <div className="font-semibold text-slate-700 text-sm">{data.title || 'Automated Step'}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400" />
  </NodeWrapper>
);

export const EndNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper selected={selected} borderColor="border-red-500 shadow-red-100">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
    <div className="p-3 flex items-center gap-3">
      <div className="bg-red-100 p-2 rounded-md text-red-600"><Square size={16} /></div>
      <div className="font-semibold text-slate-700 text-sm">{data.title || 'End'}</div>
    </div>
  </NodeWrapper>
);

