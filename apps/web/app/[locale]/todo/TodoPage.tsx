"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTodoStore, type Checklist } from "./useTodoStore";

const LIME = "#C8F060";
const LIME_DARK = "#9DD630";
const YELLOW = "#FFE566";
const CREAM = "#F5F0E8";
const CARD_BG = "#FFFFFF";
const INK = "#1A1A18";
const MUTED = "#A8A49A";
const ROSE = "#FFD6CC";

const MONTHS_KO = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getISOWeek(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function buildCalendarWeeks(year: number, month: number) {
  // month: 0-based
  const firstDay = new Date(year, month, 1);
  // ISO: Monday=0
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: Array<{ date: Date; inMonth: boolean }> = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrev - i),
      inMonth: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: new Date(year, month + 1, d), inMonth: false });
  }

  const weeks: Array<{ week: number; days: typeof cells }> = [];
  for (let i = 0; i < cells.length; i += 7) {
    const slice = cells.slice(i, i + 7);
    weeks.push({ week: getISOWeek(slice[0]!.date), days: slice });
  }
  return weeks;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function CalendarPanel({
  selected,
  onSelect,
}: {
  selected: Date;
  onSelect: (d: Date) => void;
}) {
  const { todos, checklists } = useTodoStore();
  const activeDates = useMemo(() => {
    const s = new Set<string>();
    todos.forEach((t) => t.date && s.add(t.date));
    checklists.forEach((l) => l.date && s.add(l.date));
    return s;
  }, [todos, checklists]);
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const weeks = useMemo(
    () => buildCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isToday = (d: Date) => isSameDay(d, today);
  const isSelected = (d: Date) => isSameDay(d, selected);
  const hasTodos = (d: Date) => activeDates.has(dateKey(d));

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* 큰 날짜 헤더 */}
      <div style={{ padding: "4px 0" }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: INK,
            margin: 0,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
          }}
        >
          {String(selected.getDate()).padStart(2, "0")},{" "}
          {MONTHS_KO[selected.getMonth()]} {selected.getFullYear()}
        </h2>
      </div>

      {/* 달력 카드 */}
      <div
        style={{
          backgroundColor: CARD_BG,
          borderRadius: 20,
          padding: "18px 14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* 월 네비게이션 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <button
            onClick={prevMonth}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: MUTED,
              fontSize: 16,
              padding: "4px 8px",
              borderRadius: 8,
              lineHeight: 1,
            }}
          >
            ‹
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>
            {MONTHS_KO[viewMonth]}
          </span>
          <button
            onClick={nextMonth}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: MUTED,
              fontSize: 16,
              padding: "4px 8px",
              borderRadius: 8,
              lineHeight: 1,
            }}
          >
            ›
          </button>
        </div>

        {/* 요일 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px 0",
            marginBottom: 4,
          }}
        >
          {DAYS.map((d, i) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                fontSize: 11,
                fontWeight: 600,
                color: i >= 5 ? "#E05050" : MUTED,
                paddingBottom: 6,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 주별 행 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {weeks.map(({ week, days }) => (
            <div
              key={week}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                alignItems: "center",
                gap: "0 2px",
              }}
            >
              {days.map(({ date, inMonth }, di) => {
                const isSel = isSelected(date);
                const isTod = isToday(date);
                const isWeekend = di >= 5;
                const dayNum = date.getDate();

                return (
                  <button
                    key={di}
                    onClick={() => onSelect(date)}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      fontSize: 12,
                      fontWeight: isTod || isSel ? 700 : 400,
                      backgroundColor: isSel
                        ? INK
                        : isTod
                          ? "#E8E3DA"
                          : "transparent",
                      color: isSel
                        ? "#FFFFFF"
                        : !inMonth
                          ? "#D0CAC0"
                          : isWeekend
                            ? "#E05050"
                            : INK,
                      transition: "background 0.1s",
                      padding: "2px 0",
                    }}
                  >
                    {dayNum}
                    {hasTodos(date) && (
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          backgroundColor: isSel ? LIME : LIME_DARK,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `conic-gradient(${LIME_DARK} ${pct * 3.6}deg, #E5E0D8 0deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: CARD_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: INK }}>
            {pct}%
          </span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>
          {done}/{total}
        </div>
        <div style={{ fontSize: 11, color: MUTED }}>완료</div>
      </div>
    </div>
  );
}

function TodoPanel({ selectedDate }: { selectedDate: Date }) {
  const { todos, addTodo, toggleTodo, removeTodo, clearDoneTodos } =
    useTodoStore();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const key = dateKey(selectedDate);
  const dayTodos = useMemo(
    () => todos.filter((t) => t.date === key),
    [todos, key],
  );

  const handleAdd = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    addTodo(text, key);
    setInput("");
    inputRef.current?.focus();
  }, [input, addTodo, key]);

  const doneCount = dayTodos.filter((t) => t.done).length;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* 헤더 카드 */}
      <div
        style={{
          backgroundColor: LIME,
          borderRadius: 28,
          padding: "28px 28px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 장식 blob */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
            backgroundColor: LIME_DARK,
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: 60,
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: CARD_BG,
            opacity: 0.25,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#4A6B10",
                margin: "0 0 4px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {dateKey(selectedDate) === dateKey(new Date()) ? "Today" : key}
            </p>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
                color: INK,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              할 일
            </h2>
          </div>
          <ProgressRing done={doneCount} total={dayTodos.length} />
        </div>

        {doneCount > 0 && (
          <button
            onClick={() => clearDoneTodos(key)}
            style={{
              marginTop: 16,
              fontSize: 12,
              fontWeight: 600,
              color: "#4A6B10",
              background: "rgba(0,0,0,0.08)",
              border: "none",
              cursor: "pointer",
              padding: "6px 14px",
              borderRadius: 20,
              display: "inline-block",
            }}
          >
            완료 항목 삭제
          </button>
        )}
      </div>

      {/* 입력 카드 */}
      <div
        style={{
          backgroundColor: CARD_BG,
          borderRadius: 20,
          padding: "16px 18px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          gap: 8,
        }}
      >
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
            padding: "10px 16px",
            borderRadius: 14,
            border: "none",
            backgroundColor: CREAM,
            fontSize: 14,
            outline: "none",
            color: INK,
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          style={{
            padding: "10px 18px",
            borderRadius: 14,
            backgroundColor: input.trim() ? INK : "#E5E0D8",
            color: input.trim() ? LIME : MUTED,
            border: "none",
            cursor: input.trim() ? "pointer" : "default",
            fontSize: 14,
            fontWeight: 700,
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          + 추가
        </button>
      </div>

      {/* 목록 */}
      <div
        style={{
          backgroundColor: CARD_BG,
          borderRadius: 20,
          padding: "8px 12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {dayTodos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: MUTED,
              fontSize: 14,
              padding: "48px 0",
            }}
          >
            할 일을 추가해보세요 :)
          </div>
        ) : (
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
            {dayTodos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 10px",
                  borderRadius: 14,
                  backgroundColor: todo.done ? CREAM : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2.5px solid ${todo.done ? LIME_DARK : "#D0CAC0"}`,
                    backgroundColor: todo.done ? LIME : "transparent",
                    cursor: "pointer",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    padding: 0,
                  }}
                >
                  {todo.done && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path
                        d="M1 4L4 7L10 1"
                        stroke="#2A5500"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: todo.done ? 400 : 500,
                    color: todo.done ? MUTED : INK,
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
                    color: "#C8C3B8",
                    fontSize: 18,
                    lineHeight: 1,
                    padding: "0 2px",
                    flexShrink: 0,
                    fontWeight: 300,
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
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
  const pct =
    list.items.length === 0
      ? 0
      : Math.round((checkedCount / list.items.length) * 100);

  return (
    <div
      style={{
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: "18px 18px 14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
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
              fontSize: 15,
              fontWeight: 700,
              border: "none",
              borderBottom: `2px solid ${LIME_DARK}`,
              outline: "none",
              padding: "2px 0",
              color: INK,
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
              fontSize: 15,
              fontWeight: 700,
              color: INK,
              cursor: "text",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            title="더블클릭으로 이름 변경"
          >
            {list.name}
          </button>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: pct === 100 ? "#4A6B10" : MUTED,
              backgroundColor: pct === 100 ? LIME : CREAM,
              padding: "3px 8px",
              borderRadius: 20,
            }}
          >
            {checkedCount}/{list.items.length}
          </span>
          {checkedCount > 0 && (
            <button
              onClick={() => clearCheckedItems(list.id)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: MUTED,
                background: CREAM,
                border: "none",
                cursor: "pointer",
                padding: "3px 8px",
                borderRadius: 20,
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
              color: "#C8C3B8",
              fontSize: 18,
              lineHeight: 1,
              padding: "0 2px",
              fontWeight: 300,
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* 진행 바 */}
      {list.items.length > 0 && (
        <div
          style={{
            height: 4,
            borderRadius: 4,
            backgroundColor: CREAM,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              backgroundColor: LIME_DARK,
              borderRadius: 4,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      {/* 항목 목록 */}
      {list.items.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {list.items.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 6px",
                borderRadius: 10,
                backgroundColor: item.checked ? CREAM : "transparent",
              }}
            >
              <button
                onClick={() => toggleChecklistItem(list.id, item.id)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${item.checked ? LIME_DARK : "#D0CAC0"}`,
                  backgroundColor: item.checked ? LIME : "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  transition: "all 0.15s",
                }}
              >
                {item.checked && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3L3.5 5.5L8 1"
                      stroke="#2A5500"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: item.checked ? 400 : 500,
                  color: item.checked ? MUTED : "#3A3830",
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
                  color: "#D0CAC0",
                  fontSize: 15,
                  lineHeight: 1,
                  padding: 2,
                  flexShrink: 0,
                  fontWeight: 300,
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 항목 추가 */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 2,
        }}
      >
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
            padding: "8px 12px",
            borderRadius: 12,
            border: "none",
            backgroundColor: CREAM,
            fontSize: 13,
            outline: "none",
            color: INK,
          }}
        />
        <button
          onClick={handleAddItem}
          disabled={!input.trim()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: input.trim() ? INK : "#E5E0D8",
            color: input.trim() ? LIME : MUTED,
            border: "none",
            cursor: input.trim() ? "pointer" : "default",
            fontSize: 20,
            fontWeight: 300,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.15s",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ChecklistPanel({ selectedDate }: { selectedDate: Date }) {
  const { checklists, addChecklist } = useTodoStore();
  const [input, setInput] = useState("");

  const key = dateKey(selectedDate);
  const dayChecklists = useMemo(
    () => checklists.filter((l) => l.date === key),
    [checklists, key],
  );

  const handleAdd = useCallback(() => {
    const name = input.trim();
    if (!name) return;
    addChecklist(name, key);
    setInput("");
  }, [input, addChecklist, key]);

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* 헤더 카드 */}
      <div
        style={{
          backgroundColor: YELLOW,
          borderRadius: 28,
          padding: "28px 28px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: 30,
            width: 90,
            height: 90,
            borderRadius: "40% 60% 55% 45% / 50% 45% 55% 50%",
            backgroundColor: "#FFD000",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -15,
            right: -10,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: ROSE,
            opacity: 0.5,
          }}
        />
        <div style={{ position: "relative" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#7A5F00",
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {dateKey(selectedDate) === dateKey(new Date()) ? "Today" : key}
          </p>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: "0 0 16px",
              color: INK,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            체크리스트
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
                padding: "10px 16px",
                borderRadius: 14,
                border: "none",
                backgroundColor: "rgba(255,255,255,0.65)",
                fontSize: 14,
                outline: "none",
                color: INK,
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              style={{
                padding: "10px 18px",
                borderRadius: 14,
                backgroundColor: input.trim() ? INK : "rgba(0,0,0,0.12)",
                color: input.trim() ? YELLOW : "#8A7A40",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
            >
              + 추가
            </button>
          </div>
        </div>
      </div>

      {/* 체크리스트 목록 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          flex: 1,
        }}
      >
        {dayChecklists.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: MUTED,
              fontSize: 14,
              padding: "48px 0",
            }}
          >
            체크리스트를 추가해보세요 :)
          </div>
        ) : (
          dayChecklists.map((list) => (
            <ChecklistCard key={list.id} list={list} />
          ))
        )}
      </div>
    </div>
  );
}

export function TodoPage() {
  const [selected, setSelected] = useState<Date>(() => new Date());

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        height: "calc(100vh - 65px - 64px)",
        alignItems: "flex-start",
        backgroundColor: CREAM,
        padding: "8px 24px",
      }}
    >
      <CalendarPanel selected={selected} onSelect={setSelected} />
      <TodoPanel selectedDate={selected} />
      <ChecklistPanel selectedDate={selected} />
    </div>
  );
}
