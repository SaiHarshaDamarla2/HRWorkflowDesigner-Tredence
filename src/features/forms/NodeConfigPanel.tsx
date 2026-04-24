import { useEffect } from 'react';
import { useForm} from 'react-hook-form';
import { X, Save, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { toast } from 'sonner';



export const NodeConfigPanel = () => {
  const { selectedNode, updateNodeData, setSelectedNode, deleteNode } = useWorkflowStore();
  
  // Initialize React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Reset form with selected node's data whenever the selected node changes
  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode.data);
    }
  },[selectedNode, reset]);

  if (!selectedNode) return null; // Hide panel if no node is selected

  const onSubmit = (data: Record<string, unknown>) => {
    updateNodeData(selectedNode.id, data);
    toast.success('Configuration saved', {
    description: `Changes to ${selectedNode.type} node applied successfully.`
  });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this node? This will also remove any connected edges.")) {
        const type = selectedNode.type;
        deleteNode(selectedNode.id);
        toast.error('Node deleted', {
        description: `${type} node has been removed from the workflow.`
        });
    }
  };

  return (
    <aside className="w-80 border-l border-slate-200 bg-white h-full flex flex-col shadow-xl z-10 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-800 uppercase">
          Configure {selectedNode.type} Node
        </h2>
        <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded">
          <X size={18} />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4 flex-grow overflow-y-auto">
        
        {/* COMMON FIELD: Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-600">Node Title <span className="text-red-500">*</span></label>
          <input 
            {...register('title', { required: 'Title is required' })}
            className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
            placeholder="e.g., Document Review"
          />
          {errors.title && <span className="text-[10px] text-red-500 font-medium">{errors.title.message?.toString()}</span>}
        </div>

        {/* DYNAMIC FIELDS based on Node Type */}
        {selectedNode.type === 'task' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">Description</label>
              <textarea {...register('description')} className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-primary" rows={3} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">Assignee</label>
              <input {...register('assignee')} className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-primary" placeholder="e.g., hr-admin@company.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">Due Date</label>
              <input type="date" {...register('dueDate')} className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-primary" />
            </div>
          </>
        )}

        {selectedNode.type === 'approval' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">Approver Role</label>
              <select {...register('approverRole')} className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white">
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">Auto-approve Threshold</label>
              <input type="number" {...register('autoApproveThreshold')} className="w-full text-sm border border-slate-300 rounded-md p-2" placeholder="e.g., 5 days" />
            </div>
          </>
        )}

        {selectedNode.type === 'automated' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">Action Type</label>
              <select {...register('action')} className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white">
                <option value="send_email">Send Email</option>
                <option value="generate_doc">Generate Document</option>
              </select>
            </div>
          </>
        )}

        {selectedNode.type === 'end' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">End Message</label>
              <input {...register('endMessage')} className="w-full text-sm border border-slate-300 rounded-md p-2" placeholder="Workflow completed." />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" {...register('summaryFlag')} id="summaryFlag" className="w-4 h-4 text-primary" />
              <label htmlFor="summaryFlag" className="text-sm text-slate-700">Generate Summary Report</label>
            </div>
          </>
        )}

         {/* Action Buttons */}
        <div className="mt-auto pt-6 space-y-3">
          <button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <Save size={16} /> Save Changes
          </button>

          {/* Delete button */}
          {/* You can also use the backspace key to delete a particular node */}
          <div className="pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={handleDelete}
              className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all group"
            >
              <Trash2 size={16} className="group-hover:shake" /> Delete Node
            </button>
          </div>
        </div>
      </form>
    </aside>
  );
};