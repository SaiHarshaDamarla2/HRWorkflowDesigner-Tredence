import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { mockApi } from '../../api/mock';
import { toast } from 'sonner';

interface SandboxProps {
  onClose: () => void;
}

export const WorkflowSandbox = ({ onClose }: SandboxProps) => {
  const { nodes, edges } = useWorkflowStore();
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
// ------------ V-0
//   useEffect(() => {
//     const runSimulation = async () => {
//       setStatus('running');
//       try {
//         const resultLogs = await mockApi.simulateWorkflow(nodes, edges);
//         setLogs(resultLogs);
//         setStatus('success');
//       } catch (err: any) {
//         setErrorMsg(err.message);
//         setStatus('error');
//       }
//     };

//     runSimulation();
//   }, [nodes, edges]);
useEffect(() => {
    const runSimulation = async () => {
      setStatus('running');
      try {
        const resultLogs = await mockApi.simulateWorkflow(nodes, edges);
        setLogs(resultLogs);
        setStatus('success');
        toast.success('Simulation complete', {
            description: 'The workflow graph was validated successfully.'
        });
      } catch (err: unknown) {
        // Safely handle the 'unknown' error type
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("An unexpected error occurred during simulation.");
        }
        setStatus('error');
        toast.error('Simulation failed', {
            description: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    };

    runSimulation();
  }, [nodes, edges]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Sandbox Execution</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {status === 'running' && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Simulating workflow execution...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3 text-red-700">
              <AlertTriangle className="shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-sm">Validation Failed</h4>
                <p className="text-sm mt-1">{errorMsg}</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {logs.map((log, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                    <p className="text-sm text-slate-700 font-medium">{log}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};