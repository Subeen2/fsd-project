"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Input } from "@fsd/ui";
import {
  useAuth,
  useChatSocket,
  useChatTheme,
  BUBBLE_COLORS,
  CHAT_BGS,
  FONT_SIZES,
} from "@fsd/features";
import { css } from "../../styled-system/css";
import { ChatThemePanel } from "./ChatThemePanel";

export default function ChatPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const { bubbleColor, chatBg, fontSize } = useChatTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chatUser = user
    ? {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl ?? null,
      }
    : null;
  const { messages, onlineUsers, status, sendMessage } = useChatSocket(
    token,
    chatUser,
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput("");
  };

  const handleLogout = () => {
    logout();
  };

  if (!mounted || isLoading || !isAuthenticated) return null;

  const statusColor =
    status === "connected"
      ? "green.500"
      : status === "connecting"
        ? "yellow.500"
        : "gray.400";

  const statusLabel =
    status === "connected"
      ? "연결됨"
      : status === "connecting"
        ? "연결 중..."
        : "연결 끊김";

  const theme = {
    bubble: BUBBLE_COLORS[bubbleColor],
    bg: CHAT_BGS[chatBg],
    fs: FONT_SIZES[fontSize].px,
  };

  return (
    <div
      className={css({
        display: "flex",
        h: "calc(100vh - 65px)",
        gap: "0",
        overflow: "hidden",
      })}
    >
      {/* 사이드바 — 접속자 목록 */}
      <aside
        className={css({
          w: "64",
          flexShrink: "0",
          borderRightWidth: "1px",
          borderStyle: "solid",
          borderColor: "gray.200",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        })}
      >
        <div
          className={css({
            px: "4",
            py: "3",
            borderBottomWidth: "1px",
            borderStyle: "solid",
            borderColor: "gray.200",
          })}
        >
          <p
            className={css({
              fontSize: "xs",
              fontWeight: "semibold",
              color: "gray.500",
              textTransform: "uppercase",
              letterSpacing: "wider",
            })}
          >
            접속자 {onlineUsers.length}명
          </p>
        </div>
        <ul
          className={css({
            flex: "1",
            overflowY: "auto",
            p: "2",
            display: "flex",
            flexDirection: "column",
            gap: "1",
          })}
        >
          {onlineUsers.map((u) => (
            <li
              key={u.id}
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "2",
                px: "2",
                py: "1.5",
                borderRadius: "md",
                bg: u.id === user?.id ? "blue.50" : "transparent",
              })}
            >
              <Avatar
                src={u.avatarUrl}
                fallback={u.displayName}
                alt={u.displayName}
                size="sm"
              />
              <span
                className={css({
                  fontSize: "sm",
                  fontWeight: u.id === user?.id ? "semibold" : "normal",
                  color: u.id === user?.id ? "blue.700" : "gray.700",
                  truncate: true,
                })}
              >
                {u.displayName}
                {u.id === user?.id && " (나)"}
              </span>
            </li>
          ))}
        </ul>
        <div
          className={css({
            p: "3",
            borderTopWidth: "1px",
            borderStyle: "solid",
            borderColor: "gray.200",
          })}
        >
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </aside>

      {/* 메인 — 메시지 + 입력 */}
      <div
        className={css({
          flex: "1",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRightWidth: "1px",
          borderStyle: "solid",
          borderColor: "gray.200",
        })}
      >
        {/* 상단 상태 바 */}
        <div
          className={css({
            px: "4",
            py: "3",
            borderBottomWidth: "1px",
            borderStyle: "solid",
            borderColor: "gray.200",
            display: "flex",
            alignItems: "center",
            gap: "2",
          })}
        >
          <span
            className={css({
              w: "2",
              h: "2",
              borderRadius: "full",
              bg: statusColor,
              flexShrink: "0",
            })}
          />
          <span
            className={css({ fontSize: "sm", color: "gray.500", flex: "1" })}
          >
            {statusLabel}
          </span>
          <button
            onClick={() => setThemeOpen(true)}
            title="채팅방 꾸미기"
            className={css({
              fontSize: "md",
              cursor: "pointer",
              color: "gray.400",
              px: "1",
              borderRadius: "md",
              _hover: { color: "gray.700", bg: "gray.100" },
            })}
          >
            🎨
          </button>
        </div>

        {/* 메시지 목록 */}
        <div
          style={{ backgroundColor: theme.bg.bg, fontSize: theme.fs }}
          className={css({
            flex: "1",
            overflowY: "auto",
            p: "4",
            display: "flex",
            flexDirection: "column",
            gap: "4",
          })}
        >
          {messages.length === 0 && (
            <p
              className={css({
                textAlign: "center",
                color: "gray.400",
                fontSize: "sm",
                mt: "8",
              })}
            >
              첫 메시지를 보내보세요!
            </p>
          )}
          {messages.map((msg) => {
            const isMine = msg.author.id === user?.id;
            return (
              <div
                key={msg.id}
                className={css({
                  display: "flex",
                  gap: "3",
                  flexDirection: isMine ? "row-reverse" : "row",
                  alignItems: "flex-start",
                })}
              >
                <Avatar
                  src={msg.author.avatarUrl}
                  fallback={msg.author.displayName}
                  alt={msg.author.displayName}
                  size="sm"
                />
                <div
                  className={css({
                    display: "flex",
                    flexDirection: "column",
                    gap: "1",
                    alignItems: isMine ? "flex-end" : "flex-start",
                    maxW: "70%",
                  })}
                >
                  {!isMine && (
                    <span
                      className={css({
                        fontSize: "xs",
                        fontWeight: "semibold",
                      })}
                      style={{ color: theme.bg.dark ? "#94a3b8" : "#4b5563" }}
                    >
                      {msg.author.displayName}
                    </span>
                  )}
                  <div
                    className={css({
                      px: "3",
                      py: "2",
                      borderRadius: "lg",
                      lineHeight: "relaxed",
                      wordBreak: "break-word",
                    })}
                    style={
                      isMine
                        ? {
                            backgroundColor: theme.bubble.bg,
                            color: theme.bubble.text,
                          }
                        : {
                            backgroundColor: theme.bg.otherBubbleBg,
                            color: theme.bg.otherBubbleText,
                          }
                    }
                  >
                    {msg.content}
                  </div>
                  <span
                    className={css({ fontSize: "xs" })}
                    style={{ color: theme.bg.dark ? "#475569" : "#9ca3af" }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 바 */}
        <form
          onSubmit={handleSend}
          className={css({
            px: "4",
            py: "3",
            borderTopWidth: "1px",
            borderStyle: "solid",
            borderColor: "gray.200",
            display: "flex",
            gap: "2",
            alignItems: "flex-end",
          })}
        >
          <div className={css({ flex: "1" })}>
            <Input
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "connected"}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || status !== "connected"}
          >
            전송
          </Button>
        </form>
      </div>

      {/* 테마 패널 */}
      <ChatThemePanel open={themeOpen} onClose={() => setThemeOpen(false)} />
    </div>
  );
}
