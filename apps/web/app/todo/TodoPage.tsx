"use client";

import { useCallback, useRef, useState } from "react";
import { useTodoStore, type Checklist } from "./useTodoStore";

const ACCENT = "#2563eb";
const GREEN = "#16a34a";

function TodoPanel() {
  const { todos, addTodo, toggleTodo, removeTodo, clearDoneTodos } =
    useTodoStore();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    addTodo(text);
    setInput("");
    inputRef.current?.focus();
  }, [input, addTodo]);

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              margin: 0,
              color: "#0f172a",
            }}
          >
            ✅ 할 일
          </h2>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>
            {doneCount}/{todos.length} 완료
          </p>
        </div>
        {doneCount > 0 && (
          <button
            onClick={clearDoneTodos}
            style={{
              fontSize: 12,
              color: "#9ca3af",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 6,
            }}
          >
            완료 항목 삭제
          </button>
        )}
      </div>

      {/* 입력 */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.nativeEvent.isComposing && handleAdd()
          }
          placeholder="새 할 일 추가..."
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 14,
            outline: "none",
            color: "#111827",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            backgroundColor: input.trim() ? ACCENT : "#e5e7eb",
            color: input.trim() ? "#fff" : "#9ca3af",
            border: "none",
            cursor: input.trim() ? "pointer" : "default",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflowY: "auto",
          flex: 1,
        }}
      >
        {todos.length === 0 && (
          <li
            style={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 14,
              padding: "40px 0",
            }}
          >
            할 일을 추가해보세요
          </li>
        )}
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 8,
              backgroundColor: todo.done ? "#f8fafc" : "transparent",
              transition: "background 0.1s",
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              style={{
                width: 16,
                height: 16,
                cursor: "pointer",
                accentColor: GREEN,
              }}
            />
            <span
              style={{
                flex: 1,
                fontSize: 14,
                color: todo.done ? "#9ca3af" : "#111827",
                textDecoration: todo.done ? "line-through" : "none",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#d1d5db",
                fontSize: 16,
                lineHeight: 1,
                padding: 2,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChecklistCard({ list }: { list: Checklist }) {
  const {
    removeChecklist,
    renameChecklist,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
    clearCheckedItems,
  } = useTodoStore();

  const [input, setInput] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    addChecklistItem(list.id, text);
    setInput("");
    inputRef.current?.focus();
  }, [input, list.id, addChecklistItem]);

  const commitName = useCallback(() => {
    const name = nameDraft.trim();
    if (name) renameChecklist(list.id, name);
    else setNameDraft(list.name);
    setEditingName(false);
  }, [nameDraft, list.id, list.name, renameChecklist]);

  const checkedCount = list.items.filter((it) => it.checked).length;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {editingName ? (
          <input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName();
              if (e.key === "Escape") {
                setNameDraft(list.name);
                setEditingName(false);
              }
            }}
            autoFocus
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              borderBottom: `1.5px solid ${ACCENT}`,
              outline: "none",
              padding: "2px 0",
              color: "#0f172a",
              background: "transparent",
            }}
          />
        ) : (
          <button
            onDoubleClick={() => setEditingName(true)}
            style={{
              flex: 1,
              textAlign: "left",
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              color: "#0f172a",
              cursor: "text",
              padding: 0,
            }}
            title="더블클릭으로 이름 변경"
          >
            {list.name}
            <span
              style={{
                fontSize: 11,
                color: "#9ca3af",
                fontWeight: 400,
                marginLeft: 6,
              }}
            >
              {checkedCount}/{list.items.length}
            </span>
          </button>
        )}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {checkedCount > 0 && (
            <button
              onClick={() => clearCheckedItems(list.id)}
              style={{
                fontSize: 11,
                color: "#9ca3af",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              완료 삭제
            </button>
          )}
          <button
            onClick={() => removeChecklist(list.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#d1d5db",
              fontSize: 16,
              lineHeight: 1,
              padding: 2,
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* 항목 목록 */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {list.items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 4px",
              borderRadius: 6,
            }}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleChecklistItem(list.id, item.id)}
              style={{
                width: 15,
                height: 15,
                cursor: "pointer",
                accentColor: ACCENT,
              }}
            />
            <span
              style={{
                flex: 1,
                fontSize: 13,
                color: item.checked ? "#9ca3af" : "#374151",
                textDecoration: item.checked ? "line-through" : "none",
                wordBreak: "break-word",
              }}
            >
              {item.text}
            </span>
            <button
              onClick={() => removeChecklistItem(list.id, item.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#e5e7eb",
                fontSize: 14,
                lineHeight: 1,
                padding: 2,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {/* 항목 추가 */}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.nativeEvent.isComposing && handleAddItem()
          }
          placeholder="항목 추가..."
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            fontSize: 13,
            outline: "none",
            color: "#111827",
          }}
        />
        <button
          onClick={handleAddItem}
          disabled={!input.trim()}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            backgroundColor: input.trim() ? ACCENT : "#e5e7eb",
            color: input.trim() ? "#fff" : "#9ca3af",
            border: "none",
            cursor: input.trim() ? "pointer" : "default",
            fontSize: 13,
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ChecklistPanel() {
  const { checklists, addChecklist } = useTodoStore();
  const [input, setInput] = useState("");

  const handleAdd = useCallback(() => {
    const name = input.trim();
    if (!name) return;
    addChecklist(name);
    setInput("");
  }, [input, addChecklist]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minWidth: 0,
      }}
    >
      {/* 새 체크리스트 추가 */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            margin: "0 0 12px",
            color: "#0f172a",
          }}
        >
          📋 체크리스트
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.nativeEvent.isComposing && handleAdd()
            }
            placeholder="새 체크리스트 이름..."
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
              outline: "none",
              color: "#111827",
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              backgroundColor: input.trim() ? ACCENT : "#e5e7eb",
              color: input.trim() ? "#fff" : "#9ca3af",
              border: "none",
              cursor: input.trim() ? "pointer" : "default",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            추가
          </button>
        </div>
      </div>

      {/* 체크리스트 카드 목록 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          flex: 1,
        }}
      >
        {checklists.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 14,
              padding: "40px 0",
            }}
          >
            체크리스트를 추가해보세요
          </div>
        )}
        {checklists.map((list) => (
          <ChecklistCard key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}

export function TodoPage() {
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        height: "calc(100vh - 65px - 64px)",
        alignItems: "flex-start",
      }}
    >
      <TodoPanel />
      <ChecklistPanel />
    </div>
  );
}
