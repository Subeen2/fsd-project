import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Handle,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ─── Custom Node ──────────────────────────────────────────────────────────────

type NodeData = { label: string } & Record<string, unknown>;
type MindmapNode = Node<NodeData, "mindmap">;

function DemoNode({ data, selected }: NodeProps<MindmapNode>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);

  const commit = () => {
    setEditing(false);
  };

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      style={{
        padding: "10px 16px",
        borderRadius: "10px",
        border: selected ? "2px solid #2563eb" : "2px solid #e5e7eb",
        backgroundColor: "#fff",
        boxShadow: selected
          ? "0 0 0 3px rgba(37,99,235,0.15)"
          : "0 1px 4px rgba(0,0,0,0.08)",
        minWidth: "100px",
        maxWidth: "200px",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#9ca3af", width: 8, height: 8 }}
      />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") commit();
          }}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "13px",
            background: "transparent",
            textAlign: "center",
          }}
        />
      ) : (
        <span
          style={{
            fontSize: "13px",
            display: "block",
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          {data.label}
        </span>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#9ca3af", width: 8, height: 8 }}
      />
    </div>
  );
}

const nodeTypes = { mindmap: DemoNode };

// ─── Canvas ───────────────────────────────────────────────────────────────────

interface CanvasProps {
  initialNodes?: MindmapNode[];
  initialEdges?: Edge[];
  showToolbar?: boolean;
  showMinimap?: boolean;
}

let uid = 1;

function Canvas({
  initialNodes = [],
  initialEdges = [],
  showToolbar = true,
  showMinimap = true,
}: CanvasProps) {
  const [nodes, setNodes] = useState<MindmapNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange: OnNodesChange<MindmapNode> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  );

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".react-flow__node")) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const id = `node-${uid++}`;
      setNodes((nds) => [
        ...nds,
        { id, type: "mindmap", position, data: { label: "새 노드" } },
      ]);
    },
    [screenToFlowPosition],
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {showToolbar && (
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
          <button
            onClick={() => {
              const id = `node-${uid++}`;
              setNodes((nds) => [
                ...nds,
                {
                  id,
                  type: "mindmap",
                  position: {
                    x: Math.random() * 400 + 50,
                    y: Math.random() * 200 + 50,
                  },
                  data: { label: "새 노드" },
                },
              ]);
            }}
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            + 노드 추가
          </button>
          <span style={{ width: 1, height: 20, backgroundColor: "#e5e7eb" }} />
          <button
            onClick={() => {
              setNodes([]);
              setEdges([]);
            }}
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
            더블클릭으로 노드 추가 · 드래그로 연결
          </span>
        </div>
      )}

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
        {showMinimap && (
          <MiniMap nodeColor="#2563eb" maskColor="rgba(0,0,0,0.04)" />
        )}
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
          <span style={{ fontSize: "40px" }}>🧠</span>
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
            캔버스를 더블클릭하거나 &apos;노드 추가&apos;를 눌러 시작하세요
          </p>
        </div>
      )}
    </div>
  );
}

function MindmapDemo(props: CanvasProps) {
  return (
    <div
      style={{
        width: "800px",
        height: "500px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <ReactFlowProvider>
        <Canvas {...props} />
      </ReactFlowProvider>
    </div>
  );
}

// ─── Preset data ──────────────────────────────────────────────────────────────

const presetNodes: MindmapNode[] = [
  {
    id: "root",
    type: "mindmap",
    position: { x: 300, y: 200 },
    data: { label: "프로젝트 계획" },
  },
  {
    id: "a",
    type: "mindmap",
    position: { x: 100, y: 350 },
    data: { label: "프론트엔드" },
  },
  {
    id: "b",
    type: "mindmap",
    position: { x: 300, y: 350 },
    data: { label: "백엔드" },
  },
  {
    id: "c",
    type: "mindmap",
    position: { x: 500, y: 350 },
    data: { label: "인프라" },
  },
  {
    id: "a1",
    type: "mindmap",
    position: { x: 20, y: 480 },
    data: { label: "Next.js" },
  },
  {
    id: "a2",
    type: "mindmap",
    position: { x: 160, y: 480 },
    data: { label: "Panda CSS" },
  },
  {
    id: "b1",
    type: "mindmap",
    position: { x: 260, y: 480 },
    data: { label: "Node.js" },
  },
  {
    id: "b2",
    type: "mindmap",
    position: { x: 370, y: 480 },
    data: { label: "Prisma" },
  },
  {
    id: "c1",
    type: "mindmap",
    position: { x: 470, y: 480 },
    data: { label: "Vercel" },
  },
  {
    id: "c2",
    type: "mindmap",
    position: { x: 570, y: 480 },
    data: { label: "Fly.io" },
  },
];

const presetEdges: Edge[] = [
  { id: "e-root-a", source: "root", target: "a" },
  { id: "e-root-b", source: "root", target: "b" },
  { id: "e-root-c", source: "root", target: "c" },
  { id: "e-a-a1", source: "a", target: "a1" },
  { id: "e-a-a2", source: "a", target: "a2" },
  { id: "e-b-b1", source: "b", target: "b1" },
  { id: "e-b-b2", source: "b", target: "b2" },
  { id: "e-c-c1", source: "c", target: "c1" },
  { id: "e-c-c2", source: "c", target: "c2" },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof MindmapDemo> = {
  title: "Chat/Mindmap",
  component: MindmapDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    docs: {
      description: {
        component:
          "마인드맵 에디터. 노드를 추가하고 드래그로 연결해 트리 구조를 만들 수 있습니다. 더블클릭으로 노드 텍스트 편집, Delete/Backspace로 삭제.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { showToolbar: true, showMinimap: true },
};

export const WithPresetData: Story = {
  args: {
    initialNodes: presetNodes,
    initialEdges: presetEdges,
    showToolbar: true,
    showMinimap: true,
  },
};

export const NoToolbar: Story = {
  args: {
    initialNodes: presetNodes,
    initialEdges: presetEdges,
    showToolbar: false,
    showMinimap: false,
  },
};
