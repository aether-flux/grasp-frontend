'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Node,
  Edge,
} from 'reactflow';

import 'reactflow/dist/style.css';

export default function SyllabusNodes({
  nodesData,
  edgesData,
  onNodeClick,
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    setNodes(nodesData);
  }, [nodesData, setNodes]);

  useEffect(() => {
    setEdges(edgesData);
  }, [edgesData, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getNodeLevel = (nodeId) => {
    const incomingEdges = edges.filter(edge => edge.target === nodeId);
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    
    if (incomingEdges.length === 0 && outgoingEdges.length > 0) {
      return 'top'; // Root nodes
    } else if (outgoingEdges.length === 0) {
      return 'leaf'; // Leaf nodes
    } else {
      return 'mid'; // Middle nodes
    }
  };

  const getNodeStyle = (nodeId) => {
    const level = getNodeLevel(nodeId);
    const isSelected = selectedNodeId === nodeId;
    
    let baseClasses = 'px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200 ';
    
    // Level-based styling
    switch (level) {
      case 'top':
        baseClasses += 'bg-indigo-100 border-indigo-400 text-indigo-800 ';
        break;
      case 'mid':
        baseClasses += 'bg-purple-100 border-purple-400 text-purple-800 ';
        break;
      case 'leaf':
        baseClasses += 'bg-white border-gray-300 text-gray-800 ';
        break;
    }
    
    // Selection styling
    if (isSelected) {
      baseClasses += 'shadow-lg ring-2 ring-blue-500/50 ';
    }
    
    return baseClasses;
  };

  const styledNodes = nodes.map(node => ({
    ...node,
    style: {
      ...node.style,
      border: 'none',
      background: 'transparent',
      padding: 0,
    },
    data: {
      ...node.data,
      label: (
        <div className={getNodeStyle(node.id)}>
          {node.data.label}
        </div>
      ),
    },
  }));

  const handleNodeClick = (event, node) => {
    setSelectedNodeId(node.id);
    onNodeClick(node.id, node.data.label);
  };

  return (
    // <ReactFlow
    //   nodes={nodes}
    //   edges={edges}
    //   onNodesChange={onNodesChange}
    //   onEdgesChange={onEdgesChange}
    //   onConnect={onConnect}
    //   fitView
    //   onNodeClick={(_, node) => onNodeClick(node.id, node.data.label)}
    // >
    <ReactFlow
      nodes={styledNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      onNodeClick={handleNodeClick}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}

