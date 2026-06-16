import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useChatSocket } from "../chat.hook";

class MockWebSocket {
  static OPEN = 1;
  static CONNECTING = 0;
  readyState = MockWebSocket.CONNECTING;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;

  static lastInstance: MockWebSocket;

  constructor(public url: string) {
    MockWebSocket.lastInstance = this;
  }

  open() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.();
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.onclose?.();
  }

  emit(data: object) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
}

beforeEach(() => {
  vi.stubGlobal("WebSocket", MockWebSocket);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("useChatSocket — 초기 상태", () => {
  it("토큰 없으면 disconnected 상태 유지", () => {
    const { result } = renderHook(() => useChatSocket(null));
    expect(result.current.status).toBe("disconnected");
    expect(result.current.messages).toHaveLength(0);
    expect(result.current.onlineUsers).toHaveLength(0);
  });

  it("토큰 있으면 connecting 상태로 전환", () => {
    const { result } = renderHook(() => useChatSocket("token"));
    expect(result.current.status).toBe("connecting");
  });
});

describe("useChatSocket — 연결", () => {
  it("WebSocket 열리면 connected 상태", async () => {
    const { result } = renderHook(() => useChatSocket("my-token"));

    act(() => {
      MockWebSocket.lastInstance.open();
    });

    await waitFor(() => expect(result.current.status).toBe("connected"));
  });

  it("연결 시 chat:join 메시지 전송", () => {
    renderHook(() => useChatSocket("my-token"));

    act(() => {
      MockWebSocket.lastInstance.open();
    });

    const joinMsg = JSON.parse(MockWebSocket.lastInstance.sent[0]);
    expect(joinMsg.type).toBe("chat:join");
    expect(joinMsg.payload.token).toBe("my-token");
  });
});

describe("useChatSocket — 메시지 수신", () => {
  it("chat:history 수신 시 messages 교체", async () => {
    const { result } = renderHook(() => useChatSocket("token"));

    act(() => {
      MockWebSocket.lastInstance.open();
      MockWebSocket.lastInstance.emit({
        type: "chat:history",
        payload: {
          messages: [
            {
              id: "1",
              content: "안녕",
              author: { id: "u1", username: "alice" },
              createdAt: new Date().toISOString(),
            },
          ],
        },
      });
    });

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    expect(result.current.messages[0].content).toBe("안녕");
  });

  it("chat:message 수신 시 messages에 추가", async () => {
    const { result } = renderHook(() => useChatSocket("token"));

    act(() => {
      MockWebSocket.lastInstance.open();
      MockWebSocket.lastInstance.emit({
        type: "chat:message",
        payload: {
          message: {
            id: "msg-1",
            content: "새 메시지",
            author: { id: "u2", username: "bob" },
            createdAt: new Date().toISOString(),
          },
        },
      });
    });

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    expect(result.current.messages[0].id).toBe("msg-1");
  });

  it("중복 id 메시지는 무시", async () => {
    const { result } = renderHook(() => useChatSocket("token"));
    const msg = {
      id: "msg-1",
      content: "중복",
      author: { id: "u1", username: "alice" },
      createdAt: new Date().toISOString(),
    };

    act(() => {
      MockWebSocket.lastInstance.open();
      MockWebSocket.lastInstance.emit({
        type: "chat:message",
        payload: { message: msg },
      });
      MockWebSocket.lastInstance.emit({
        type: "chat:message",
        payload: { message: msg },
      });
    });

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
  });

  it("chat:user_list 수신 시 onlineUsers 설정", async () => {
    const { result } = renderHook(() => useChatSocket("token"));

    act(() => {
      MockWebSocket.lastInstance.open();
      MockWebSocket.lastInstance.emit({
        type: "chat:user_list",
        payload: { users: [{ id: "u1", username: "alice" }] },
      });
    });

    await waitFor(() => expect(result.current.onlineUsers).toHaveLength(1));
    expect(result.current.onlineUsers[0].username).toBe("alice");
  });

  it("chat:user_joined 수신 시 onlineUsers에 추가", async () => {
    const { result } = renderHook(() => useChatSocket("token"));

    act(() => {
      MockWebSocket.lastInstance.open();
      MockWebSocket.lastInstance.emit({
        type: "chat:user_joined",
        payload: { user: { id: "u2", username: "bob" } },
      });
    });

    await waitFor(() => expect(result.current.onlineUsers).toHaveLength(1));
  });

  it("chat:user_left 수신 시 onlineUsers에서 제거", async () => {
    const { result } = renderHook(() => useChatSocket("token"));

    act(() => {
      MockWebSocket.lastInstance.open();
      MockWebSocket.lastInstance.emit({
        type: "chat:user_list",
        payload: {
          users: [
            { id: "u1", username: "alice" },
            { id: "u2", username: "bob" },
          ],
        },
      });
    });

    await waitFor(() => expect(result.current.onlineUsers).toHaveLength(2));

    act(() => {
      MockWebSocket.lastInstance.emit({
        type: "chat:user_left",
        payload: { userId: "u1" },
      });
    });

    await waitFor(() => expect(result.current.onlineUsers).toHaveLength(1));
    expect(result.current.onlineUsers[0].username).toBe("bob");
  });
});

describe("useChatSocket — sendMessage", () => {
  it("OPEN 상태에서 chat:send 전송", () => {
    const { result } = renderHook(() =>
      useChatSocket("token", { id: "u1", username: "alice" }),
    );

    act(() => {
      MockWebSocket.lastInstance.open();
    });

    act(() => {
      result.current.sendMessage("hello");
    });

    const sent = MockWebSocket.lastInstance.sent.map((s) => JSON.parse(s));
    const sendMsg = sent.find((m) => m.type === "chat:send");
    expect(sendMsg).toBeDefined();
    expect(sendMsg.payload.content).toBe("hello");
  });

  it("유저 있으면 낙관적 메시지 즉시 추가", async () => {
    const { result } = renderHook(() =>
      useChatSocket("token", { id: "u1", username: "alice" }),
    );

    act(() => {
      MockWebSocket.lastInstance.open();
    });

    act(() => {
      result.current.sendMessage("낙관적 메시지");
    });

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    expect(result.current.messages[0].pending).toBe(true);
    expect(result.current.messages[0].content).toBe("낙관적 메시지");
  });

  it("서버 응답 메시지가 오면 낙관적 메시지 교체", async () => {
    const { result } = renderHook(() =>
      useChatSocket("token", { id: "u1", username: "alice" }),
    );

    act(() => {
      MockWebSocket.lastInstance.open();
      result.current.sendMessage("교체될 메시지");
    });

    await waitFor(() => expect(result.current.messages[0]?.pending).toBe(true));

    act(() => {
      MockWebSocket.lastInstance.emit({
        type: "chat:message",
        payload: {
          message: {
            id: "server-id",
            content: "교체될 메시지",
            author: { id: "u1", username: "alice" },
            createdAt: new Date().toISOString(),
          },
        },
      });
    });

    await waitFor(() =>
      expect(result.current.messages[0]?.pending).toBeUndefined(),
    );
    expect(result.current.messages[0].id).toBe("server-id");
    expect(result.current.messages).toHaveLength(1);
  });
});
