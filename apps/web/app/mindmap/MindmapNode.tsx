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

export function MindmapNodeComponent({
  id,
  data,
  selected,
}: NodeProps<MindmapNode>) {
  const { updateNodeLabel, updateNodeColor, removeNode } = useMindmapStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const color = getColor(data.color as NodeColorId | undefined);

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

  return (
    <div style={{ position: "relative" }}>
      {/* 메인 노드 */}
      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          border: selected ? `2px solid #2563eb` : `2px solid ${color.border}`,
          backgroundColor: color.bg,
          boxShadow: selected
            ? "0 0 0 3px rgba(37,99,235,0.15), 0 2px 8px rgba(0,0,0,0.1)"
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
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
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
            }}
          >
            {data.label}
          </span>
        )}

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
          style={{ background: "#9ca3af", width: 8, height: 8 }}
        />
      </div>

      {/* 색상 팔레트 — 선택됐을 때만 표시 */}
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
