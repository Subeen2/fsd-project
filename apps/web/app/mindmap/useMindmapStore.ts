import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as rfAddEdge,
} from "@xyflow/react";
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeChange,
} from "@xyflow/react";

export const NODE_COLORS = [
  {
    id: "white",
    bg: "#ffffff",
    border: "#e5e7eb",
    text: "#111827",
    label: "기본",
  },
  {
    id: "blue",
    bg: "#dbeafe",
    border: "#93c5fd",
    text: "#1e40af",
    label: "파란색",
  },
  {
    id: "purple",
    bg: "#ede9fe",
    border: "#c4b5fd",
    text: "#5b21b6",
    label: "보라색",
  },
  {
    id: "green",
    bg: "#dcfce7",
    border: "#86efac",
    text: "#166534",
    label: "초록색",
  },
  {
    id: "rose",
    bg: "#ffe4e6",
    border: "#fda4af",
    text: "#9f1239",
    label: "빨간색",
  },
  {
    id: "orange",
    bg: "#ffedd5",
    border: "#fdba74",
    text: "#9a3412",
    label: "주황색",
  },
  {
    id: "yellow",
    bg: "#fef9c3",
    border: "#fde047",
    text: "#854d0e",
    label: "노란색",
  },
] as const;

export type NodeColorId = (typeof NODE_COLORS)[number]["id"];

export type MindmapNodeData = {
  label: string;
  color?: NodeColorId;
  imageUrl?: string;
} & Record<string, unknown>;
export type MindmapNode = Node<MindmapNodeData, "mindmap">;

export type Board = {
  id: string;
  name: string;
  nodes: MindmapNode[];
  edges: Edge[];
};

// ─── Storage ──────────────────────────────────────────────────────────────────

type SerializedNode = {
  id: string;
  position: { x: number; y: number };
  data: MindmapNodeData;
};
type SerializedEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

type Serialized = {
  boards: {
    id: string;
    name: string;
    nodes: SerializedNode[];
    edges: SerializedEdge[];
  }[];
  currentBoardId: string;
};

// Old single-board format — for migration
type LegacySerialized = {
  nodes: SerializedNode[];
  edges: SerializedEdge[];
};

const STORAGE_KEY = "fsd-mindmap";
const DEFAULT_BOARD_ID = "board-default";

function hydrateBoard(b: Serialized["boards"][number]): Board {
  return {
    id: b.id,
    name: b.name,
    nodes: b.nodes.map((n) => ({
      id: n.id,
      type: "mindmap" as const,
      position: n.position,
      data: n.data,
    })),
    edges: b.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      ...(e.sourceHandle != null ? { sourceHandle: e.sourceHandle } : {}),
      ...(e.targetHandle != null ? { targetHandle: e.targetHandle } : {}),
    })),
  };
}

function makeDefaultBoard(
  nodes: MindmapNode[] = [],
  edges: Edge[] = [],
): Board {
  return { id: DEFAULT_BOARD_ID, name: "보드 1", nodes, edges };
}

function readStorage(): { boards: Board[]; currentBoardId: string } {
  if (typeof window === "undefined") {
    return { boards: [makeDefaultBoard()], currentBoardId: DEFAULT_BOARD_ID };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return { boards: [makeDefaultBoard()], currentBoardId: DEFAULT_BOARD_ID };

    const parsed = JSON.parse(raw) as Serialized | LegacySerialized;

    // Migrate legacy single-board format
    if ("nodes" in parsed && !("boards" in parsed)) {
      const legacy = parsed as LegacySerialized;
      const board = makeDefaultBoard(
        legacy.nodes.map((n) => ({
          id: n.id,
          type: "mindmap" as const,
          position: n.position,
          data: n.data,
        })),
        legacy.edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
      );
      return { boards: [board], currentBoardId: DEFAULT_BOARD_ID };
    }

    const s = parsed as Serialized;
    const boards = s.boards.map(hydrateBoard);
    if (boards.length === 0)
      return { boards: [makeDefaultBoard()], currentBoardId: DEFAULT_BOARD_ID };
    const validId =
      boards.some((b) => b.id === s.currentBoardId) && s.currentBoardId
        ? s.currentBoardId
        : (boards[0]?.id ?? DEFAULT_BOARD_ID);
    return { boards, currentBoardId: validId };
  } catch {
    return { boards: [makeDefaultBoard()], currentBoardId: DEFAULT_BOARD_ID };
  }
}

