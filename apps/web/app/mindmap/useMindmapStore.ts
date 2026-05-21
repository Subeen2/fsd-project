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
} & Record<string, unknown>;
export type MindmapNode = Node<MindmapNodeData, "mindmap">;

type Serialized = {
  nodes: {
    id: string;
    position: { x: number; y: number };
    data: MindmapNodeData;
  }[];
  edges: { id: string; source: string; target: string }[];
};

const STORAGE_KEY = "fsd-mindmap";

function readStorage(): { nodes: MindmapNode[]; edges: Edge[] } {
  if (typeof window === "undefined") return { nodes: [], edges: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { nodes: [], edges: [] };
    const { nodes, edges } = JSON.parse(raw) as Serialized;
    return {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: "mindmap" as const,
        position: n.position,
        data: n.data,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };
  } catch {
    return { nodes: [], edges: [] };
  }
}

function writeStorage(nodes: MindmapNode[], edges: Edge[]) {
  if (typeof window === "undefined") return;
  try {
    const payload: Serialized = {
      nodes: nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: n.data,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

let counter = Date.now();

interface MindmapState {
  nodes: MindmapNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<MindmapNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (label: string, position: { x: number; y: number }) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeColor: (id: string, color: NodeColorId) => void;
  removeNode: (id: string) => void;
  clearAll: () => void;
}

const initial = readStorage();

export const useMindmapStore = create<MindmapState>((set, get) => ({
  nodes: initial.nodes,
  edges: initial.edges,

  onNodesChange: (changes: NodeChange<MindmapNode>[]) => {
    const removedIds = changes
      .filter((c) => c.type === "remove")
      .map((c) => c.id);

    const nodes = applyNodeChanges(changes, get().nodes);
    const edges =
      removedIds.length > 0
        ? get().edges.filter(
            (e) =>
              !removedIds.includes(e.source) && !removedIds.includes(e.target),
          )
        : get().edges;

    set({ nodes, edges });
    writeStorage(nodes, edges);
  },

  onEdgesChange: (changes) => {
    const edges = applyEdgeChanges(changes, get().edges);
    set({ edges });
    writeStorage(get().nodes, edges);
  },

  onConnect: (connection) => {
    const edges = rfAddEdge(connection, get().edges);
    set({ edges });
    writeStorage(get().nodes, edges);
  },

  addNode: (label, position) => {
    const id = `node-${counter++}`;
    const node: MindmapNode = {
      id,
      type: "mindmap",
      position,
      data: { label },
    };
    const nodes = [...get().nodes, node];
    set({ nodes });
    writeStorage(nodes, get().edges);
  },

  updateNodeLabel: (id, label) => {
    const nodes = get().nodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, label } } : n,
    );
    set({ nodes });
    writeStorage(nodes, get().edges);
  },

  updateNodeColor: (id, color) => {
    const nodes = get().nodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, color } } : n,
    );
    set({ nodes });
    writeStorage(nodes, get().edges);
  },

  removeNode: (id) => {
    const nodes = get().nodes.filter((n) => n.id !== id);
    const edges = get().edges.filter((e) => e.source !== id && e.target !== id);
    set({ nodes, edges });
    writeStorage(nodes, edges);
  },

  clearAll: () => {
    set({ nodes: [], edges: [] });
    writeStorage([], []);
  },
}));
