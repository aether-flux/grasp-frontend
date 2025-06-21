'use client';

import React, { useCallback, useEffect } from 'react';
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

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      onNodeClick={(_, node) => onNodeClick(node.id, node.data.label)}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}

