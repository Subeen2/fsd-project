"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatUser, WsEvent } from "@fsd/api";

const WS_URL = process.env["NEXT_PUBLIC_WS_URL"] ?? "ws://localhost:3002/ws";

const PING_INTERVAL = 20_000;
const PING_TIMEOUT = 5_000;
const MAX_BACKOFF = 30_000;

export type ChatStatus = "connecting" | "connected" | "disconnected";

export function useChatSocket(token: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [status, setStatus] = useState<ChatStatus>("disconnected");

  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);
  const destroyedRef = useRef(false);
  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const clearTimers = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current);
      pingTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (destroyedRef.current) return;
    const currentToken = tokenRef.current;
    if (!currentToken) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      if (destroyedRef.current) {
        ws.close();
        return;
      }
      setStatus("connected");
      attemptRef.current = 0;

      ws.send(
        JSON.stringify({
          type: "chat:join",
          timestamp: new Date().toISOString(),
          payload: { token: currentToken },
        }),
      );

      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState !== WebSocket.OPEN) return;
        ws.send(
          JSON.stringify({
            type: "ping",
            timestamp: new Date().toISOString(),
            payload: undefined,
          }),
        );
        // pong이 PING_TIMEOUT 안에 안 오면 좀비 연결로 판단
        pingTimeoutRef.current = setTimeout(() => {
          console.warn("[WS] Pong timeout — forcing reconnect");
          ws.close();
        }, PING_TIMEOUT);
      }, PING_INTERVAL);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as WsEvent;
        switch (data.type) {
          case "pong":
            if (pingTimeoutRef.current) {
              clearTimeout(pingTimeoutRef.current);
              pingTimeoutRef.current = null;
            }
            break;
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

    // onerror → onclose 순서로 둘 다 발생할 수 있어서 한 번만 재연결
    let reconnectScheduled = false;
    const scheduleReconnect = () => {
      if (destroyedRef.current || reconnectScheduled) return;
      reconnectScheduled = true;
      clearTimers();
      setStatus("disconnected");
      const delay = Math.min(1000 * 2 ** attemptRef.current, MAX_BACKOFF);
      attemptRef.current += 1;
      console.warn(
        `[WS] Reconnecting in ${delay}ms (attempt ${attemptRef.current})`,
      );
      retryRef.current = setTimeout(connect, delay);
    };

    ws.onclose = scheduleReconnect;
    ws.onerror = scheduleReconnect;
  }, [clearTimers]);

  useEffect(() => {
    if (!token) return;

    destroyedRef.current = false;
    connect();

    return () => {
      destroyedRef.current = true;
      clearTimers();
      if (retryRef.current) {
        clearTimeout(retryRef.current);
        retryRef.current = null;
      }
      wsRef.current?.close();
      wsRef.current = null;
      attemptRef.current = 0;
    };
  }, [token, connect, clearTimers]);

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
