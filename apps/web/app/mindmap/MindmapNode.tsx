"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import {
  NODE_COLORS,
  useMindmapStore,
  type MindmapNode,
  type NodeColorId,
} from "./useMindmapStore";

const DEFAULT_COLOR = NODE_COLORS[0];

function getColor(colorId?: NodeColorId) {
  return NODE_COLORS.find((c) => c.id === colorId) ?? DEFAULT_COLOR;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function MindmapNodeComponent({
  id,
  data,
  selected,
}: NodeProps<MindmapNode>) {
  const { updateNodeLabel, updateNodeColor, updateNodeImage, removeNode } =
    useMindmapStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);
  const [imgHover, setImgHover] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const color = getColor(data.color as NodeColorId | undefined);
  const imageUrl = data.imageUrl as string | undefined;

  useEffect(() => {
    if (!editing) setDraft(data.label);
  }, [data.label, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = useCallback(() => {
    const trimmed = draft.trim();
    updateNodeLabel(id, trimmed || data.label);
    setDraft(trimmed || data.label);
    setEditing(false);
  }, [draft, id, data.label, updateNodeLabel]);

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = await readFileAsDataUrl(file);
      updateNodeImage(id, url);
      e.target.value = "";
    },
    [id, updateNodeImage],
  );

  const showHandles = hovered || selected;

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          borderRadius: "10px",
          border: selected ? "2px solid #2563eb" : `2px solid ${color.border}`,
          backgroundColor: color.bg,
          boxShadow: selected
            ? "0 0 0 3px rgba(37,99,235,0.15), 0 2px 8px rgba(0,0,0,0.1)"
            : "0 1px 4px rgba(0,0,0,0.08)",
          minWidth: imageUrl ? "160px" : "100px",
          maxWidth: "220px",
          cursor: "grab",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          id="tl"
          style={{
            background: "#9ca3af",
            width: 8,
            height: 8,
            left: 0,
            opacity: showHandles ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        />
        <Handle
          type="target"
          position={Position.Top}
          id="tr"
          style={{
            background: "#9ca3af",
            width: 8,
            height: 8,
            left: "100%",
            opacity: showHandles ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        />

        {/* 이미지 영역 */}
        {imageUrl && (
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setImgHover(true)}
            onMouseLeave={() => setImgHover(false)}
          >
            <img
              src={imageUrl}
              alt={data.label || "image"}
              draggable={false}
              style={{
                display: "block",
                width: "100%",
                objectFit: "contain",
              }}
            />
            {/* 이미지 교체 오버레이 */}
            {selected && imgHover && (
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  fileRef.current?.click();
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.45)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 20 }}>📷</span>
                <span>이미지 변경</span>
              </button>
            )}
          </div>
        )}

        {/* 텍스트 영역 */}
        <div
          style={{ padding: "8px 12px" }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) commit();
                if (e.key === "Escape") {
                  setDraft(data.label);
                  setEditing(false);
                }
              }}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "13px",
                background: "transparent",
                textAlign: "center",
                cursor: "text",
                color: color.text,
              }}
            />
          ) : (
            <span
              style={{
                fontSize: "13px",
                display: "block",
                textAlign: "center",
                wordBreak: "break-word",
                lineHeight: 1.4,
                color: color.text,
                opacity: imageUrl && !data.label ? 0.4 : 1,
              }}
            >
              {data.label || (imageUrl ? "캡션 추가..." : "")}
            </span>
          )}
        </div>

        {/* 삭제 버튼 */}
        {selected && (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              removeNode(id);
            }}
            style={{
              position: "absolute",
              top: -9,
              right: -9,
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              zIndex: 10,
            }}
          >
            ×
          </button>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          id="bl"
          style={{
            background: "#9ca3af",
            width: 8,
            height: 8,
            left: 0,
            opacity: showHandles ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="br"
          style={{
            background: "#9ca3af",
            width: 8,
            height: 8,
            left: "100%",
            opacity: showHandles ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        />
      </div>

      {/* 숨겨진 파일 입력 (이미지 교체용) */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {/* 색상 팔레트 */}
      {selected && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 5,
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "5px 8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            zIndex: 20,
          }}
        >
          {NODE_COLORS.map((c) => {
            const active = (data.color ?? "white") === c.id;
            return (
              <button
                key={c.id}
                title={c.label}
                onClick={(e) => {
                  e.stopPropagation();
                  updateNodeColor(id, c.id as NodeColorId);
                }}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: c.bg,
                  border: active
                    ? "2px solid #2563eb"
                    : `1.5px solid ${c.border}`,
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: active ? "0 0 0 1px #2563eb" : "none",
                  transition: "transform 0.1s",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
