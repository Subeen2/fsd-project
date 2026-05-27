"use client";

import { create } from "zustand";

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
  date: string; // YYYY-MM-DD
  createdAt: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

export type Checklist = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  items: ChecklistItem[];
};

type Serialized = {
  todos: TodoItem[];
  checklists: Checklist[];
};

const STORAGE_KEY = "fsd-todo";

function readStorage(): Serialized {
  if (typeof window === "undefined") return { todos: [], checklists: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? (JSON.parse(raw) as Serialized)
      : { todos: [], checklists: [] };
  } catch {
    return { todos: [], checklists: [] };
  }
}

function writeStorage(data: Serialized) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

let counter = Date.now();

interface TodoState {
  todos: TodoItem[];
  checklists: Checklist[];

  addTodo: (text: string, date: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearDoneTodos: (date: string) => void;

  addChecklist: (name: string, date: string) => void;
  removeChecklist: (id: string) => void;
  renameChecklist: (id: string, name: string) => void;
  addChecklistItem: (listId: string, text: string) => void;
  toggleChecklistItem: (listId: string, itemId: string) => void;
  removeChecklistItem: (listId: string, itemId: string) => void;
  clearCheckedItems: (listId: string) => void;
}

const saved = readStorage();

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: saved.todos,
  checklists: saved.checklists,

  addTodo: (text, date) => {
    const todo: TodoItem = {
      id: `todo-${counter++}`,
      text,
      done: false,
      date,
      createdAt: new Date().toISOString(),
    };
    const todos = [...get().todos, todo];
    set({ todos });
    writeStorage({ todos, checklists: get().checklists });
  },

  toggleTodo: (id) => {
    const todos = get().todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t,
    );
    set({ todos });
    writeStorage({ todos, checklists: get().checklists });
  },

  removeTodo: (id) => {
    const todos = get().todos.filter((t) => t.id !== id);
    set({ todos });
    writeStorage({ todos, checklists: get().checklists });
  },

  clearDoneTodos: (date) => {
    const todos = get().todos.filter((t) => !(t.date === date && t.done));
    set({ todos });
    writeStorage({ todos, checklists: get().checklists });
  },

  addChecklist: (name, date) => {
    const list: Checklist = {
      id: `list-${counter++}`,
      name,
      date,
      items: [],
    };
    const checklists = [...get().checklists, list];
    set({ checklists });
    writeStorage({ todos: get().todos, checklists });
  },

  removeChecklist: (id) => {
    const checklists = get().checklists.filter((l) => l.id !== id);
    set({ checklists });
    writeStorage({ todos: get().todos, checklists });
  },

  renameChecklist: (id, name) => {
    const checklists = get().checklists.map((l) =>
      l.id === id ? { ...l, name } : l,
    );
    set({ checklists });
    writeStorage({ todos: get().todos, checklists });
  },

  addChecklistItem: (listId, text) => {
    const item: ChecklistItem = {
      id: `item-${counter++}`,
      text,
      checked: false,
    };
    const checklists = get().checklists.map((l) =>
      l.id === listId ? { ...l, items: [...l.items, item] } : l,
    );
    set({ checklists });
    writeStorage({ todos: get().todos, checklists });
  },

  toggleChecklistItem: (listId, itemId) => {
    const checklists = get().checklists.map((l) =>
      l.id === listId
        ? {
            ...l,
            items: l.items.map((it) =>
              it.id === itemId ? { ...it, checked: !it.checked } : it,
            ),
          }
        : l,
    );
    set({ checklists });
    writeStorage({ todos: get().todos, checklists });
  },

  removeChecklistItem: (listId, itemId) => {
    const checklists = get().checklists.map((l) =>
      l.id === listId
        ? { ...l, items: l.items.filter((it) => it.id !== itemId) }
        : l,
    );
    set({ checklists });
    writeStorage({ todos: get().todos, checklists });
  },

  clearCheckedItems: (listId) => {
    const checklists = get().checklists.map((l) =>
      l.id === listId
        ? { ...l, items: l.items.filter((it) => !it.checked) }
        : l,
    );
    set({ checklists });
    writeStorage({ todos: get().todos, checklists });
  },
}));
