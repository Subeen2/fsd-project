import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

const CANVAS_W = 600;
const CANVAS_H = 420;
const ACCENT = "#2563eb";

type TextEl = {
  id: string;
  type: "text";
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
  fontFamily: string;
  textAlign: "left" | "center" | "right";
};

type ImgEl = {
  id: string;
  type: "image";
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
};

type CardEl = TextEl | ImgEl;

// ─── Sample data ──────────────────────────────────────────────────────────────

const defaultInviteEls: CardEl[] = [
  {
    id: "t1",
    type: "text",
    x: 100,
    y: 140,
    w: 400,
    h: 72,
    content: "🎉 초대합니다",
    fontSize: 40,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "serif",
    textAlign: "center",
  },
  {
    id: "t2",
    type: "text",
    x: 100,
    y: 230,
    w: 400,
    h: 40,
    content: "날짜와 장소를 입력하세요",
    fontSize: 16,
    color: "#64748b",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
];

const weddingEls: CardEl[] = [
  {
    id: "w1",
    type: "text",
    x: 80,
    y: 60,
    w: 440,
    h: 48,
    content: "Wedding Invitation",
    fontSize: 30,
    color: "#9f1239",
    fontWeight: "bold",
    fontFamily: "cursive",
    textAlign: "center",
  },
  {
    id: "w2",
    type: "text",
    x: 80,
    y: 130,
    w: 440,
    h: 36,
    content: "김민준 ♥ 이수아",
    fontSize: 24,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "serif",
    textAlign: "center",
  },
  {
    id: "w3",
    type: "text",
    x: 120,
    y: 200,
    w: 360,
    h: 28,
    content: "2025년 6월 14일 토요일 오후 2시",
    fontSize: 15,
    color: "#64748b",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "w4",
    type: "text",
    x: 120,
    y: 240,
    w: 360,
    h: 24,
    content: "그랜드 웨딩홀 3층 | 서울시 강남구",
    fontSize: 14,
    color: "#64748b",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "w5",
    type: "text",
    x: 100,
    y: 310,
    w: 400,
    h: 60,
    content:
      "저희 두 사람이 사랑의 결실을 맺어\n평생의 반려자가 되려 합니다.\n부디 오셔서 축복해 주세요.",
    fontSize: 13,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "serif",
    textAlign: "center",
  },
];

const birthdayEls: CardEl[] = [
  {
    id: "b1",
    type: "text",
    x: 60,
    y: 80,
    w: 480,
    h: 60,
    content: "🎂 생일 파티에 초대합니다!",
    fontSize: 32,
    color: "#7c3aed",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "b2",
    type: "text",
    x: 80,
    y: 168,
    w: 440,
    h: 32,
    content: "박지원의 20번째 생일",
    fontSize: 18,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "b3",
    type: "text",
    x: 120,
    y: 220,
    w: 360,
    h: 24,
    content: "📅 2025년 7월 5일 (토) 오후 6시",
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "b4",
    type: "text",
    x: 120,
    y: 254,
    w: 360,
    h: 24,
    content: "📍 홍대 파티룸 스타 | 마포구 와우산로",
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "b5",
    type: "text",
    x: 120,
    y: 310,
    w: 360,
    h: 56,
    content:
      "음식과 음악이 함께하는 즐거운 시간!\n참석 여부를 7월 1일까지 알려주세요 🎉",
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
];

// ─── Element renderer ─────────────────────────────────────────────────────────

function ElView({
  el,
  selected,
  onSelect,
}: {
  el: CardEl;
  selected: boolean;
  onSelect: () => void;
}) {
  const align = el.type === "text" ? el.textAlign : "left";
  const justify =
    align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        width: el.w,
        height: el.h,
        outline: selected ? `2px solid ${ACCENT}` : "2px solid transparent",
        outlineOffset: 1,
        borderRadius: 4,
        cursor: "pointer",
        boxSizing: "border-box",
      }}
    >
      {el.type === "text" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            fontSize: el.fontSize,
            color: el.color,
            fontWeight: el.fontWeight,
            fontFamily: el.fontFamily,
            textAlign: el.textAlign,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: justify,
            lineHeight: 1.4,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {el.content}
        </div>
      )}
      {el.type === "image" && (
        <img
          src={el.src}
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
      {selected && (
        <>
          {[
            { top: 0, left: 0, transform: "translate(-50%,-50%)" },
            { top: 0, right: 0, transform: "translate(50%,-50%)" },
            { bottom: 0, left: 0, transform: "translate(-50%,50%)" },
            { bottom: 0, right: 0, transform: "translate(50%,50%)" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                background: "#fff",
                border: `2px solid ${ACCENT}`,
                borderRadius: 2,
                ...pos,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

// ─── Properties info panel ────────────────────────────────────────────────────

function InfoPanel({ el }: { el: CardEl | null }) {
  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
        fontSize: 12,
        color: "#374151",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, color: "#0f172a", fontSize: 13 }}>
        속성
      </p>
      {!el ? (
        <p style={{ margin: 0, color: "#9ca3af", lineHeight: 1.6 }}>
          요소를 클릭하면
          <br />
          정보가 표시됩니다.
        </p>
      ) : (
        <>
          <Row label="타입" value={el.type === "text" ? "텍스트" : "이미지"} />
          <Row label="X" value={Math.round(el.x)} />
          <Row label="Y" value={Math.round(el.y)} />
          <Row label="너비" value={Math.round(el.w)} />
          <Row label="높이" value={Math.round(el.h)} />
          {el.type === "text" && (
            <>
              <Row label="폰트 크기" value={`${el.fontSize}px`} />
              <Row label="색상">
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    backgroundColor: el.color,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    marginRight: 4,
                    verticalAlign: "middle",
                  }}
                />
                {el.color}
              </Row>
              <Row
                label="굵기"
                value={el.fontWeight === "bold" ? "굵게" : "보통"}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
      <span style={{ color: "#9ca3af" }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: "right" }}>
        {children ?? value}
      </span>
    </div>
  );
}

// ─── Page thumbnail ───────────────────────────────────────────────────────────

function PageThumb({
  bgColor,
  active,
  index,
  onClick,
}: {
  bgColor: string;
  active: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 72,
        height: 52,
        borderRadius: 6,
        border: `2px solid ${active ? ACCENT : "#e5e7eb"}`,
        backgroundColor: bgColor,
        cursor: "pointer",
        flexShrink: 0,
        position: "relative",
        boxShadow: active ? "0 0 0 1px #2563eb" : "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <span
        style={{
          position: "absolute",
          bottom: 3,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 10,
          color: "#6b7280",
          pointerEvents: "none",
        }}
      >
        {index}
      </span>
    </div>
  );
}

// ─── Main canvas demo ─────────────────────────────────────────────────────────

interface CanvasDemoProps {
  bgColor?: string;
  elements?: CardEl[];
  pages?: { bgColor: string; elements: CardEl[] }[];
}

function InviteCanvasDemo({
  bgColor = "#fff9f0",
  elements = [],
  pages: initialPages,
}: CanvasDemoProps) {
  const pages = initialPages ?? [{ bgColor, elements }];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentPage = pages[currentIdx]!;
  const selected =
    currentPage.elements.find((e) => e.id === selectedId) ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Toolbar strip */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "+ 텍스트", color: "#f1f5f9" },
          { label: "+ 이미지", color: "#f1f5f9" },
        ].map((btn) => (
          <div
            key={btn.label}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: btn.color,
              fontSize: 13,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            {btn.label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            background: ACCENT,
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          PNG 저장
        </div>
        <div
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            background: "#10b981",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          PDF 저장 ({pages.length}장)
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 12 }}>
        {/* Page sidebar */}
        {pages.length > 1 && (
          <div
            style={{
              width: 80,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {pages.map((p, i) => (
              <PageThumb
                key={i}
                bgColor={p.bgColor}
                active={currentIdx === i}
                index={i + 1}
                onClick={() => {
                  setCurrentIdx(i);
                  setSelectedId(null);
                }}
              />
            ))}
          </div>
        )}

        {/* Canvas */}
        <div
          onClick={() => setSelectedId(null)}
          style={{
            position: "relative",
            width: CANVAS_W,
            height: CANVAS_H,
            backgroundColor: currentPage.bgColor,
            boxShadow: "0 4px 32px rgba(0,0,0,0.14)",
            borderRadius: 8,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {currentPage.elements.map((el) => (
            <ElView
              key={el.id}
              el={el}
              selected={selectedId === el.id}
              onSelect={() => setSelectedId(el.id)}
            />
          ))}
        </div>

        {/* Properties panel */}
        <InfoPanel el={selected} />
      </div>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof InviteCanvasDemo> = {
  title: "Design/InviteCard",
  component: InviteCanvasDemo,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "gray",
      values: [{ name: "gray", value: "#f1f5f9" }],
    },
    docs: {
      description: {
        component:
          "초대장 에디터 캔버스 미리보기. 텍스트·이미지 요소를 클릭해 선택하면 오른쪽 속성 패널에 정보가 표시됩니다. 실제 에디터에서는 드래그 이동·리사이즈·더블클릭 편집·PNG/PDF 저장이 지원됩니다.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: "빈 초대장",
  args: { bgColor: "#fff9f0", elements: [] },
};

export const Default: Story = {
  name: "기본 템플릿",
  args: { bgColor: "#fff9f0", elements: defaultInviteEls },
};

export const Wedding: Story = {
  name: "청첩장",
  args: { bgColor: "#fff1f2", elements: weddingEls },
};

export const Birthday: Story = {
  name: "생일 파티",
  args: { bgColor: "#faf5ff", elements: birthdayEls },
};

export const MultiPage: Story = {
  name: "다중 페이지",
  render: () => (
    <InviteCanvasDemo
      pages={[
        { bgColor: "#fff9f0", elements: defaultInviteEls },
        { bgColor: "#fff1f2", elements: weddingEls },
        { bgColor: "#faf5ff", elements: birthdayEls },
      ]}
    />
  ),
};
