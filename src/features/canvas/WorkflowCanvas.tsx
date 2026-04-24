import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, type ReactFlowInstance } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { useWorkflowStore } from '../../store/useWorkflowStore';
// import { nodeTypes } from './CustomNodes';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from './CustomNodes';
import type { NodeType } from '../../types/workflow';
import type { Node } from 'reactflow';

// Map node types for React Flow
const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

const WorkflowCanvasCore = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const[reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  // Zustand Store
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setSelectedNode, selectedNode } = useWorkflowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  },[]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (typeof type === 'undefined' || !type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}` },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
        if (selectedNode && deletedNodes.some((n) => n.id === selectedNode.id)) {
        setSelectedNode(null);
        }
    },
    [selectedNode, setSelectedNode]
    );


  // A helper function to map types to colors for a better UX to identify from the minmiap itslef
  // that what nodes are being used.
    const getMiniMapNodeColor = (node: Node) => {
    switch (node.type) {
        case 'start':
        return '#22c55e'; // green-500
        case 'task':
        return '#3b82f6'; // blue-500
        case 'approval':
        return '#f97316'; // orange-500
        case 'automated':
        return '#a855f7'; // purple-500
        case 'end':
        return '#ef4444'; // red-500
        default:
        return '#cbd5e1'; // slate-300
    }
    };

  return (
    <div className="flex-grow h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete} 
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        fitView
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
      {/* Customizing minimap for a better UX i.e. making the nodes particular in the minimap */}
      <MiniMap 
        nodeColor={getMiniMapNodeColor} // <--- ADD THIS LINE
        nodeStrokeWidth={3} 
        zoomable 
        pannable 
        maskColor="rgba(241, 245, 249, 0.7)" // Optional: Makes the mask look cleaner
        style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
        }}
      />
    </div>
  );
};

export const WorkflowCanvas = () => (
  <ReactFlowProvider>
    <WorkflowCanvasCore />
  </ReactFlowProvider>
);