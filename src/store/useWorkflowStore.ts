import { create } from 'zustand';
import { temporal } from 'zundo';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Connection, Edge, EdgeChange, Node, NodeChange } from 'reactflow';
import type { WorkflowState } from '../types/workflow';

const initialNodes: Node[] =[
  {
    id: 'start-1',
    type: 'start',
    position: { x: 250, y: 100 },
    data: { title: 'Workflow Start', metadata: [] },
  },
];

// Iteration-02: Added undo/redo feature
export const useWorkflowStore = create<WorkflowState>()(
  temporal((set, get) => ({
    nodes: initialNodes,
    edges: [],
    selectedNode: null,

    onNodesChange: (changes: NodeChange[]) => {
      set({ nodes: applyNodeChanges(changes, get().nodes) });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      set({ edges: applyEdgeChanges(changes, get().edges) });
    },

    onConnect: (connection: Connection) => {
      set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
    },

    addNode: (node: Node) => {
      set({ nodes: [...get().nodes, node] });
    },

    updateNodeData: (nodeId: string, data: Record<string, unknown>) => {
      set({
        nodes: get().nodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        ),
      });
      const currentSelected = get().selectedNode;
      if (currentSelected?.id === nodeId) {
        set({ selectedNode: { ...currentSelected, data: { ...currentSelected.data, ...data } } });
      }
    },

    setSelectedNode: (node: Node | null) => {
      set({ selectedNode: node });
    },

    deleteNode: (nodeId: string) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== nodeId),
        edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
      });
    },

    setNodes: (nodes: Node[]) => set({ nodes }),
    setEdges: (edges: Edge[]) => set({ edges }),
  }), 
  {
    // Only track nodes and edges to keep history clean
    partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
    limit: 50, // Keep last 50 actions
  })
);
 
// -- Iteration-01
// export const useWorkflowStore = create<WorkflowState>((set, get) => ({
//   nodes: initialNodes,
//   edges: [],
//   selectedNode: null,

//   onNodesChange: (changes: NodeChange[]) => {
//     set({ nodes: applyNodeChanges(changes, get().nodes) });
//   },

//   onEdgesChange: (changes: EdgeChange[]) => {
//     set({ edges: applyEdgeChanges(changes, get().edges) });
//   },

//   onConnect: (connection: Connection) => {
//     set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
//   },

//   addNode: (node: Node) => {
//     set({ nodes: [...get().nodes, node] });
//   },

//   updateNodeData: (nodeId: string, data: Record<string, unknown>) => {
//     set({
//       nodes: get().nodes.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
//       ),
//     });
    
//     const currentSelected = get().selectedNode;
//     if (currentSelected?.id === nodeId) {
//       set({ selectedNode: { ...currentSelected, data: { ...currentSelected.data, ...data } } });
//     }
//   },

//   setSelectedNode: (node: Node | null) => {
//     set({ selectedNode: node });
//   },

//   deleteNode: (nodeId: string) => {
//     set({
//       nodes: get().nodes.filter((node) => node.id !== nodeId),
//       edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
//       selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
//     });
//   },

//   setNodes: (nodes: Node[]) => set({ nodes }),
//   setEdges: (edges: Edge[]) => set({ edges }),
// }));