function writeStorage(boards: Board[], currentBoardId: string) {
  if (typeof window === "undefined") return;
  try {
    const payload: Serialized = {
      boards: boards.map((b) => ({
        id: b.id,
        name: b.name,
        nodes: b.nodes.map((n) => ({
          id: n.id,
          position: n.position,
          data: n.data,
        })),
        edges: b.edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          ...(e.sourceHandle != null ? { sourceHandle: e.sourceHandle } : {}),
          ...(e.targetHandle != null ? { targetHandle: e.targetHandle } : {}),
        })),
      })),
      currentBoardId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

// Sync current board's nodes/edges into the boards array
function syncCurrentBoard(
  boards: Board[],
  currentBoardId: string,
  nodes: MindmapNode[],
  edges: Edge[],
): Board[] {
  return boards.map((b) =>
    b.id === currentBoardId ? { ...b, nodes, edges } : b,
  );
}

// ─── Store ────────────────────────────────────────────────────────────────────

let counter = Date.now();

interface MindmapState {
  boards: Board[];
  currentBoardId: string;
  nodes: MindmapNode[];
  edges: Edge[];

  // Board management
  addBoard: () => void;
  removeBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  setCurrentBoard: (id: string) => void;

  // Node / edge operations (on the current board)
  onNodesChange: OnNodesChange<MindmapNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (
    label: string,
    position: { x: number; y: number },
    imageUrl?: string,
  ) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeColor: (id: string, color: NodeColorId) => void;
  updateNodeImage: (id: string, imageUrl: string) => void;
  removeNode: (id: string) => void;
  clearAll: () => void;
}

const initial = readStorage();
const initialBoard = initial.boards.find(
  (b) => b.id === initial.currentBoardId,
)!;

