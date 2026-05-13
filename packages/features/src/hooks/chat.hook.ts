"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatUser, WsEvent } from "@fsd/api";

const WS_URL = process.env["NEXT_PUBLIC_WS_URL"] ?? "ws://localhost:3001/ws";

export type ChatStatus = "connecting" | "connected" | "disconnected";

export function useChatSocket(token: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [status, setStatus] = useState<ChatStatus>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      setStatus("connected");
      ws.send(
        JSON.stringify({
          type: "chat:join",
          timestamp: new Date().toISOString(),
          payload: { token },
        }),
      );
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as WsEvent;
        switch (data.type) {
          case "chat:history":
            setMessages(data.payload.messages);
            break;
          case "chat:message":
            setMessages((prev) => [...prev, data.payload.message]);
            break;
          case "chat:user_list":
            setOnlineUsers(data.payload.users);
            break;
          case "chat:user_joined":
            setOnlineUsers((prev) => {
              if (prev.some((u) => u.id === data.payload.user.id)) return prev;
              return [...prev, data.payload.user];
            });
            break;
          case "chat:user_left":
            setOnlineUsers((prev) =>
              prev.filter((u) => u.id !== data.payload.userId),
            );
            break;
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("disconnected");

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [token]);

  const sendMessage = useCallback((content: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(
      JSON.stringify({
        type: "chat:send",
        timestamp: new Date().toISOString(),
        payload: { content },
      }),
    );
  }, []);

  return { messages, onlineUsers, status, sendMessage };
}
