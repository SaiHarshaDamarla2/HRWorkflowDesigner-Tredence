import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  
  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  setSelectedNode: (node: Node | null) => void;
  deleteNode: (nodeId: string) => void;
  //   For Sandbox
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}