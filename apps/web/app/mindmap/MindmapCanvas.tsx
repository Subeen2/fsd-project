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
import {
  NODE_COLORS,
  useMindmapStore,
  type NodeColorId,
} from "./useMindmapStore";
import { MindmapNodeComponent } from "./MindmapNode";

// ─── Board Sidebar ────────────────────────────────────────────────────────────

const TAB_COLORS = [
  { bg: "#dbeafe", border: "#bfdbfe", text: "#1e40af" },
  { bg: "#fce7f3", border: "#fbcfe8", text: "#9d174d" },
  { bg: "#dcfce7", border: "#bbf7d0", text: "#166534" },
  { bg: "#ede9fe", border: "#ddd6fe", text: "#5b21b6" },
  { bg: "#fef9c3", border: "#fef08a", text: "#854d0e" },
  { bg: "#ffedd5", border: "#fed7aa", text: "#9a3412" },
  { bg: "#e0f2fe", border: "#bae6fd", text: "#075985" },
] as const;

const DEFAULT_TAB_COLOR = TAB_COLORS[0];

function getTabColor(idx: number) {
  return TAB_COLORS[idx % TAB_COLORS.length] ?? DEFAULT_TAB_COLOR;
}

function BoardSidebar() {
  const {
    boards,
    currentBoardId,
    addBoard,
    removeBoard,
    renameBoard,
    setCurrentBoard,
  } = useMindmapStore();
  const [open, setOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const commitRename = (id: string) => {
    const name = draft.trim();
    if (name) renameBoard(id, name);
    setEditingId(null);
  };

  // ── 닫힌 상태: 인덱스 탭 ────────────────────────────────────────────────────
  if (!open) {
    return (
      <div
        style={{
          width: 16,
          flexShrink: 0,
          height: "100%",
          backgroundColor: "#f1f5f9",
          borderRight: "1px solid #e5e7eb",
          position: "relative",
          overflow: "visible",
          zIndex: 30,
        }}
      >
        {/* 열기 버튼 */}
        <button
          onClick={() => setOpen(true)}
          title="보드 패널 열기"
          style={{
            position: "absolute",
            top: 10,
            left: 0,
            width: 16,
            height: 28,
            backgroundColor: "#e2e8f0",
            border: "none",
            borderRadius: "0 6px 6px 0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "#64748b",
          }}
        >
          ›
        </button>

        {/* 인덱스 탭들 */}
        {boards.map((board, idx) => {
          const active = board.id === currentBoardId;
          const color = getTabColor(idx);
          return (
            <button
              key={board.id}
              onClick={() => {
                setCurrentBoard(board.id);
                setOpen(true);
              }}
              title={board.name}
              style={{
                position: "absolute",
                left: 16,
                top: 52 + idx * 44,
                width: 72,
                height: 34,
                backgroundColor: active ? color.bg : "#fff",
                border: `1px solid ${color.border}`,
                borderLeft: "none",
                borderRadius: "0 10px 10px 0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                paddingLeft: 10,
                paddingRight: 6,
                boxShadow: active
                  ? "2px 2px 8px rgba(0,0,0,0.1)"
                  : "1px 1px 3px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.1s",
                zIndex: 20,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 400,
                  color: active ? color.text : "#64748b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 52,
                  lineHeight: 1.3,
                }}
              >
                {board.name}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // ── 열린 상태: 전체 사이드바 ──────────────────────────────────────────────────
  return (
    <div
      style={{
        width: 180,
        flexShrink: 0,
        height: "100%",
        backgroundColor: "#f8fafc",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 10px 8px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* 닫기 버튼 */}
          <button
            onClick={() => setOpen(false)}
            title="패널 닫기"
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: 11,
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              letterSpacing: "0.05em",
            }}
          >
            보드
          </span>
        </div>
        <button
          onClick={addBoard}
          title="새 보드 추가"
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontSize: 14,
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>

      {/* 보드 목록 */}
      <ul
        style={{
          listStyle: "none",
          padding: "6px",
          margin: 0,
          overflowY: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {boards.map((board, idx) => {
          const active = board.id === currentBoardId;
          const editing = editingId === board.id;
          const color = getTabColor(idx);

          return (
            <li
              key={board.id}
              onClick={() => !editing && setCurrentBoard(board.id)}
              onDoubleClick={() => {
                setEditingId(board.id);
                setDraft(board.name);
              }}
              onMouseEnter={() => setHoveredId(board.id)}
              onMouseLeave={() => setHoveredId(null)}
              title={board.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 8px",
                borderRadius: 8,
                backgroundColor: active
                  ? color.bg
                  : hoveredId === board.id
                    ? "#f1f5f9"
                    : "transparent",
                border: `1px solid ${active ? color.border : "transparent"}`,
                cursor: editing ? "default" : "pointer",
                transition: "background 0.1s",
                userSelect: "none",
              }}
            >
              {/* 색상 점 */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: color.bg,
                  border: `1.5px solid ${color.border}`,
                  flexShrink: 0,
                }}
              />
              {editing ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => commitRename(board.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing)
                      commitRename(board.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    fontSize: 13,
                    border: "none",
                    borderBottom: "1.5px solid #3b82f6",
                    outline: "none",
                    background: "transparent",
                    color: "#0f172a",
                    padding: "0 0 1px",
                    minWidth: 0,
                  }}
                />
              ) : (
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: active ? color.text : "#374151",
                    fontWeight: active ? 600 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {board.name}
                </span>
              )}
              {/* 이름 편집 버튼 */}
              {!editing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(board.id);
                    setDraft(board.name);
                  }}
                  title="이름 변경"
                  style={{
                    flexShrink: 0,
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: hoveredId === board.id ? 0.8 : 0.5,
                    transition: "opacity 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity =
                      hoveredId === board.id ? "0.8" : "0.5")
                  }
                >
                  ✏️
                </button>
              )}
              {!editing && boards.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`"${board.name}" 보드를 삭제할까요?`)) {
                      removeBoard(board.id);
                    }
                  }}
                  title="보드 삭제"
                  style={{
                    flexShrink: 0,
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#d1d5db",
                    fontSize: 14,
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: hoveredId === board.id ? 0.8 : 0.5,
                    transition: "opacity 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity =
                      hoveredId === board.id ? "0.8" : "0.5")
                  }
                >
                  ×
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function getNodeColor(colorId?: NodeColorId) {
  return (NODE_COLORS.find((c) => c.id === colorId) ?? NODE_COLORS[0]).bg;
}

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
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        addNode(
          "",
          { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
          url,
        );
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [addNode],
  );

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
            if (e.key === "Enter" && !e.nativeEvent.isComposing)
              handleAddByInput();
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
          onClick={() => imageInputRef.current?.click()}
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
          🖼️ 이미지
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
        <MiniMap
          nodeColor={(node) =>
            getNodeColor((node.data as { color?: NodeColorId }).color)
          }
          nodeStrokeWidth={0}
          maskColor="rgba(0,0,0,0.04)"
        />
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

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageFile}
      />
    </div>
  );
}

export function MindmapCanvas() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <BoardSidebar />
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
    </div>
  );
}
