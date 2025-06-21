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
import { useExplanationStore } from "@/lib/store/useExplanationStore";

export default function GraphPage() {
  const [sidePanel, setSidePanel] = useState(null);
  const { user } = useUser();

  const contentJson = useSyllabusStore((state) => state.elaboratedText);
  console.log("Content: ", contentJson);

  function convertToReactFlowFormat(raw) {
    const nodes = [];
    const edges = [];

    // Root node
    const rootId = 'root';
    const rootLabel = raw['1']?.title || 'Untitled Syllabus';
    nodes.push({
      id: rootId,
      data: { label: '🧠 ' + rootLabel },
      position: { x: 300, y: 50 },
    });

    const topLevel = raw['2'] || [];
    const secondLevel = raw['3'] || [];

    // Track positions
    const spacingX = 250;
    const spacingY = 150;

    topLevel.forEach((module, idx) => {
      const modId = module._id;
      const modLabel = '📘 ' + module.title;

      nodes.push({
        id: modId,
        data: { label: modLabel },
        position: {
          x: 100 + idx * spacingX,
          y: 200,
        },
      });

      edges.push({
        id: `e-${rootId}-${modId}`,
        source: rootId,
        target: modId,
        type: 'smoothstep',
      });

      // Children of this module (3rd level)
      const children = secondLevel[idx] || [];
      children.forEach((child, cIdx) => {
        const childId = child._id;
        const childLabel = '📗 ' + child.title;

        nodes.push({
          id: childId,
          data: { label: childLabel },
          position: {
            x: 100 + idx * spacingX + cIdx * 50,
            y: 350,
          },
        });

        edges.push({
          id: `e-${modId}-${childId}`,
          source: modId,
          target: childId,
          type: 'smoothstep',
        });
      });
    });

    return { nodes, edges };
  }

  const { nodes, edges } = convertToReactFlowFormat(contentJson || {});

  const handleNodeClick = async (id, rawLabel) => {
    // Convert label to plain string
    let label;

    if (typeof rawLabel === "string") {
      label = rawLabel;
    } else if (rawLabel?.props?.children) {
      // If it's a JSX element like <div>Text</div>
      label = Array.isArray(rawLabel.props.children)
        ? rawLabel.props.children.join("")
        : rawLabel.props.children.toString();
    } else {
      label = "Unknown Node";
    }

    setSidePanel({ id, label, loading: true });

    const subject = contentJson?.["1"]?.title || "Unknown subject";

    const explanation = await useExplanationStore.getState().getExplanation(subject, label);

    setSidePanel({ id, label, content: explanation });

    // try {
    //   console.log("🧪 label = ", label);
    //   console.log("🧪 typeof label = ", typeof label);
    //
    //   const res = await fetch("http://localhost:5000/api/syllabus/elaborate", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       summarize: {
    //         topic: label,
    //         sub: contentJson?.["1"]?.title || "Unknown subject",
    //       }
    //     })
    //   });
    //   const data = await res.json();
    //   console.log("data is ", data);
    //
    //   setSidePanel({ id, label, content: typeof data.explanation === "string" ? data.explanation : "No explanation found." });
    //   console.log("type of data explanation is: ", typeof data.explanation);
    // } catch (e) {
    //   console.error("Failed to fetch explanation", e);
    //   setSidePanel({
    //     id,
    //     label,
    //     content: `Error fetching explanation: ${e}`,
    //   });
    // }
  }

  if (!user) return <p>Not logged in!</p>
  
  console.log(user);

   return (
   <PanelGroup direction="horizontal" className="w-full h-screen">
      {/* Left Sidebar Panel */}
      <Panel defaultSize={20} minSize={10} maxSize={30} className="bg-gray-100 border-r border-gray-300">
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">📚 Syllabi</h2>
          <h4 className="font-medium text-md mb-8">Welcome, {user.email}!</h4>
          <button
            className={`block w-full text-left px-3 py-2 mb-2 rounded bg-blue-500 text-[#efefef] font-medium`}
          >
            {contentJson["1"].title}
          </button>
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
          nodesData={nodes}
          edgesData={edges}
          onNodeClick={handleNodeClick}
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
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{sidePanel.label}</h3>
              <button onClick={() => setSidePanel(null)} className="text-gray-600 hover:text-black">
                ✖
              </button>
            </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sidePanel.content}
              </ReactMarkdown>
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
