"use client";

import { useState, useRef, useCallback } from "react";

const CANVAS_W = 600;
const CANVAS_H = 420;
const ACCENT = "#2563eb";

type FontWeight = "normal" | "bold";
type TextAlign = "left" | "center" | "right";
type FontFamily = "sans-serif" | "serif" | "monospace" | "cursive";

interface BaseEl {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface TextEl extends BaseEl {
  type: "text";
  content: string;
  fontSize: number;
  color: string;
  fontWeight: FontWeight;
  fontFamily: FontFamily;
  textAlign: TextAlign;
}

interface ImgEl extends BaseEl {
  type: "image";
  src: string;
}

type CardEl = TextEl | ImgEl;

interface ElPatch {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  content?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: FontWeight;
  fontFamily?: string;
  textAlign?: TextAlign;
  src?: string;
}

let _uid = Date.now();
const uid = () => `el-${_uid++}`;

type ResizeHandle = "tl" | "tr" | "bl" | "br";

interface ResizingState {
  id: string;
  handle: ResizeHandle;
  startMx: number;
  startMy: number;
  orig: { x: number; y: number; w: number; h: number };
}

const RESIZE_CURSORS: Record<ResizeHandle, string> = {
  tl: "nw-resize",
  tr: "ne-resize",
  bl: "sw-resize",
  br: "se-resize",
};

const DEFAULT_ELEMENTS: CardEl[] = [
  {
    id: "t1",
    type: "text",
    x: 100,
    y: 140,
    w: 400,
    h: 72,
    content: "🎉 초대합니다",
    fontSize: 40,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "serif",
    textAlign: "center",
  },
  {
    id: "t2",
    type: "text",
    x: 100,
    y: 230,
    w: 400,
    h: 40,
    content: "날짜와 장소를 입력하세요",
    fontSize: 16,
    color: "#64748b",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
];

// ─── Element Renderer ─────────────────────────────────────────────────────────

interface ElRendererProps {
  el: CardEl;
  selected: boolean;
  editing: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onTextChange: (v: string) => void;
  onTextBlur: () => void;
  onResizeStart: (e: React.PointerEvent, handle: ResizeHandle) => void;
}

const HANDLES: ResizeHandle[] = ["tl", "tr", "bl", "br"];
const handlePos: Record<ResizeHandle, React.CSSProperties> = {
  tl: { top: 0, left: 0, transform: "translate(-50%, -50%)" },
  tr: { top: 0, right: 0, transform: "translate(50%, -50%)" },
  bl: { bottom: 0, left: 0, transform: "translate(-50%, 50%)" },
  br: { bottom: 0, right: 0, transform: "translate(50%, 50%)" },
};

function ElRenderer({
  el,
  selected,
  editing,
  onPointerDown,
  onDoubleClick,
  onTextChange,
  onTextBlur,
  onResizeStart,
}: ElRendererProps) {
  const justifyContent =
    el.type === "text"
      ? el.textAlign === "left"
        ? "flex-start"
        : el.textAlign === "right"
          ? "flex-end"
          : "center"
      : "center";

  return (
    <div
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        width: el.w,
        height: el.h,
        outline: selected ? `2px solid ${ACCENT}` : "2px solid transparent",
        outlineOffset: 1,
        borderRadius: 4,
        cursor: editing ? "text" : "grab",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      {el.type === "text" &&
        (editing ? (
          <textarea
            autoFocus
            value={el.content}
            onChange={(e) => onTextChange(e.target.value)}
            onBlur={onTextBlur}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: el.fontSize,
              color: el.color,
              fontWeight: el.fontWeight,
              fontFamily: el.fontFamily,
              textAlign: el.textAlign,
              background: "transparent",
              cursor: "text",
              padding: 0,
              lineHeight: 1.4,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              fontSize: el.fontSize,
              color: el.color,
              fontWeight: el.fontWeight,
              fontFamily: el.fontFamily,
              textAlign: el.textAlign,
              display: "flex",
              alignItems: "center",
              justifyContent,
              lineHeight: 1.4,
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {el.content}
          </div>
        ))}

      {el.type === "image" && (
        <img
          src={el.src}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      )}

      {/* Resize handles — visible only when selected */}
      {selected &&
        HANDLES.map((h) => (
          <div
            key={h}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeStart(e, h);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              width: 9,
              height: 9,
              background: "#fff",
              border: `2px solid ${ACCENT}`,
              borderRadius: 2,
              cursor: RESIZE_CURSORS[h],
              zIndex: 10,
              ...handlePos[h],
            }}
          />
        ))}
    </div>
  );
}

