import { create } from "zustand";

export type BubbleColor = "blue" | "purple" | "green" | "rose" | "orange";
export type ChatBg = "white" | "warm" | "dark";
export type FontSize = "sm" | "md" | "lg";

export const BUBBLE_COLORS: Record<
  BubbleColor,
  { bg: string; text: string; label: string }
> = {
  blue: { bg: "#2563eb", text: "#fff", label: "파란색" },
  purple: { bg: "#7c3aed", text: "#fff", label: "보라색" },
  green: { bg: "#16a34a", text: "#fff", label: "초록색" },
  rose: { bg: "#e11d48", text: "#fff", label: "빨간색" },
  orange: { bg: "#ea580c", text: "#fff", label: "주황색" },
};

export const CHAT_BGS: Record<
  ChatBg,
  {
    bg: string;
    otherBubbleBg: string;
    otherBubbleText: string;
    label: string;
    dark: boolean;
  }
> = {
  white: {
    bg: "#ffffff",
    otherBubbleBg: "#f3f4f6",
    otherBubbleText: "#111827",
    label: "기본",
    dark: false,
  },
  warm: {
    bg: "#fafaf9",
    otherBubbleBg: "#e7e5e4",
    otherBubbleText: "#1c1917",
    label: "따뜻한",
    dark: false,
  },
  dark: {
    bg: "#0f172a",
    otherBubbleBg: "#1e293b",
    otherBubbleText: "#f1f5f9",
    label: "어두운",
    dark: true,
  },
};

export const FONT_SIZES: Record<FontSize, { px: string; label: string }> = {
  sm: { px: "13px", label: "작게" },
  md: { px: "15px", label: "기본" },
  lg: { px: "17px", label: "크게" },
};

const STORAGE_KEY = "fsd-chat-theme";

const DEFAULT_ROOM_NAME = "FSD Project";

function readStorage(): {
  bubbleColor?: BubbleColor;
  chatBg?: ChatBg;
  fontSize?: FontSize;
  roomName?: string;
} {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReturnType<typeof readStorage>) : {};
  } catch {
    return {};
  }
}

function writeStorage(patch: {
  bubbleColor: BubbleColor;
  chatBg: ChatBg;
  fontSize: FontSize;
  roomName: string;
}) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patch));
  } catch {
    /* ignore */
  }
}

interface ChatThemeState {
  bubbleColor: BubbleColor;
  chatBg: ChatBg;
  fontSize: FontSize;
  roomName: string;
  setBubbleColor: (c: BubbleColor) => void;
  setChatBg: (bg: ChatBg) => void;
  setFontSize: (s: FontSize) => void;
  setRoomName: (name: string) => void;
}

const saved = readStorage();

export const useChatTheme = create<ChatThemeState>((set, get) => ({
  bubbleColor: saved.bubbleColor ?? "blue",
  chatBg: saved.chatBg ?? "white",
  fontSize: saved.fontSize ?? "md",
  roomName: saved.roomName ?? DEFAULT_ROOM_NAME,

  setBubbleColor: (bubbleColor) => {
    set({ bubbleColor });
    const s = get();
    writeStorage({
      bubbleColor,
      chatBg: s.chatBg,
      fontSize: s.fontSize,
      roomName: s.roomName,
    });
  },
  setChatBg: (chatBg) => {
    set({ chatBg });
    const s = get();
    writeStorage({
      bubbleColor: s.bubbleColor,
      chatBg,
      fontSize: s.fontSize,
      roomName: s.roomName,
    });
  },
  setFontSize: (fontSize) => {
    set({ fontSize });
    const s = get();
    writeStorage({
      bubbleColor: s.bubbleColor,
      chatBg: s.chatBg,
      fontSize,
      roomName: s.roomName,
    });
  },
  setRoomName: (roomName) => {
    set({ roomName });
    const s = get();
    writeStorage({
      bubbleColor: s.bubbleColor,
      chatBg: s.chatBg,
      fontSize: s.fontSize,
      roomName,
    });
  },
}));
