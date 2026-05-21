import type { Meta, StoryObj } from "@storybook/react";
import {
  BUBBLE_COLORS,
  CHAT_BGS,
  FONT_SIZES,
  type BubbleColor,
  type ChatBg,
  type FontSize,
} from "@fsd/features";

// ─── Minimal bubble demo component ───────────────────────────────────────────

interface BubblePreviewProps {
  bubbleColor: BubbleColor;
  chatBg: ChatBg;
  fontSize: FontSize;
  myMessage?: string;
  otherMessage?: string;
}

function BubblePreview({
  bubbleColor,
  chatBg,
  fontSize,
  myMessage = "안녕하세요! 오늘 날씨 좋네요 ☀️",
  otherMessage = "그러게요, 산책이라도 할까요?",
}: BubblePreviewProps) {
  const bubble = BUBBLE_COLORS[bubbleColor];
  const bg = CHAT_BGS[chatBg];
  const fs = FONT_SIZES[fontSize].px;
  const nameColor = bg.dark ? "#94a3b8" : "#4b5563";
  const timeColor = bg.dark ? "#475569" : "#9ca3af";

  return (
    <div
      style={{
        backgroundColor: bg.bg,
        fontSize: fs,
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "320px",
        maxWidth: "400px",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* Other person's message */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          유
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            maxWidth: "70%",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 600, color: nameColor }}>
            유저
          </span>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              lineHeight: 1.5,
              backgroundColor: bg.otherBubbleBg,
              color: bg.otherBubbleText,
            }}
          >
            {otherMessage}
          </div>
          <span style={{ fontSize: "11px", color: timeColor }}>오전 10:30</span>
        </div>
      </div>

      {/* My message */}
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
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: bubble.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "13px",
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
            gap: "4px",
            alignItems: "flex-end",
            maxWidth: "70%",
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              lineHeight: 1.5,
              backgroundColor: bubble.bg,
              color: bubble.text,
            }}
          >
            {myMessage}
          </div>
          <span style={{ fontSize: "11px", color: timeColor }}>오전 10:31</span>
        </div>
      </div>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof BubblePreview> = {
  title: "Chat/ChatBubble",
  component: BubblePreview,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅 말풍선 미리보기. 말풍선 색상, 채팅 배경, 글자 크기를 조합해서 확인할 수 있습니다.",
      },
    },
    backgrounds: { disable: true },
  },
  argTypes: {
    bubbleColor: {
      control: "select",
      options: Object.keys(BUBBLE_COLORS) as BubbleColor[],
      description: "내 말풍선 색상",
      table: { defaultValue: { summary: "blue" } },
    },
    chatBg: {
      control: "select",
      options: Object.keys(CHAT_BGS) as ChatBg[],
      description: "채팅 배경",
      table: { defaultValue: { summary: "white" } },
    },
    fontSize: {
      control: "select",
      options: Object.keys(FONT_SIZES) as FontSize[],
      description: "글자 크기",
      table: { defaultValue: { summary: "md" } },
    },
    myMessage: { control: "text" },
    otherMessage: { control: "text" },
  },
  args: {
    bubbleColor: "blue",
    chatBg: "white",
    fontSize: "md",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {};

export const PurpleOnDark: Story = {
  args: { bubbleColor: "purple", chatBg: "dark" },
};

export const GreenOnWarm: Story = {
  args: { bubbleColor: "green", chatBg: "warm" },
};

export const RoseOnDark: Story = {
  args: { bubbleColor: "rose", chatBg: "dark" },
};

export const OrangeOnWarm: Story = {
  args: { bubbleColor: "orange", chatBg: "warm" },
};

export const LargeFontSize: Story = {
  args: { bubbleColor: "blue", chatBg: "white", fontSize: "lg" },
};

export const SmallFontSize: Story = {
  args: { bubbleColor: "blue", chatBg: "white", fontSize: "sm" },
};

// ─── All bubble colors ─────────────────────────────────────────────────────────

export const AllBubbleColors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {(Object.keys(BUBBLE_COLORS) as BubbleColor[]).map((color) => (
        <div
          key={color}
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#9ca3af",
              width: "48px",
              textTransform: "uppercase",
            }}
          >
            {BUBBLE_COLORS[color].label}
          </span>
          <BubblePreview
            bubbleColor={color}
            chatBg="white"
            fontSize="md"
            myMessage="반갑습니다!"
            otherMessage="안녕하세요!"
          />
        </div>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

// ─── All backgrounds ───────────────────────────────────────────────────────────

export const AllBackgrounds: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {(Object.keys(CHAT_BGS) as ChatBg[]).map((bg) => (
        <div
          key={bg}
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#9ca3af",
              width: "48px",
              textTransform: "uppercase",
            }}
          >
            {CHAT_BGS[bg].label}
          </span>
          <BubblePreview
            bubbleColor="blue"
            chatBg={bg}
            fontSize="md"
            myMessage="반갑습니다!"
            otherMessage="안녕하세요!"
          />
        </div>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

// ─── All font sizes ────────────────────────────────────────────────────────────

export const AllFontSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {(Object.keys(FONT_SIZES) as FontSize[]).map((size) => (
        <div
          key={size}
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#9ca3af",
              width: "48px",
              textTransform: "uppercase",
            }}
          >
            {FONT_SIZES[size].label} ({FONT_SIZES[size].px})
          </span>
          <BubblePreview
            bubbleColor="blue"
            chatBg="white"
            fontSize={size}
            myMessage="글자 크기 미리보기"
            otherMessage="이렇게 보여요!"
          />
        </div>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
};