export const useMindmapStore = create<MindmapState>((set, get) => ({
  boards: initial.boards,
  currentBoardId: initial.currentBoardId,
  nodes: initialBoard.nodes,
  edges: initialBoard.edges,

  // ── Board management ──────────────────────────────────────────────────────

  addBoard: () => {
    const { boards, currentBoardId, nodes, edges } = get();
    const saved = syncCurrentBoard(boards, currentBoardId, nodes, edges);
    const id = `board-${counter++}`;
    const newBoard: Board = {
      id,
      name: `보드 ${saved.length + 1}`,
      nodes: [],
      edges: [],
    };
    const next = [...saved, newBoard];
    set({ boards: next, currentBoardId: id, nodes: [], edges: [] });
    writeStorage(next, id);
  },

  removeBoard: (id) => {
    const { boards, currentBoardId, nodes, edges } = get();
    if (boards.length <= 1) return; // always keep at least one
    const saved = syncCurrentBoard(boards, currentBoardId, nodes, edges);
    const next = saved.filter((b) => b.id !== id);
    const nextId =
      currentBoardId === id
        ? (next[next.length - 1]?.id ?? next[0]?.id ?? DEFAULT_BOARD_ID)
        : currentBoardId;
    const nextBoard = next.find((b) => b.id === nextId)!;
    set({
      boards: next,
      currentBoardId: nextId,
      nodes: nextBoard.nodes,
      edges: nextBoard.edges,
    });
    writeStorage(next, nextId);
  },

  renameBoard: (id, name) => {
    const { boards } = get();
    const next = boards.map((b) => (b.id === id ? { ...b, name } : b));
    set({ boards: next });
    writeStorage(next, get().currentBoardId);
  },

  setCurrentBoard: (id) => {
    const { boards, currentBoardId, nodes, edges } = get();
    if (id === currentBoardId) return;
    const saved = syncCurrentBoard(boards, currentBoardId, nodes, edges);
    const target = saved.find((b) => b.id === id);
    if (!target) return;
    set({
      boards: saved,
      currentBoardId: id,
      nodes: target.nodes,
      edges: target.edges,
    });
    writeStorage(saved, id);
  },

  // ── Node / edge operations ─────────────────────────────────────────────────

  onNodesChange: (changes: NodeChange<MindmapNode>[]) => {
    const { nodes, edges, boards, currentBoardId } = get();
    const removedIds = changes
      .filter((c) => c.type === "remove")
      .map((c) => c.id);
    const nextNodes = applyNodeChanges(changes, nodes);
    const nextEdges =
      removedIds.length > 0
        ? edges.filter(
            (e) =>
              !removedIds.includes(e.source) && !removedIds.includes(e.target),
          )
        : edges;
    const nextBoards = syncCurrentBoard(
      boards,
      currentBoardId,
      nextNodes,
      nextEdges,
    );
    set({ nodes: nextNodes, edges: nextEdges, boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },

  onEdgesChange: (changes) => {
    const { edges, nodes, boards, currentBoardId } = get();
    const nextEdges = applyEdgeChanges(changes, edges);
    const nextBoards = syncCurrentBoard(
      boards,
      currentBoardId,
      nodes,
      nextEdges,
    );
    set({ edges: nextEdges, boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },

  onConnect: (connection) => {
    const { edges, nodes, boards, currentBoardId } = get();
    const nextEdges = rfAddEdge(connection, edges);
    const nextBoards = syncCurrentBoard(
      boards,
      currentBoardId,
      nodes,
      nextEdges,
    );
    set({ edges: nextEdges, boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },

  addNode: (label, position, imageUrl) => {
    const { nodes, edges, boards, currentBoardId } = get();
    const id = `node-${counter++}`;
    const node: MindmapNode = {
      id,
      type: "mindmap",
      position,
      data: { label, ...(imageUrl ? { imageUrl } : {}) },
    };
    const nextNodes = [...nodes, node];
    const nextBoards = syncCurrentBoard(
      boards,
      currentBoardId,
      nextNodes,
      edges,
    );
    set({ nodes: nextNodes, boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },

  updateNodeLabel: (id, label) => {
    const { nodes, edges, boards, currentBoardId } = get();
    const nextNodes = nodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, label } } : n,
    );
    const nextBoards = syncCurrentBoard(
      boards,
      currentBoardId,
      nextNodes,
      edges,
    );
    set({ nodes: nextNodes, boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },

  updateNodeImage: (id, imageUrl) => {
    const { nodes, edges, boards, currentBoardId } = get();
    const nextNodes = nodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, imageUrl } } : n,
    );
    const nextBoards = syncCurrentBoard(
      boards,
      currentBoardId,
      nextNodes,
      edges,
    );
    set({ nodes: nextNodes, boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },

  updateNodeColor: (id, color) => {
    const { nodes, edges, boards, currentBoardId } = get();
    const nextNodes = nodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, color } } : n,
    );
    const nextBoards = syncCurrentBoard(
      boards,
      currentBoardId,
      nextNodes,
      edges,
    );
    set({ nodes: nextNodes, boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },

  removeNode: (id) => {
    const { nodes, edges, boards, currentBoardId } = get();
    const nextNodes = nodes.filter((n) => n.id !== id);
    const nextEdges = edges.filter((e) => e.source !== id && e.target !== id);
    const nextBoards = syncCurrentBoard(
      boards,
      currentBoardId,
      nextNodes,
      nextEdges,
    );
    set({ nodes: nextNodes, edges: nextEdges, boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },

  clearAll: () => {
    const { boards, currentBoardId } = get();
    const nextBoards = syncCurrentBoard(boards, currentBoardId, [], []);
    set({ nodes: [], edges: [], boards: nextBoards });
    writeStorage(nextBoards, currentBoardId);
  },
}));
