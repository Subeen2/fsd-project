import { beforeEach, describe, expect, it } from "vitest";
import { useTodoStore } from "../useTodoStore";

const TODAY = "2026-06-16";
const OTHER = "2026-06-17";

beforeEach(() => {
  localStorage.clear();
  useTodoStore.setState({ todos: [], checklists: [] });
});

describe("useTodoStore — todos", () => {
  it("초기 상태는 빈 배열", () => {
    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  it("addTodo — 할 일 추가", () => {
    useTodoStore.getState().addTodo("운동하기", TODAY);
    const { todos } = useTodoStore.getState();
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe("운동하기");
    expect(todos[0].date).toBe(TODAY);
    expect(todos[0].done).toBe(false);
  });

  it("addTodo — 여러 개 추가 시 id 중복 없음", () => {
    useTodoStore.getState().addTodo("A", TODAY);
    useTodoStore.getState().addTodo("B", TODAY);
    const { todos } = useTodoStore.getState();
    expect(todos[0].id).not.toBe(todos[1].id);
  });

  it("toggleTodo — done 상태 토글", () => {
    useTodoStore.getState().addTodo("운동하기", TODAY);
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().toggleTodo(id);
    expect(useTodoStore.getState().todos[0].done).toBe(true);
    useTodoStore.getState().toggleTodo(id);
    expect(useTodoStore.getState().todos[0].done).toBe(false);
  });

  it("removeTodo — 특정 할 일 삭제", () => {
    useTodoStore.getState().addTodo("삭제될 항목", TODAY);
    useTodoStore.getState().addTodo("남을 항목", TODAY);
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().removeTodo(id);
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].text).toBe("남을 항목");
  });

  it("clearDoneTodos — 특정 날짜의 완료 항목만 삭제", () => {
    useTodoStore.getState().addTodo("오늘 완료", TODAY);
    useTodoStore.getState().addTodo("오늘 미완료", TODAY);
    useTodoStore.getState().addTodo("다른 날 완료", OTHER);

    const todos = useTodoStore.getState().todos;
    useTodoStore.getState().toggleTodo(todos[0].id);
    useTodoStore.getState().toggleTodo(todos[2].id);

    useTodoStore.getState().clearDoneTodos(TODAY);

    const remaining = useTodoStore.getState().todos;
    expect(remaining).toHaveLength(2);
    expect(remaining.map((t) => t.text)).toContain("오늘 미완료");
    expect(remaining.map((t) => t.text)).toContain("다른 날 완료");
  });

  it("addTodo — localStorage에 저장", () => {
    useTodoStore.getState().addTodo("저장 확인", TODAY);
    const stored = JSON.parse(localStorage.getItem("fsd-todo")!);
    expect(stored.todos[0].text).toBe("저장 확인");
  });
});

describe("useTodoStore — checklists", () => {
  it("addChecklist — 체크리스트 생성", () => {
    useTodoStore.getState().addChecklist("장보기", TODAY);
    const { checklists } = useTodoStore.getState();
    expect(checklists).toHaveLength(1);
    expect(checklists[0].name).toBe("장보기");
    expect(checklists[0].items).toHaveLength(0);
  });

  it("removeChecklist — 체크리스트 삭제", () => {
    useTodoStore.getState().addChecklist("A", TODAY);
    useTodoStore.getState().addChecklist("B", TODAY);
    const id = useTodoStore.getState().checklists[0].id;
    useTodoStore.getState().removeChecklist(id);
    expect(useTodoStore.getState().checklists).toHaveLength(1);
    expect(useTodoStore.getState().checklists[0].name).toBe("B");
  });

  it("renameChecklist — 이름 변경", () => {
    useTodoStore.getState().addChecklist("원래 이름", TODAY);
    const id = useTodoStore.getState().checklists[0].id;
    useTodoStore.getState().renameChecklist(id, "바뀐 이름");
    expect(useTodoStore.getState().checklists[0].name).toBe("바뀐 이름");
  });

  it("addChecklistItem — 항목 추가", () => {
    useTodoStore.getState().addChecklist("장보기", TODAY);
    const listId = useTodoStore.getState().checklists[0].id;
    useTodoStore.getState().addChecklistItem(listId, "우유");
    useTodoStore.getState().addChecklistItem(listId, "계란");
    const items = useTodoStore.getState().checklists[0].items;
    expect(items).toHaveLength(2);
    expect(items[0].text).toBe("우유");
    expect(items[0].checked).toBe(false);
  });

  it("toggleChecklistItem — 항목 체크 토글", () => {
    useTodoStore.getState().addChecklist("장보기", TODAY);
    const listId = useTodoStore.getState().checklists[0].id;
    useTodoStore.getState().addChecklistItem(listId, "우유");
    const itemId = useTodoStore.getState().checklists[0].items[0].id;
    useTodoStore.getState().toggleChecklistItem(listId, itemId);
    expect(useTodoStore.getState().checklists[0].items[0].checked).toBe(true);
    useTodoStore.getState().toggleChecklistItem(listId, itemId);
    expect(useTodoStore.getState().checklists[0].items[0].checked).toBe(false);
  });

  it("removeChecklistItem — 항목 삭제", () => {
    useTodoStore.getState().addChecklist("장보기", TODAY);
    const listId = useTodoStore.getState().checklists[0].id;
    useTodoStore.getState().addChecklistItem(listId, "우유");
    useTodoStore.getState().addChecklistItem(listId, "계란");
    const itemId = useTodoStore.getState().checklists[0].items[0].id;
    useTodoStore.getState().removeChecklistItem(listId, itemId);
    expect(useTodoStore.getState().checklists[0].items).toHaveLength(1);
    expect(useTodoStore.getState().checklists[0].items[0].text).toBe("계란");
  });

  it("clearCheckedItems — 체크된 항목만 삭제", () => {
    useTodoStore.getState().addChecklist("장보기", TODAY);
    const listId = useTodoStore.getState().checklists[0].id;
    useTodoStore.getState().addChecklistItem(listId, "우유");
    useTodoStore.getState().addChecklistItem(listId, "계란");
    useTodoStore.getState().addChecklistItem(listId, "빵");
    const items = useTodoStore.getState().checklists[0].items;
    useTodoStore.getState().toggleChecklistItem(listId, items[0].id);
    useTodoStore.getState().toggleChecklistItem(listId, items[2].id);
    useTodoStore.getState().clearCheckedItems(listId);
    expect(useTodoStore.getState().checklists[0].items).toHaveLength(1);
    expect(useTodoStore.getState().checklists[0].items[0].text).toBe("계란");
  });
});
