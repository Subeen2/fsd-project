"use client";

import {
  BUBBLE_COLORS,
  CHAT_BGS,
  FONT_SIZES,
  useChatTheme,
  type BubbleColor,
  type ChatBg,
  type FontSize,
} from "@fsd/features";
import { Input } from "@fsd/ui";
import { css } from "../../../styled-system/css";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ChatThemePanel({ open, onClose }: Props) {
  const {
    bubbleColor,
    chatBg,
    fontSize,
    roomName,
    setBubbleColor,
    setChatBg,
    setFontSize,
    setRoomName,
  } = useChatTheme();

  if (!open) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        onClick={onClose}
        className={css({
          position: "fixed",
          inset: "0",
          zIndex: "40",
        })}
      />

      {/* 패널 */}
      <div
        className={css({
          position: "fixed",
          top: "0",
          right: "0",
          h: "full",
          w: "72",
          bg: "white",
          borderLeftWidth: "1px",
          borderStyle: "solid",
          borderColor: "gray.200",
          zIndex: "50",
          display: "flex",
          flexDirection: "column",
          boxShadow: "xl",
        })}
      >
        {/* 헤더 */}
        <div
          className={css({
            px: "4",
            py: "4",
            borderBottomWidth: "1px",
            borderStyle: "solid",
            borderColor: "gray.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          })}
        >
          <h2 className={css({ fontWeight: "semibold", fontSize: "sm" })}>
            채팅방 꾸미기
          </h2>
          <button
            onClick={onClose}
            className={css({
              color: "gray.400",
              cursor: "pointer",
              fontSize: "lg",
              lineHeight: "1",
              _hover: { color: "gray.700" },
            })}
          >
            ✕
          </button>
        </div>

        {/* 설정 내용 */}
        <div
          className={css({
            flex: "1",
            overflowY: "auto",
            p: "4",
            display: "flex",
            flexDirection: "column",
            gap: "6",
          })}
        >
          {/* 채팅방 이름 */}
          <section>
            <p
              className={css({
                fontSize: "xs",
                fontWeight: "semibold",
                color: "gray.500",
                textTransform: "uppercase",
                letterSpacing: "wider",
                mb: "3",
              })}
            >
              채팅방 이름
            </p>
            <Input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="채팅방 이름"
              maxLength={30}
            />
          </section>

          {/* 내 말풍선 색상 */}
          <section>
            <p
              className={css({
                fontSize: "xs",
                fontWeight: "semibold",
                color: "gray.500",
                textTransform: "uppercase",
                letterSpacing: "wider",
                mb: "3",
              })}
            >
              내 말풍선 색상
            </p>
            <div
              className={css({ display: "flex", gap: "2", flexWrap: "wrap" })}
            >
              {(Object.keys(BUBBLE_COLORS) as BubbleColor[]).map((key) => {
                const { bg, label } = BUBBLE_COLORS[key];
                const selected = bubbleColor === key;
                return (
                  <button
                    key={key}
                    title={label}
                    onClick={() => setBubbleColor(key)}
                    style={{ backgroundColor: bg }}
                    className={css({
                      w: "8",
                      h: "8",
                      borderRadius: "full",
                      cursor: "pointer",
                      transition: "transform 0.1s",
                      _hover: { transform: "scale(1.1)" },
                    })}
                  >
                    {selected && (
                      <span
                        className={css({
                          display: "block",
                          w: "full",
                          h: "full",
                          borderRadius: "full",
                          borderWidth: "3px",
                          borderStyle: "solid",
                          borderColor: "white",
                          boxShadow: "0 0 0 2px rgba(0,0,0,0.3)",
                        })}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {/* 미리보기 */}
            <div
              className={css({
                mt: "3",
                display: "flex",
                justifyContent: "flex-end",
              })}
            >
              <div
                style={{
                  backgroundColor: BUBBLE_COLORS[bubbleColor].bg,
                  color: BUBBLE_COLORS[bubbleColor].text,
                }}
                className={css({
                  px: "3",
                  py: "1.5",
                  borderRadius: "lg",
                  fontSize: "xs",
                })}
              >
                미리보기 메시지
              </div>
            </div>
          </section>

          {/* 채팅 배경 */}
          <section>
            <p
              className={css({
                fontSize: "xs",
                fontWeight: "semibold",
                color: "gray.500",
                textTransform: "uppercase",
                letterSpacing: "wider",
                mb: "3",
              })}
            >
              채팅 배경
            </p>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "2",
              })}
            >
              {(Object.keys(CHAT_BGS) as ChatBg[]).map((key) => {
                const { bg, label } = CHAT_BGS[key];
                const selected = chatBg === key;
                return (
                  <button
                    key={key}
                    onClick={() => setChatBg(key)}
                    className={css({
                      display: "flex",
                      alignItems: "center",
                      gap: "3",
                      px: "3",
                      py: "2.5",
                      borderRadius: "lg",
                      cursor: "pointer",
                      borderWidth: "2px",
                      borderStyle: "solid",
                      transition: "border-color 0.1s",
                    })}
                    style={{
                      backgroundColor: bg,
                      borderColor: selected ? "#2563eb" : "transparent",
                    }}
                  >
                    <span
                      className={css({
                        w: "4",
                        h: "4",
                        borderRadius: "full",
                        flexShrink: "0",
                      })}
                      style={{
                        backgroundColor: bg,
                        border: "1px solid rgba(0,0,0,0.15)",
                      }}
                    />
                    <span
                      style={{
                        color: CHAT_BGS[key].dark ? "#f1f5f9" : "#374151",
                      }}
                      className={css({ fontSize: "sm" })}
                    >
                      {label}
                    </span>
                    {selected && (
                      <span
                        className={css({ ml: "auto", fontSize: "xs" })}
                        style={{ color: "#2563eb" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 글자 크기 */}
          <section>
            <p
              className={css({
                fontSize: "xs",
                fontWeight: "semibold",
                color: "gray.500",
                textTransform: "uppercase",
                letterSpacing: "wider",
                mb: "3",
              })}
            >
              글자 크기
            </p>
            <div className={css({ display: "flex", gap: "2" })}>
              {(Object.keys(FONT_SIZES) as FontSize[]).map((key) => {
                const { label } = FONT_SIZES[key];
                const selected = fontSize === key;
                return (
                  <button
                    key={key}
                    onClick={() => setFontSize(key)}
                    className={css({
                      flex: "1",
                      py: "2",
                      borderRadius: "md",
                      fontSize: "sm",
                      cursor: "pointer",
                      borderWidth: "2px",
                      borderStyle: "solid",
                      transition: "all 0.1s",
                      fontWeight: selected ? "semibold" : "normal",
                    })}
                    style={{
                      borderColor: selected ? "#2563eb" : "#e5e7eb",
                      color: selected ? "#2563eb" : "#6b7280",
                      backgroundColor: selected ? "#eff6ff" : "transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