// ─── Properties Panel ─────────────────────────────────────────────────────────

interface PanelProps {
  el: CardEl | null;
  onChange: (patch: ElPatch) => void;
  onDelete: () => void;
}

function PropertiesPanel({ el, onChange, onDelete }: PanelProps) {
  return (
    <div
      style={{
        width: 216,
        flexShrink: 0,
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        overflowY: "auto",
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>
        {el ? (el.type === "text" ? "텍스트 속성" : "이미지 속성") : "속성"}
      </p>

      {!el && (
        <p
          style={{
            fontSize: 12,
            color: "#9ca3af",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          요소를 클릭하면
          <br />
          속성을 편집할 수 있어요.
        </p>
      )}

      {el && (
        <>
          {/* Position */}
          <Section label="위치">
            <Row>
              <NumInput
                label="X"
                value={el.x}
                onChange={(v) => onChange({ x: v })}
              />
              <NumInput
                label="Y"
                value={el.y}
                onChange={(v) => onChange({ y: v })}
              />
            </Row>
          </Section>

          {/* Size */}
          <Section label="크기">
            <Row>
              <NumInput
                label="W"
                value={el.w}
                onChange={(v) => onChange({ w: v })}
              />
              <NumInput
                label="H"
                value={el.h}
                onChange={(v) => onChange({ h: v })}
              />
            </Row>
          </Section>

          {el.type === "text" && (
            <>
              {/* Content */}
              <Section label="내용">
                <textarea
                  value={el.content}
                  onChange={(e) => onChange({ content: e.target.value })}
                  rows={3}
                  style={{ ...inputBase, resize: "vertical", height: "auto" }}
                />
              </Section>

              {/* Font size */}
              <Section label={`폰트 크기 — ${el.fontSize}px`}>
                <input
                  type="range"
                  min={8}
                  max={96}
                  value={el.fontSize}
                  onChange={(e) => onChange({ fontSize: +e.target.value })}
                  style={{ width: "100%", accentColor: ACCENT }}
                />
              </Section>

              {/* Color */}
              <Section label="색상">
                <input
                  type="color"
                  value={el.color}
                  onChange={(e) => onChange({ color: e.target.value })}
                  style={{
                    width: "100%",
                    height: 32,
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    padding: 2,
                  }}
                />
              </Section>

              {/* Bold */}
              <Section label="굵기">
                <Row>
                  {(["normal", "bold"] as FontWeight[]).map((fw) => (
                    <ToggleBtn
                      key={fw}
                      active={el.fontWeight === fw}
                      onClick={() => onChange({ fontWeight: fw })}
                      style={{ fontWeight: fw }}
                    >
                      {fw === "normal" ? "보통" : "굵게"}
                    </ToggleBtn>
                  ))}
                </Row>
              </Section>

              {/* Text align */}
              <Section label="정렬">
                <Row>
                  {(["left", "center", "right"] as TextAlign[]).map((a) => (
                    <ToggleBtn
                      key={a}
                      active={el.textAlign === a}
                      onClick={() => onChange({ textAlign: a })}
                    >
                      {a === "left" ? "←" : a === "center" ? "↔" : "→"}
                    </ToggleBtn>
                  ))}
                </Row>
              </Section>

              {/* Font family */}
              <Section label="폰트">
                <select
                  value={el.fontFamily}
                  onChange={(e) =>
                    onChange({ fontFamily: e.target.value as FontFamily })
                  }
                  style={inputBase}
                >
                  <option value="sans-serif">Sans-serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="cursive">Cursive</option>
                </select>
              </Section>
            </>
          )}

          <div style={{ flex: 1 }} />
          <button
            onClick={onDelete}
            style={{
              padding: "8px 0",
              borderRadius: 8,
              backgroundColor: "#fee2e2",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            삭제
          </button>
        </>
      )}
    </div>
  );
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 6 }}>{children}</div>;
}

function NumInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 10, color: "#9ca3af" }}>{label}</span>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(+e.target.value)}
        style={inputBase}
      />
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
  style: extraStyle,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "5px 0",
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        fontSize: 12,
        backgroundColor: active ? ACCENT : "#fff",
        color: active ? "#fff" : "#374151",
        transition: "background 0.1s",
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "5px 8px",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  fontSize: 12,
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

// ─── Page type & capture helper ───────────────────────────────────────────────

interface Page {
  id: string;
  bgColor: string;
  elements: CardEl[];
}

async function capturePageAsDataUrl(
  page: Page,
  html2canvas: (
    el: HTMLElement,
    opts?: { useCORS?: boolean; scale?: number },
  ) => Promise<HTMLCanvasElement>,
): Promise<string> {
  const container = document.createElement("div");
  container.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${CANVAS_W}px;height:${CANVAS_H}px;background-color:${page.bgColor};overflow:hidden;`;

  page.elements.forEach((el) => {
    const div = document.createElement("div");
    div.style.cssText = `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.w}px;height:${el.h}px;`;

    if (el.type === "text") {
      div.style.fontSize = `${el.fontSize}px`;
      div.style.color = el.color;
      div.style.fontWeight = el.fontWeight;
      div.style.fontFamily = el.fontFamily;
      div.style.textAlign = el.textAlign;
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent =
        el.textAlign === "left"
          ? "flex-start"
          : el.textAlign === "right"
            ? "flex-end"
            : "center";
      div.style.wordBreak = "break-word";
      div.style.whiteSpace = "pre-wrap";
      div.style.lineHeight = "1.4";
      div.textContent = el.content;
    } else {
      const img = document.createElement("img");
      img.src = el.src;
      img.style.cssText =
        "width:100%;height:100%;object-fit:contain;display:block;";
      div.appendChild(img);
    }

    container.appendChild(div);
  });

  document.body.appendChild(container);
  try {
    const shot = await html2canvas(container, { useCORS: true, scale: 2 });
    return shot.toDataURL("image/png");
  } finally {
    document.body.removeChild(container);
  }
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

let _pageUid = Date.now() + 100000;
const pageUid = () => `pg-${_pageUid++}`;

export function InviteEditor() {
  const [pages, setPages] = useState<Page[]>([
    { id: "pg-1", bgColor: "#fff9f0", elements: DEFAULT_ELEMENTS },
  ]);
  const [currentPageId, setCurrentPageId] = useState("pg-1");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{
    id: string;
    ox: number;
    oy: number;
  } | null>(null);
  const [resizing, setResizing] = useState<ResizingState | null>(null);
  const [exporting, setExporting] = useState(false);
  const [pdfSaved, setPdfSaved] = useState(false);
  const [fileName, setFileName] = useState("invite");

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentPage = pages.find((p) => p.id === currentPageId) ?? pages[0]!;
  const els = currentPage.elements;
  const bgColor = currentPage.bgColor;
  const selected = els.find((e) => e.id === selectedId) ?? null;

  // ── Page helpers ──────────────────────────────────────────────────────────

  const setCurrentPageField = useCallback(
    (patch: Partial<Omit<Page, "id">>) => {
      setPages((prev) =>
        prev.map((p) => (p.id === currentPageId ? { ...p, ...patch } : p)),
      );
    },
    [currentPageId],
  );

  const addPage = useCallback(() => {
    const id = pageUid();
    setPages((prev) => [...prev, { id, bgColor: "#ffffff", elements: [] }]);
    setCurrentPageId(id);
    setSelectedId(null);
    setEditingId(null);
  }, []);

  const removePage = useCallback(
    (id: string) => {
      setPages((prev) => {
        if (prev.length <= 1) return prev;
        const idx = prev.findIndex((p) => p.id === id);
        const next = prev.filter((p) => p.id !== id);
        if (id === currentPageId) {
          setCurrentPageId(next[Math.max(0, idx - 1)]?.id ?? next[0]?.id ?? "");
          setSelectedId(null);
          setEditingId(null);
        }
        return next;
      });
    },
    [currentPageId],
  );

  const switchPage = useCallback(
    (id: string) => {
      if (id === currentPageId) return;
      setCurrentPageId(id);
      setSelectedId(null);
      setEditingId(null);
      setDragging(null);
      setResizing(null);
    },
    [currentPageId],
  );

  // ── Element helpers ───────────────────────────────────────────────────────

  const updateEl = useCallback(
    (id: string, patch: ElPatch) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === currentPageId
            ? {
                ...p,
                elements: p.elements.map((e) =>
                  e.id === id ? ({ ...e, ...patch } as CardEl) : e,
                ),
              }
            : p,
        ),
      );
    },
    [currentPageId],
  );

  const deleteEl = useCallback(
    (id: string) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === currentPageId
            ? { ...p, elements: p.elements.filter((e) => e.id !== id) }
            : p,
        ),
      );
      setSelectedId(null);
      setEditingId(null);
    },
    [currentPageId],
  );

  const addText = useCallback(() => {
    const id = uid();
    const el: TextEl = {
      id,
      type: "text",
      x: CANVAS_W / 2 - 150,
      y: CANVAS_H / 2 - 20,
      w: 300,
      h: 40,
      content: "텍스트를 입력하세요",
      fontSize: 18,
      color: "#0f172a",
      fontWeight: "normal",
      fontFamily: "sans-serif",
      textAlign: "center",
    };
    setCurrentPageField({ elements: [...els, el] });
    setSelectedId(id);
  }, [els, setCurrentPageField]);

  const handleImageFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const id = uid();
        const el: ImgEl = {
          id,
          type: "image",
          x: CANVAS_W / 2 - 100,
          y: CANVAS_H / 2 - 75,
          w: 200,
          h: 150,
          src,
        };
        setPages((prev) =>
          prev.map((p) =>
            p.id === currentPageId
              ? { ...p, elements: [...p.elements, el] }
              : p,
          ),
        );
        setSelectedId(id);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [currentPageId],
  );

  const startDrag = useCallback(
    (e: React.PointerEvent, id: string) => {
      e.stopPropagation();
      if (editingId === id) return;
      setSelectedId(id);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const el = els.find((el) => el.id === id);
      if (!el) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging({
        id,
        ox: e.clientX - rect.left - el.x,
        oy: e.clientY - rect.top - el.y,
      });
    },
    [els, editingId],
  );

  const startResize = useCallback(
    (e: React.PointerEvent, id: string, handle: ResizeHandle) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const el = els.find((el) => el.id === id);
      if (!el) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setResizing({
        id,
        handle,
        startMx: e.clientX - rect.left,
        startMy: e.clientY - rect.top,
        orig: { x: el.x, y: el.y, w: el.w, h: el.h },
      });
    },
    [els],
  );

  const onCanvasPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (dragging) {
        const el = els.find((el) => el.id === dragging.id);
        if (!el) return;
        const newX = Math.max(
          0,
          Math.min(e.clientX - rect.left - dragging.ox, CANVAS_W - el.w),
        );
        const newY = Math.max(
          0,
          Math.min(e.clientY - rect.top - dragging.oy, CANVAS_H - el.h),
        );
        updateEl(dragging.id, { x: newX, y: newY });
      }

      if (resizing) {
        const MIN = 20;
        const dx = e.clientX - rect.left - resizing.startMx;
        const dy = e.clientY - rect.top - resizing.startMy;
        const { x: sx, y: sy, w: sw, h: sh } = resizing.orig;
        let nx = sx,
          ny = sy,
          nw = sw,
          nh = sh;

        switch (resizing.handle) {
          case "br":
            nw = Math.max(MIN, sw + dx);
            nh = Math.max(MIN, sh + dy);
            break;
          case "bl":
            nw = Math.max(MIN, sw - dx);
            nx = sx + sw - nw;
            nh = Math.max(MIN, sh + dy);
            break;
          case "tr":
            nw = Math.max(MIN, sw + dx);
            nh = Math.max(MIN, sh - dy);
            ny = sy + sh - nh;
            break;
          case "tl":
            nw = Math.max(MIN, sw - dx);
            nx = sx + sw - nw;
            nh = Math.max(MIN, sh - dy);
            ny = sy + sh - nh;
            break;
        }

        updateEl(resizing.id, { x: nx, y: ny, w: nw, h: nh });
      }
    },
    [dragging, resizing, els, updateEl],
  );

  const exportPNG = useCallback(async () => {
    setEditingId(null);
    setSelectedId(null);
    setExporting(true);
    await new Promise<void>((r) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => r());
      });
    });
    const { default: html2canvas } = await import("html2canvas");
    const el = canvasRef.current;
    if (!el) {
      setExporting(false);
      return;
    }
    const shot = await html2canvas(el, { useCORS: true, scale: 2 });
    const link = document.createElement("a");
    link.download = `${fileName || "invite"}.png`;
    link.href = shot.toDataURL("image/png");
    link.click();
    setExporting(false);
  }, []);

  const exportPDF = useCallback(async () => {
    setEditingId(null);
    setSelectedId(null);
    setExporting(true);
    await new Promise<void>((r) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => r());
      });
    });
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [CANVAS_W, CANVAS_H],
    });
    for (let i = 0; i < pages.length; i++) {
      const imgData = await capturePageAsDataUrl(pages[i]!, html2canvas);
      if (i > 0) pdf.addPage([CANVAS_W, CANVAS_H], "l");
      pdf.addImage(imgData, "PNG", 0, 0, CANVAS_W, CANVAS_H);
    }
    pdf.save(`${fileName || "invite"}.pdf`);
    setPdfSaved(true);
    setExporting(false);
  }, [pages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "calc(100vh - 65px - 64px)",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={addText} style={toolBtn}>
          + 텍스트
        </button>
        <button onClick={() => fileRef.current?.click()} style={toolBtn}>
          + 이미지
        </button>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#374151",
            cursor: "pointer",
          }}
        >
          배경색
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setCurrentPageField({ bgColor: e.target.value })}
            style={{
              width: 32,
              height: 28,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              padding: 2,
            }}
          />
        </label>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="파일명"
            style={{
              ...toolBtn,
              width: 120,
              padding: "7px 10px",
              outline: "none",
            }}
          />
          <span style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0 }}>
            .png / .pdf
          </span>
        </div>
        <button
          onClick={exportPNG}
          disabled={exporting}
          style={{
            ...toolBtn,
            backgroundColor: ACCENT,
            color: "#fff",
            border: "none",
          }}
        >
          {exporting ? "처리 중..." : "PNG 저장"}
        </button>
        <button
          onClick={exportPDF}
          disabled={exporting}
          style={{
            ...toolBtn,
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
          }}
        >
          {exporting ? "처리 중..." : `PDF 저장 (${pages.length}장)`}
        </button>
        <button
          disabled={!pdfSaved}
          onClick={() => {
            setPages([
              { id: "pg-1", bgColor: "#fff9f0", elements: DEFAULT_ELEMENTS },
            ]);
            setCurrentPageId("pg-1");
            setSelectedId(null);
            setEditingId(null);
            setPdfSaved(false);
          }}
          style={{
            ...toolBtn,
            backgroundColor: pdfSaved ? "#f1f5f9" : "#f8fafc",
            color: pdfSaved ? "#374151" : "#d1d5db",
            cursor: pdfSaved ? "pointer" : "not-allowed",
            border: `1px solid ${pdfSaved ? "#e5e7eb" : "#f1f5f9"}`,
          }}
        >
          초기화
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageFile}
      />

      {/* Content */}
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        {/* Page sidebar */}
        <div
          style={{
            width: 80,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflowY: "auto",
            paddingBottom: 4,
          }}
        >
          {pages.map((page, idx) => (
            <div
              key={page.id}
              onClick={() => switchPage(page.id)}
              style={{
                position: "relative",
                width: 72,
                height: 52,
                borderRadius: 6,
                border: `2px solid ${page.id === currentPageId ? ACCENT : "#e5e7eb"}`,
                backgroundColor: page.bgColor,
                cursor: "pointer",
                flexShrink: 0,
                boxShadow:
                  page.id === currentPageId
                    ? "0 0 0 1px #2563eb"
                    : "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  bottom: 3,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 10,
                  color: "#6b7280",
                  pointerEvents: "none",
                }}
              >
                {idx + 1}
              </span>
              {pages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePage(page.id);
                  }}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addPage}
            style={{
              width: 72,
              height: 36,
              borderRadius: 6,
              border: "1.5px dashed #d1d5db",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            +
          </button>
        </div>

        {/* Canvas wrapper */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          <div
            ref={canvasRef}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={() => {
              setDragging(null);
              setResizing(null);
            }}
            onClick={() => {
              setSelectedId(null);
              setEditingId(null);
            }}
            style={{
              position: "relative",
              width: CANVAS_W,
              height: CANVAS_H,
              backgroundColor: bgColor,
              boxShadow: "0 4px 32px rgba(0,0,0,0.14)",
              borderRadius: 8,
              overflow: "visible",
              cursor: dragging ? "grabbing" : "default",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 8,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            />
            {els.map((el) => (
              <ElRenderer
                key={el.id}
                el={el}
                selected={!exporting && selectedId === el.id}
                editing={editingId === el.id}
                onPointerDown={(e) => startDrag(e, el.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (el.type === "text") {
                    setEditingId(el.id);
                    setSelectedId(el.id);
                  }
                }}
                onTextChange={(v) => updateEl(el.id, { content: v })}
                onTextBlur={() => setEditingId(null)}
                onResizeStart={(e, handle) => startResize(e, el.id, handle)}
              />
            ))}
          </div>
        </div>

        {/* Properties panel */}
        {!exporting && (
          <PropertiesPanel
            el={selected}
            onChange={(patch) => selected && updateEl(selected.id, patch)}
            onDelete={() => selected && deleteEl(selected.id)}
          />
        )}
      </div>
    </div>
  );
}

const toolBtn: React.CSSProperties = {
  padding: "7px 14px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
  color: "#374151",
};
