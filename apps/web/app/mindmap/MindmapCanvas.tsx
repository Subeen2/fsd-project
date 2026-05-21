"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMindmapStore } from "./useMindmapStore";
import { MindmapNodeComponent } from "./MindmapNode";

const nodeTypes = { mindmap: MindmapNodeComponent };

function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    clearAll,
  } = useMindmapStore();
  const { screenToFlowPosition } = useReactFlow();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddByInput = useCallback(() => {
    const label = inputText.trim();
    if (!label) return;
    addNode(label, {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    });
    setInputText("");
    inputRef.current?.focus();
  }, [inputText, addNode]);

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".react-flow__node")) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode("새 노드", position);
    },
    [screenToFlowPosition, addNode],
  );

  const handleClearAll = useCallback(() => {
    if (window.confirm("마인드맵을 초기화할까요?")) clearAll();
  }, [clearAll]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Toolbar */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "6px 10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          whiteSpace: "nowrap",
        }}
      >
        {/* 텍스트 입력 후 추가 */}
        <input
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddByInput();
          }}
          placeholder="노드 텍스트 입력..."
          style={{
            padding: "5px 10px",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
            outline: "none",
            width: "160px",
            color: "#111827",
          }}
        />
        <button
          onClick={handleAddByInput}
          disabled={!inputText.trim()}
          style={{
            padding: "5px 12px",
            borderRadius: "6px",
            backgroundColor: inputText.trim() ? "#2563eb" : "#e5e7eb",
            color: inputText.trim() ? "#fff" : "#9ca3af",
            border: "none",
            cursor: inputText.trim() ? "pointer" : "default",
            fontSize: "13px",
            fontWeight: 500,
            transition: "background-color 0.1s",
          }}
        >
          추가
        </button>
        <span style={{ width: 1, height: 20, backgroundColor: "#e5e7eb" }} />
        <button
          onClick={() =>
            addNode("새 노드", {
              x: Math.random() * 400 + 100,
              y: Math.random() * 300 + 100,
            })
          }
          style={{
            padding: "5px 12px",
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: "#6b7280",
            border: "1px solid #e5e7eb",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          빈 노드
        </button>
        <span style={{ width: 1, height: 20, backgroundColor: "#e5e7eb" }} />
        <button
          onClick={handleClearAll}
          style={{
            padding: "5px 12px",
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: "#6b7280",
            border: "1px solid #e5e7eb",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          전체 삭제
        </button>
        <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: 4 }}>
          더블클릭으로 노드 추가 · 노드 끼리 드래그로 연결
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDoubleClick={onDoubleClick}
        nodeTypes={nodeTypes}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />
        <Controls />
        <MiniMap nodeColor="#2563eb" maskColor="rgba(0,0,0,0.04)" />
      </ReactFlow>

      {nodes.length === 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            pointerEvents: "none",
          }}
        >
          <span style={{ fontSize: "48px" }}>🧠</span>
          <p style={{ fontSize: "15px", color: "#9ca3af", margin: 0 }}>
            캔버스를 더블클릭하거나 &lsquo;노드 추가&rsquo;를 눌러 시작하세요
          </p>
        </div>
      )}
    </div>
  );
}

export function MindmapCanvas() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}
