import { beforeEach, describe, expect, it } from "vitest";
import { useMindmapStore } from "../useMindmapStore";

beforeEach(() => {
  localStorage.clear();
  useMindmapStore.setState({
    boards: [{ id: "board-default", name: "보드 1", nodes: [], edges: [] }],
    currentBoardId: "board-default",
    nodes: [],
    edges: [],
  });
});

describe("useMindmapStore — 노드", () => {
  it("초기 상태는 노드 없음", () => {
    expect(useMindmapStore.getState().nodes).toHaveLength(0);
  });

  it("addNode — 노드 추가", () => {
    useMindmapStore.getState().addNode("아이디어", { x: 100, y: 200 });
    const { nodes } = useMindmapStore.getState();
    expect(nodes).toHaveLength(1);
    expect(nodes[0].data.label).toBe("아이디어");
    expect(nodes[0].position).toEqual({ x: 100, y: 200 });
    expect(nodes[0].type).toBe("mindmap");
  });

  it("addNode — 이미지 URL 포함 추가", () => {
    useMindmapStore
      .getState()
      .addNode("이미지 노드", { x: 0, y: 0 }, "https://example.com/img.png");
    const node = useMindmapStore.getState().nodes[0];
    expect(node.data.imageUrl).toBe("https://example.com/img.png");
  });

  it("addNode — 여러 노드 추가 시 id 중복 없음", () => {
    useMindmapStore.getState().addNode("A", { x: 0, y: 0 });
    useMindmapStore.getState().addNode("B", { x: 100, y: 0 });
    const { nodes } = useMindmapStore.getState();
    expect(nodes[0].id).not.toBe(nodes[1].id);
  });

  it("updateNodeLabel — 라벨 변경", () => {
    useMindmapStore.getState().addNode("원래 라벨", { x: 0, y: 0 });
    const id = useMindmapStore.getState().nodes[0].id;
    useMindmapStore.getState().updateNodeLabel(id, "바뀐 라벨");
    expect(useMindmapStore.getState().nodes[0].data.label).toBe("바뀐 라벨");
  });

  it("updateNodeColor — 색상 변경", () => {
    useMindmapStore.getState().addNode("노드", { x: 0, y: 0 });
    const id = useMindmapStore.getState().nodes[0].id;
    useMindmapStore.getState().updateNodeColor(id, "purple");
    expect(useMindmapStore.getState().nodes[0].data.color).toBe("purple");
  });

  it("updateNodeImage — 이미지 변경", () => {
    useMindmapStore.getState().addNode("노드", { x: 0, y: 0 });
    const id = useMindmapStore.getState().nodes[0].id;
    useMindmapStore.getState().updateNodeImage(id, "https://new.com/img.png");
    expect(useMindmapStore.getState().nodes[0].data.imageUrl).toBe(
      "https://new.com/img.png",
    );
  });

  it("removeNode — 노드 삭제", () => {
    useMindmapStore.getState().addNode("삭제될 노드", { x: 0, y: 0 });
    useMindmapStore.getState().addNode("남을 노드", { x: 100, y: 0 });
    const id = useMindmapStore.getState().nodes[0].id;
    useMindmapStore.getState().removeNode(id);
    expect(useMindmapStore.getState().nodes).toHaveLength(1);
    expect(useMindmapStore.getState().nodes[0].data.label).toBe("남을 노드");
  });

  it("clearAll — 모든 노드/엣지 삭제", () => {
    useMindmapStore.getState().addNode("A", { x: 0, y: 0 });
    useMindmapStore.getState().addNode("B", { x: 100, y: 0 });
    useMindmapStore.getState().clearAll();
    expect(useMindmapStore.getState().nodes).toHaveLength(0);
    expect(useMindmapStore.getState().edges).toHaveLength(0);
  });
});

describe("useMindmapStore — 엣지", () => {
  it("onConnect — 엣지 추가", () => {
    useMindmapStore.getState().addNode("A", { x: 0, y: 0 });
    useMindmapStore.getState().addNode("B", { x: 200, y: 0 });
    const [a, b] = useMindmapStore.getState().nodes;
    useMindmapStore.getState().onConnect({
      source: a.id,
      target: b.id,
      sourceHandle: null,
      targetHandle: null,
    });
    expect(useMindmapStore.getState().edges).toHaveLength(1);
    expect(useMindmapStore.getState().edges[0].source).toBe(a.id);
    expect(useMindmapStore.getState().edges[0].target).toBe(b.id);
  });

  it("removeNode — 연결된 엣지도 함께 삭제", () => {
    useMindmapStore.getState().addNode("A", { x: 0, y: 0 });
    useMindmapStore.getState().addNode("B", { x: 200, y: 0 });
    const [a, b] = useMindmapStore.getState().nodes;
    useMindmapStore.getState().onConnect({
      source: a.id,
      target: b.id,
      sourceHandle: null,
      targetHandle: null,
    });
    useMindmapStore.getState().removeNode(a.id);
    expect(useMindmapStore.getState().edges).toHaveLength(0);
  });
});

describe("useMindmapStore — 보드 관리", () => {
  it("초기 상태는 보드 1개", () => {
    expect(useMindmapStore.getState().boards).toHaveLength(1);
  });

  it("addBoard — 새 보드 추가 및 전환", () => {
    useMindmapStore.getState().addBoard();
    expect(useMindmapStore.getState().boards).toHaveLength(2);
    const newBoard = useMindmapStore.getState().boards[1];
    expect(useMindmapStore.getState().currentBoardId).toBe(newBoard.id);
    expect(useMindmapStore.getState().nodes).toHaveLength(0);
  });

  it("setCurrentBoard — 보드 전환 시 해당 노드 로드", () => {
    const firstId = useMindmapStore.getState().currentBoardId;
    useMindmapStore.getState().addNode("첫 보드 노드", { x: 0, y: 0 });
    useMindmapStore.getState().addBoard();
    useMindmapStore.getState().setCurrentBoard(firstId);
    expect(useMindmapStore.getState().nodes).toHaveLength(1);
    expect(useMindmapStore.getState().nodes[0].data.label).toBe("첫 보드 노드");
  });

  it("removeBoard — 보드 삭제 후 다른 보드로 전환", () => {
    useMindmapStore.getState().addBoard();
    const secondId = useMindmapStore.getState().currentBoardId;
    useMindmapStore.getState().removeBoard(secondId);
    expect(useMindmapStore.getState().boards).toHaveLength(1);
    expect(useMindmapStore.getState().currentBoardId).not.toBe(secondId);
  });

  it("removeBoard — 보드가 1개이면 삭제 불가", () => {
    const id = useMindmapStore.getState().currentBoardId;
    useMindmapStore.getState().removeBoard(id);
    expect(useMindmapStore.getState().boards).toHaveLength(1);
  });

  it("renameBoard — 보드 이름 변경", () => {
    const id = useMindmapStore.getState().boards[0].id;
    useMindmapStore.getState().renameBoard(id, "새 보드 이름");
    expect(useMindmapStore.getState().boards[0].name).toBe("새 보드 이름");
  });

  it("addNode — localStorage에 저장", () => {
    useMindmapStore.getState().addNode("저장 확인", { x: 0, y: 0 });
    const stored = JSON.parse(localStorage.getItem("fsd-mindmap")!);
    expect(stored.boards[0].nodes[0].data.label).toBe("저장 확인");
  });
});
