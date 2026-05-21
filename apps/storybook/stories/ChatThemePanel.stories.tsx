import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  BUBBLE_COLORS,
  CHAT_BGS,
  FONT_SIZES,
  type BubbleColor,
  type ChatBg,
  type FontSize,
} from "@fsd/features";
import { Button, Input } from "@fsd/ui";

// ─── Inline theme panel (self-contained, no Zustand) ─────────────────────────

interface ThemePanelDemoProps {
  open?: boolean;
}

function ThemePanelDemo({ open: initialOpen = true }: ThemePanelDemoProps) {
  const [open, setOpen] = useState(initialOpen);
  const [bubbleColor, setBubbleColor] = useState<BubbleColor>("blue");
  const [chatBg, setChatBg] = useState<ChatBg>("white");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [roomName, setRoomName] = useState("FSD Project");

  const bubble = BUBBLE_COLORS[bubbleColor];
  const bg = CHAT_BGS[chatBg];
  const fs = FONT_SIZES[fontSize].px;
  const timeColor = bg.dark ? "#475569" : "#9ca3af";

  return (
    <div
      style={{
        position: "relative",
        width: "700px",
        height: "520px",
        backgroundColor: bg.bg,
        fontSize: fs,
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mock chat header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#fff",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#22c55e",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "13px", color: "#6b7280", flex: 1 }}>
          연결됨
        </span>
        <button
          onClick={() => setOpen(true)}
          style={{
            fontSize: "16px",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: "4px",
          }}
        >
          🎨
        </button>
      </div>

      {/* Mock messages */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          overflowY: "auto",
        }}
      >
        {/* Other */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#6b7280",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            유
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: bg.dark ? "#94a3b8" : "#4b5563",
              }}
            >
              유저
            </span>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: bg.otherBubbleBg,
                color: bg.otherBubbleText,
                lineHeight: 1.5,
                maxWidth: "240px",
              }}
            >
              안녕하세요! 오늘 날씨 어때요?
            </div>
            <span style={{ fontSize: "11px", color: timeColor }}>
              오전 10:30
            </span>
          </div>
        </div>

        {/* Mine */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
            flexDirection: "row-reverse",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: bubble.bg,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            나
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: bubble.bg,
                color: bubble.text,
                lineHeight: 1.5,
                maxWidth: "240px",
              }}
            >
              너무 좋네요! 🌤️
            </div>
            <span style={{ fontSize: "11px", color: timeColor }}>
              오전 10:31
            </span>
          </div>
        </div>
      </div>

      {/* Mock input bar */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "8px",
          backgroundColor: "#fff",
        }}
      >
        <input
          placeholder="메시지를 입력하세요..."
          disabled
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <Button size="sm" disabled>
          전송
        </Button>
      </div>

      {/* ── Theme Panel ── */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              width: "240px",
              backgroundColor: "#fff",
              borderLeft: "1px solid #e5e7eb",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-4px 0 12px rgba(0,0,0,0.08)",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "13px" }}>
                채팅방 꾸미기
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Panel content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Room name */}
              <section>
                <p style={sectionLabel}>채팅방 이름</p>
                <Input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="채팅방 이름"
                  maxLength={30}
                />
              </section>

              {/* Bubble color */}
              <section>
                <p style={sectionLabel}>내 말풍선 색상</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(Object.keys(BUBBLE_COLORS) as BubbleColor[]).map((key) => (
                    <button
                      key={key}
                      title={BUBBLE_COLORS[key].label}
                      onClick={() => setBubbleColor(key)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: BUBBLE_COLORS[key].bg,
                        cursor: "pointer",
                        border:
                          bubbleColor === key
                            ? "3px solid white"
                            : "3px solid transparent",
                        boxShadow:
                          bubbleColor === key
                            ? "0 0 0 2px rgba(0,0,0,0.3)"
                            : "none",
                        transition: "transform 0.1s",
                      }}
                    />
                  ))}
                </div>
                {/* preview */}
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      backgroundColor: bubble.bg,
                      color: bubble.text,
                    }}
                  >
                    미리보기 메시지
                  </div>
                </div>
              </section>

              {/* Chat bg */}
              <section>
                <p style={sectionLabel}>채팅 배경</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {(Object.keys(CHAT_BGS) as ChatBg[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setChatBg(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: CHAT_BGS[key].bg,
                        border: `2px solid ${chatBg === key ? "#2563eb" : "transparent"}`,
                        transition: "border-color 0.1s",
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: CHAT_BGS[key].bg,
                          border: "1px solid rgba(0,0,0,0.15)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "13px",
                          color: CHAT_BGS[key].dark ? "#f1f5f9" : "#374151",
                        }}
                      >
                        {CHAT_BGS[key].label}
                      </span>
                      {chatBg === key && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "11px",
                            color: "#2563eb",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Font size */}
              <section>
                <p style={sectionLabel}>글자 크기</p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(Object.keys(FONT_SIZES) as FontSize[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setFontSize(key)}
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        borderRadius: "6px",
                        fontSize: "13px",
                        cursor: "pointer",
                        border: `2px solid ${fontSize === key ? "#2563eb" : "#e5e7eb"}`,
                        color: fontSize === key ? "#2563eb" : "#6b7280",
                        backgroundColor:
                          fontSize === key ? "#eff6ff" : "transparent",
                        fontWeight: fontSize === key ? 600 : 400,
                        transition: "all 0.1s",
                      }}
                    >
                      {FONT_SIZES[key].label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "10px",
};

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ThemePanelDemo> = {
  title: "Chat/ChatThemePanel",
  component: ThemePanelDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅방 꾸미기 패널. 말풍선 색상, 채팅 배경, 글자 크기, 채팅방 이름을 실시간으로 변경할 수 있습니다. 🎨 버튼으로 패널을 열고 닫을 수 있습니다.",
      },
    },
    backgrounds: { disable: true },
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "패널 초기 열림 상태",
      table: { defaultValue: { summary: "true" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PanelOpen: Story = {
  args: { open: true },
};

export const PanelClosed: Story = {
  args: { open: false },
};
