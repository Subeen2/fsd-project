import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TodoItem = { id: string; text: string; done: boolean };
type ChecklistItem = { id: string; text: string; checked: boolean };
type Checklist = { id: string; name: string; items: ChecklistItem[] };

const ACCENT = "#2563eb";
const GREEN = "#16a34a";
let uid = Date.now();

// ─── Todo Panel ───────────────────────────────────────────────────────────────

function TodoPanel({ initialTodos = [] }: { initialTodos?: TodoItem[] }) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: `todo-${uid++}`, text, done: false }]);
    setInput("");
    inputRef.current?.focus();
  }, [input]);

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div
      style={{
        width: 340,
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
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
            onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}
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

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {todos.length === 0 && (
          <li
            style={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 14,
              padding: "32px 0",
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
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() =>
                setTodos((prev) =>
                  prev.map((t) =>
                    t.id === todo.id ? { ...t, done: !t.done } : t,
                  ),
                )
              }
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
                wordBreak: "break-word",
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() =>
                setTodos((prev) => prev.filter((t) => t.id !== todo.id))
              }
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
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Checklist Card ───────────────────────────────────────────────────────────

function ChecklistCard({
  list,
  onRemove,
  onChange,
}: {
  list: Checklist;
  onRemove: () => void;
  onChange: (updated: Checklist) => void;
}) {
  const [input, setInput] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const addItem = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    onChange({
      ...list,
      items: [...list.items, { id: `item-${uid++}`, text, checked: false }],
    });
    setInput("");
    inputRef.current?.focus();
  }, [input, list, onChange]);

  const commitName = useCallback(() => {
    const name = nameDraft.trim();
    onChange({ ...list, name: name || list.name });
    setEditingName(false);
  }, [nameDraft, list, onChange]);

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
              background: "transparent",
              color: "#0f172a",
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
              onClick={() =>
                onChange({
                  ...list,
                  items: list.items.filter((it) => !it.checked),
                })
              }
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
            onClick={onRemove}
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
              onChange={() =>
                onChange({
                  ...list,
                  items: list.items.map((it) =>
                    it.id === item.id ? { ...it, checked: !it.checked } : it,
                  ),
                })
              }
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
              onClick={() =>
                onChange({
                  ...list,
                  items: list.items.filter((it) => it.id !== item.id),
                })
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#e5e7eb",
                fontSize: 14,
                lineHeight: 1,
                padding: 2,
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: 6 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.nativeEvent.isComposing && addItem()
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
          onClick={addItem}
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

// ─── Checklist Panel ──────────────────────────────────────────────────────────

function ChecklistPanel({ initialLists = [] }: { initialLists?: Checklist[] }) {
  const [lists, setLists] = useState<Checklist[]>(initialLists);
  const [input, setInput] = useState("");

  const handleAdd = useCallback(() => {
    const name = input.trim();
    if (!name) return;
    setLists((prev) => [...prev, { id: `list-${uid++}`, name, items: [] }]);
    setInput("");
  }, [input]);

  return (
    <div
      style={{ width: 340, display: "flex", flexDirection: "column", gap: 12 }}
    >
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

      {lists.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: 14,
            padding: "32px 0",
          }}
        >
          체크리스트를 추가해보세요
        </div>
      )}
      {lists.map((list) => (
        <ChecklistCard
          key={list.id}
          list={list}
          onRemove={() =>
            setLists((prev) => prev.filter((l) => l.id !== list.id))
          }
          onChange={(updated) =>
            setLists((prev) =>
              prev.map((l) => (l.id === updated.id ? updated : l)),
            )
          }
        />
      ))}
    </div>
  );
}

// ─── Combined view ────────────────────────────────────────────────────────────

function TodoPageDemo({
  initialTodos = [],
  initialLists = [],
}: {
  initialTodos?: TodoItem[];
  initialLists?: Checklist[];
}) {
  return (
    <div
      style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: 8 }}
    >
      <TodoPanel initialTodos={initialTodos} />
      <ChecklistPanel initialLists={initialLists} />
    </div>
  );
}

// ─── Preset data ──────────────────────────────────────────────────────────────

const sampleTodos: TodoItem[] = [
  { id: "t1", text: "Storybook 스토리 작성", done: true },
  { id: "t2", text: "PR 리뷰 완료하기", done: false },
  { id: "t3", text: "배포 전 QA 점검", done: false },
];

const sampleLists: Checklist[] = [
  {
    id: "l1",
    name: "장보기",
    items: [
      { id: "i1", text: "우유", checked: true },
      { id: "i2", text: "달걀", checked: true },
      { id: "i3", text: "두부", checked: false },
      { id: "i4", text: "양파", checked: false },
    ],
  },
  {
    id: "l2",
    name: "출시 체크리스트",
    items: [
      { id: "i5", text: "환경변수 설정 확인", checked: true },
      { id: "i6", text: "빌드 성공 여부", checked: false },
      { id: "i7", text: "Lighthouse 점수 측정", checked: false },
    ],
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof TodoPageDemo> = {
  title: "Todo/TodoPage",
  component: TodoPageDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [{ name: "light", value: "#f8fafc" }],
    },
    docs: {
      description: {
        component:
          "할 일 목록(Todo)과 체크리스트(Checklist) 기능. 항목 추가/체크/삭제, 완료 항목 일괄 삭제, 체크리스트 이름 더블클릭 편집을 지원합니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: "빈 상태",
  args: { initialTodos: [], initialLists: [] },
};

export const WithData: Story = {
  name: "데이터 있는 상태",
  args: { initialTodos: sampleTodos, initialLists: sampleLists },
};

export const TodoOnly: Story = {
  name: "할 일 목록만",
  render: () => <TodoPanel initialTodos={sampleTodos} />,
};

export const ChecklistOnly: Story = {
  name: "체크리스트만",
  render: () => <ChecklistPanel initialLists={sampleLists} />,
};

export const EmptyChecklist: Story = {
  name: "빈 체크리스트",
  render: () => (
    <ChecklistPanel
      initialLists={[{ id: "new", name: "새 리스트", items: [] }]}
    />
  ),
};
