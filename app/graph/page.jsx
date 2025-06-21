"use client";

import { useSyllabusStore } from "@/lib/store/useSyllabusStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useUser } from "@civic/auth/react";
import SyllabusNodes from "../_components/SyllabusNodes";
import { useState, useEffect } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle
} from 'react-resizable-panels';
import 'react-resizable-panels';

const syllabusA = {
  nodes: [
    { id: 'root', data: { label: '🧠 Syllabus A' }, position: { x: 300, y: 50 } },
    { id: 'a1', data: { label: '📘 Module A1' }, position: { x: 100, y: 200 } },
    { id: 'a2', data: { label: '📘 Module A2' }, position: { x: 500, y: 200 } },
  ],
  edges: [
    { id: 'e-root-a1', source: 'root', target: 'a1', type: 'smoothstep' },
    { id: 'e-root-a2', source: 'root', target: 'a2', type: 'smoothstep' },
  ]
};

// 🧠 Dummy graph 2
const syllabusB = {
  nodes: [
    { id: 'rootB', data: { label: '🧠 Syllabus B' }, position: { x: 300, y: 50 } },
    { id: 'b1', data: { label: '📘 Module B1' }, position: { x: 100, y: 200 } },
    { id: 'b2', data: { label: '📘 Module B2' }, position: { x: 500, y: 200 } },
  ],
  edges: [
    { id: 'e-rootB-b1', source: 'rootB', target: 'b1', type: 'smoothstep' },
    { id: 'e-rootB-b2', source: 'rootB', target: 'b2', type: 'smoothstep' },
  ]
};

const graphs = {
  A: syllabusA,
  B: syllabusB,
};

export default function GraphPage() {
  const [selectedGraphKey, setSelectedGraphKey] = useState('A');
  const [sidePanel, setSidePanel] = useState(null);
  const { user } = useUser();

  if (!user) return <p>Not logged in!</p>
  
  console.log(user);

  let selectedGraph = graphs[selectedGraphKey];

  useEffect(() => {
    selectedGraph = graphs[selectedGraphKey];
  }, [selectedGraphKey]);

   return (
   <PanelGroup direction="horizontal" className="w-full h-screen">
      {/* Left Sidebar Panel */}
      <Panel defaultSize={20} minSize={10} maxSize={30} className="bg-gray-100 border-r border-gray-300">
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">📚 Syllabi</h2>
          <h4 className="font-medium text-md mb-8">Welcome, {user.email}!</h4>
          {Object.keys(graphs).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedGraphKey(key)}
              className={`block w-full text-left px-3 py-2 mb-2 rounded ${
                selectedGraphKey === key ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              Syllabus {key}
            </button>
          ))}
        </div>
      </Panel>

      <PanelResizeHandle className="w-4 flex items-center justify-center cursor-col-resize group transition-all duration-100 hover:bg-blue-500/10">
        <div className="space-y-1">
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
        </div>
      </PanelResizeHandle>

      {/* Graph Panel */}
      <Panel minSize={30} className="relative bg-white">
        <SyllabusNodes
          nodesData={selectedGraph.nodes}
          edgesData={selectedGraph.edges}
          onNodeClick={(id, label) => setSidePanel({ id, label })}
        />
      </Panel>

      <PanelResizeHandle className="w-4 flex items-center justify-center cursor-col-resize group transition-all duration-100 hover:bg-blue-500/10">
        <div className="space-y-1">
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
        </div>
      </PanelResizeHandle>

      {/* Right Sidebar Panel */}
      <Panel defaultSize={25} minSize={15} maxSize={35} className="bg-white border-l border-gray-300">
        {sidePanel ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{sidePanel.label}</h3>
              <button onClick={() => setSidePanel(null)} className="text-gray-600 hover:text-black">
                ✖
              </button>
            </div>
            <p className="text-sm text-gray-700">
              Info for <strong>{sidePanel.label}</strong> will be shown here. Gemini ELI5, flashcard generation, etc.
            </p>
          </div>
        ) : (
          <div className="p-4 text-gray-400 italic">Click a node to see its details</div>
        )}
      </Panel>
    </PanelGroup>
  );
}

// export default function GraphPage () {
//   const elaboratedText = useSyllabusStore((state) => state.elaboratedText);
//
//   return (
//     <div className="min-h-screen bg-white px-6 py-10 text-gray-800">
//       <h1 className="text-2xl font-bold mb-6 text-center">🧠 Elaborated Syllabus</h1>
//
//       <div className="prose prose-lg max-w-4xl mx-auto whitespace-pre-wrap">
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//           {elaboratedText}
//         </ReactMarkdown>
//       </div>
//     </div>
//   );
// }
