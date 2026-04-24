import type { Node, Edge } from 'reactflow';

export interface ActionDef {
  id: string;
  label: string;
  params: string[];
}

// --- Future Scope 
// helper to find params for a specific action
// export const getActionParams = async (actionId: string): Promise<string[]> => {
//   const actions = await mockApi.getAutomations();
//   return actions.find(a => a.id === actionId)?.params || [];
// };

// ------ Future Scope 
// const validateGraph = (nodes: Node[], edges: Edge[]) => {
//   const startNodes = nodes.filter(n => n.type === 'start');
//   if (startNodes.length === 0) throw new Error("Workflow missing! Please add a Start Node.");
//   if (startNodes.length > 1) throw new Error("Multiple Start Nodes detected! Workflows must have exactly one entry point.");
  
//   const endNodes = nodes.filter(n => n.type === 'end');
//   if (endNodes.length === 0) throw new Error("No End Node found! The workflow will never complete.");

//   // Check for dangling nodes (logical validation)
//   nodes.forEach(node => {
//     const isConnected = edges.some(e => e.source === node.id || e.target === node.id);
//     if (!isConnected) {
//       throw new Error(`Node "${node.data?.title || node.id}" is not connected to any other node.`);
//     }
//   });
// };

export const mockApi = {
  // GET /automations
  getAutomations: async (): Promise<ActionDef[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "send_email", label: "Send Email", params: ["to", "subject"] },
          { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] }
        ]);
      }, 300);
    });
  },

  // POST /simulate
  simulateWorkflow: async (nodes: Node[], edges: Edge[]): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 1. Validation: Check if there's a start node
        const startNode = nodes.find(n => n.type === 'start');
        if (!startNode) {
          return reject(new Error("Workflow must contain a Start Node."));
        }

        // 2. Execution Log Generation
        const executionLog: string[] = [];
        let currentNode: Node | undefined = startNode;
        let stepCount = 1;
        const visitedNodes = new Set<string>();

        // A basic graph traversal simulating step-by-step execution
        while (currentNode) {
          if (visitedNodes.has(currentNode.id)) {
            return reject(new Error("Cycle detected! Workflow execution halted to prevent infinite loop."));
          }
          visitedNodes.add(currentNode.id);

          // FIX: Use a fallback for type and title to satisfy strict null checks
          const typeLabel = (currentNode.type ?? 'node').toUpperCase();
          const titleLabel = (currentNode.data?.title as string) ?? 'Untitled';

          executionLog.push(`[Step ${stepCount}]: Executed ${typeLabel} - "${titleLabel}"`);
          
          const outgoingEdge = edges.find(e => e.source === currentNode?.id);
          
          if (!outgoingEdge) {
            // Check if it's the official end node
            if (currentNode.type !== 'end') {
              executionLog.push(`⚠️ Warning: Workflow ended abruptly at "${titleLabel}". No connection to an End Node.`);
            } else {
              executionLog.push("✅ Workflow completed successfully.");
            }
            break;
          }

          const nextNode = nodes.find(n => n.id === outgoingEdge.target);
          
          if (!nextNode) {
            executionLog.push(`❌ Error: Broken connection. Node "${outgoingEdge.target}" not found.`);
            break;
          }

          currentNode = nextNode;
          stepCount++;

          if (stepCount > 50) {
             return reject(new Error("Workflow too long. Simulation capped at 50 steps."));
          }
        }
        // while (currentNode) {
        //   if (visitedNodes.has(currentNode.id)) {
        //     return reject(new Error("Cycle detected! Workflow execution halted to prevent infinite loop."));
        //   }
        //   visitedNodes.add(currentNode.id);

        //   executionLog.push(`[Step ${stepCount}]: Executed ${currentNode.type.toUpperCase()} - "${currentNode.data.title || 'Untitled'}"`);
          
        //   const outgoingEdge = edges.find(e => e.source === currentNode?.id);
          
        //   if (!outgoingEdge) {
        //     if (currentNode.type !== 'end') {
        //       executionLog.push(`⚠️ Warning: Workflow ended abruptly at "${currentNode.data.title}". No connection to an End Node.`);
        //     } else {
        //       executionLog.push("✅ Workflow completed successfully.");
        //     }
        //     break;
        //   }

        //   currentNode = nodes.find(n => n.id === outgoingEdge.target);
        //   stepCount++;

        //   if (stepCount > 50) {
        //      return reject(new Error("Workflow too long. Simulation capped at 50 steps."));
        //   }
        // }

        resolve(executionLog);
      }, 800);
    });
  }
};