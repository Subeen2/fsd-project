import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

const CANVAS_W = 600;
const CANVAS_H = 424;
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
  url?: string;
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

type RectEl = {
  id: string;
  type: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
  bgColor: string;
  borderRadius: number;
};

type CardEl = TextEl | ImgEl | RectEl;

// ─── Default My Career elements ───────────────────────────────────────────────

const myCareerEls: CardEl[] = [
  {
    id: "pr0",
    type: "rect",
    x: 20,
    y: 14,
    w: 36,
    h: 2,
    bgColor: "#1a3352",
    borderRadius: 0,
  },
  {
    id: "pr1",
    type: "rect",
    x: 40,
    y: 44,
    w: 82,
    h: 82,
    bgColor: "#c0d0e0",
    borderRadius: 41,
  },
  {
    id: "pr2",
    type: "rect",
    x: 16,
    y: 186,
    w: 130,
    h: 206,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "pr3",
    type: "rect",
    x: 158,
    y: 44,
    w: 208,
    h: 134,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "pr4",
    type: "rect",
    x: 158,
    y: 186,
    w: 208,
    h: 84,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "pr5",
    type: "rect",
    x: 158,
    y: 278,
    w: 208,
    h: 120,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "pr6",
    type: "rect",
    x: 374,
    y: 44,
    w: 210,
    h: 134,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "pr7",
    type: "rect",
    x: 374,
    y: 186,
    w: 210,
    h: 84,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "pr8",
    type: "rect",
    x: 374,
    y: 278,
    w: 210,
    h: 120,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "pr9",
    type: "rect",
    x: 0,
    y: 406,
    w: 600,
    h: 18,
    bgColor: "#1a3352",
    borderRadius: 0,
  },
  {
    id: "pt1",
    type: "text",
    x: 20,
    y: 20,
    w: 130,
    h: 22,
    content: "My Career",
    fontSize: 15,
    color: "#1a3352",
    fontWeight: "bold",
    fontFamily: "serif",
    textAlign: "left",
  },
  {
    id: "pt2",
    type: "text",
    x: 16,
    y: 132,
    w: 130,
    h: 22,
    content: "이름을 입력하세요",
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "pt3",
    type: "text",
    x: 16,
    y: 158,
    w: 130,
    h: 18,
    content: "직책 / 역할",
    fontSize: 10,
    color: "#64748b",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "pt4",
    type: "text",
    x: 24,
    y: 194,
    w: 114,
    h: 14,
    content: "education",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt5",
    type: "text",
    x: 24,
    y: 214,
    w: 114,
    h: 170,
    content:
      "2012 한국대학교 경영학과 입학\n2016 경영학과 학사 졸업\n2018 대학원 경영학과 입학\n2020 경영학 석사 졸업",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt6",
    type: "text",
    x: 166,
    y: 52,
    w: 184,
    h: 14,
    content: "experience",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt7",
    type: "text",
    x: 166,
    y: 72,
    w: 184,
    h: 98,
    content:
      "2018–2020 마케팅 사업부 근무\n2020–2022 IT사업부 근무\n2023–현재 UX연구소 근무",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt8",
    type: "text",
    x: 166,
    y: 194,
    w: 184,
    h: 14,
    content: "license",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt9",
    type: "text",
    x: 166,
    y: 214,
    w: 184,
    h: 48,
    content: "MADA (2015.12 취득)\nSJAD (2020.12 취득)",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt10",
    type: "text",
    x: 166,
    y: 286,
    w: 184,
    h: 14,
    content: "title",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt11",
    type: "text",
    x: 166,
    y: 306,
    w: 184,
    h: 84,
    content:
      "2018 내용을 입력하세요\n2019 내용을 입력하세요\n2021 내용을 입력하세요",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt12",
    type: "text",
    x: 382,
    y: 52,
    w: 184,
    h: 14,
    content: "skills",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt13",
    type: "text",
    x: 382,
    y: 72,
    w: 184,
    h: 98,
    content:
      "영어: 비즈니스 업무 가능\n일어: 회화 상담 가능\nTool: Word, Excel, PPT",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt14",
    type: "text",
    x: 382,
    y: 194,
    w: 184,
    h: 14,
    content: "award",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt15",
    type: "text",
    x: 382,
    y: 214,
    w: 184,
    h: 48,
    content: "2020 사내 공모전 대상\n2022 마케팅 경진대회 동상",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt16",
    type: "text",
    x: 382,
    y: 286,
    w: 184,
    h: 14,
    content: "projects",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt17",
    type: "text",
    x: 382,
    y: 306,
    w: 184,
    h: 20,
    content: "프로젝트 이름",
    fontSize: 9,
    color: "#2563eb",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
    url: "https://github.com",
  },
  {
    id: "pt17b",
    type: "text",
    x: 382,
    y: 330,
    w: 184,
    h: 60,
    content:
      "프로젝트 설명을 입력하세요.\n사용 기술, 기여 내용 등을 적어주세요.",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "pt18",
    type: "text",
    x: 564,
    y: 408,
    w: 28,
    h: 14,
    content: "1",
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
];

const developerEls: CardEl[] = [
  {
    id: "dr0",
    type: "rect",
    x: 20,
    y: 14,
    w: 36,
    h: 2,
    bgColor: "#1e3a5f",
    borderRadius: 0,
  },
  {
    id: "dr1",
    type: "rect",
    x: 40,
    y: 44,
    w: 82,
    h: 82,
    bgColor: "#bfdbfe",
    borderRadius: 41,
  },
  {
    id: "dr2",
    type: "rect",
    x: 16,
    y: 186,
    w: 130,
    h: 220,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "dr3",
    type: "rect",
    x: 158,
    y: 44,
    w: 208,
    h: 150,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "dr4",
    type: "rect",
    x: 158,
    y: 202,
    w: 208,
    h: 204,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "dr5",
    type: "rect",
    x: 374,
    y: 44,
    w: 210,
    h: 150,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "dr6",
    type: "rect",
    x: 374,
    y: 202,
    w: 210,
    h: 100,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "dr7",
    type: "rect",
    x: 374,
    y: 310,
    w: 210,
    h: 96,
    bgColor: "#ffffff",
    borderRadius: 8,
  },
  {
    id: "dr8",
    type: "rect",
    x: 0,
    y: 406,
    w: 600,
    h: 18,
    bgColor: "#1e3a5f",
    borderRadius: 0,
  },
  {
    id: "dt1",
    type: "text",
    x: 20,
    y: 20,
    w: 150,
    h: 22,
    content: "Developer Portfolio",
    fontSize: 14,
    color: "#1e3a5f",
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "left",
  },
  {
    id: "dt2",
    type: "text",
    x: 16,
    y: 132,
    w: 130,
    h: 22,
    content: "김개발",
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  {
    id: "dt3",
    type: "text",
    x: 16,
    y: 158,
    w: 130,
    h: 18,
    content: "Frontend Developer",
    fontSize: 9,
    color: "#2563eb",
    fontWeight: "normal",
    fontFamily: "monospace",
    textAlign: "center",
  },
  {
    id: "dt4",
    type: "text",
    x: 24,
    y: 196,
    w: 114,
    h: 14,
    content: "contact",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt5",
    type: "text",
    x: 24,
    y: 216,
    w: 114,
    h: 180,
    content: "dev@gmail.com\ngithub.com/kimdev\nlinkedin.com/kimdev",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "monospace",
    textAlign: "left",
  },
  {
    id: "dt6",
    type: "text",
    x: 166,
    y: 52,
    w: 184,
    h: 14,
    content: "experience",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt7",
    type: "text",
    x: 166,
    y: 70,
    w: 184,
    h: 116,
    content:
      "2022–현재\n(주)테크스타트 프론트엔드 개발자\nReact, TypeScript, Next.js\n\n2020–2022\n프리랜서 웹 개발",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt8",
    type: "text",
    x: 166,
    y: 210,
    w: 184,
    h: 14,
    content: "projects",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt9",
    type: "text",
    x: 166,
    y: 230,
    w: 184,
    h: 20,
    content: "Mindwave 협업툴",
    fontSize: 9,
    color: "#2563eb",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
    url: "https://github.com",
  },
  {
    id: "dt10",
    type: "text",
    x: 166,
    y: 254,
    w: 184,
    h: 40,
    content: "실시간 채팅·마인드맵·초대장 기능\nNext.js, Prisma, WebSocket",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt11",
    type: "text",
    x: 166,
    y: 306,
    w: 184,
    h: 20,
    content: "포트폴리오 에디터",
    fontSize: 9,
    color: "#2563eb",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
    url: "https://github.com",
  },
  {
    id: "dt12",
    type: "text",
    x: 166,
    y: 330,
    w: 184,
    h: 40,
    content: "캔버스 기반 PDF 포트폴리오 제작 도구\nhtmlcanvas, jsPDF",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt13",
    type: "text",
    x: 382,
    y: 52,
    w: 184,
    h: 14,
    content: "skills",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt14",
    type: "text",
    x: 382,
    y: 70,
    w: 184,
    h: 116,
    content:
      "React / Next.js\nTypeScript\nNode.js / Express\nPrisma / PostgreSQL\nDocker / GitHub Actions",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "monospace",
    textAlign: "left",
  },
  {
    id: "dt15",
    type: "text",
    x: 382,
    y: 210,
    w: 184,
    h: 14,
    content: "education",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt16",
    type: "text",
    x: 382,
    y: 228,
    w: 184,
    h: 64,
    content: "한국대학교 컴퓨터공학과\n학사 (2018–2022)",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt17",
    type: "text",
    x: 382,
    y: 318,
    w: 184,
    h: 14,
    content: "certificate",
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt18",
    type: "text",
    x: 382,
    y: 336,
    w: 184,
    h: 60,
    content: "정보처리기사 (2022)\nAWS Solutions Architect (2023)",
    fontSize: 9,
    color: "#475569",
    fontWeight: "normal",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  {
    id: "dt19",
    type: "text",
    x: 564,
    y: 408,
    w: 28,
    h: 14,
    content: "1",
    fontSize: 10,
    color: "#ffffff",
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
  const textEl = el.type === "text" ? el : null;
  const justify =
    textEl?.textAlign === "left"
      ? "flex-start"
      : textEl?.textAlign === "right"
        ? "flex-end"
        : "center";

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
        borderRadius: el.type === "rect" ? (el as RectEl).borderRadius : 4,
        cursor: "pointer",
        boxSizing: "border-box",
      }}
    >
      {el.type === "rect" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: (el as RectEl).bgColor,
            borderRadius: (el as RectEl).borderRadius,
          }}
        />
      )}
      {el.type === "text" && textEl && (
        <div
          style={{
            width: "100%",
            height: "100%",
            fontSize: textEl.fontSize,
            color: textEl.url ? "#2563eb" : textEl.color,
            fontWeight: textEl.fontWeight,
            fontFamily: textEl.fontFamily,
            textAlign: textEl.textAlign,
            textDecoration: textEl.url ? "underline" : "none",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: justify,
            lineHeight: 1.4,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {textEl.content}
          {textEl.url && (
            <span
              style={{
                marginLeft: 2,
                fontSize: textEl.fontSize * 0.8,
                opacity: 0.7,
              }}
            >
              🔗
            </span>
          )}
        </div>
      )}
      {el.type === "image" && (
        <img
          src={(el as ImgEl).src}
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
  const typeLabel =
    el?.type === "text" ? "텍스트" : el?.type === "rect" ? "사각형" : "이미지";

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
          <PRow label="타입" value={typeLabel} />
          <PRow label="X" value={Math.round(el.x)} />
          <PRow label="Y" value={Math.round(el.y)} />
          <PRow label="너비" value={Math.round(el.w)} />
          <PRow label="높이" value={Math.round(el.h)} />
          {el.type === "text" && (
            <>
              <PRow label="폰트 크기" value={`${(el as TextEl).fontSize}px`} />
              <PRow label="색상">
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    backgroundColor: (el as TextEl).color,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    marginRight: 4,
                    verticalAlign: "middle",
                  }}
                />
                {(el as TextEl).color}
              </PRow>
              {(el as TextEl).url && <PRow label="링크" value="🔗 연결됨" />}
            </>
          )}
          {el.type === "rect" && (
            <>
              <PRow label="배경색">
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    backgroundColor: (el as RectEl).bgColor,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    marginRight: 4,
                    verticalAlign: "middle",
                  }}
                />
                {(el as RectEl).bgColor}
              </PRow>
              <PRow label="모서리" value={`${(el as RectEl).borderRadius}px`} />
            </>
          )}
        </>
      )}
    </div>
  );
}

function PRow({
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

// ─── Main demo ────────────────────────────────────────────────────────────────

interface PortfolioDemoProps {
  bgColor?: string;
  elements?: CardEl[];
  pages?: { bgColor: string; elements: CardEl[] }[];
}

function PortfolioCanvasDemo({
  bgColor = "#dce8f0",
  elements = [],
  pages: initialPages,
}: PortfolioDemoProps) {
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
        {["+ 텍스트", "+ 사각형", "+ 이미지"].map((label) => (
          <div
            key={label}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#f1f5f9",
              fontSize: 13,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            {label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: "7px 10px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#fff",
            fontSize: 13,
            color: "#374151",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ color: "#9ca3af", fontSize: 12 }}>파일명</span>
          <span style={{ fontWeight: 500 }}>portfolio</span>
          <span style={{ color: "#9ca3af", fontSize: 12 }}>.pdf</span>
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
          <div
            style={{
              width: 72,
              height: 36,
              borderRadius: 6,
              border: "1.5px dashed #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            +
          </div>
        </div>

        {/* Canvas */}
        <div
          onClick={() => setSelectedId(null)}
          style={{
            position: "relative",
            width: CANVAS_W,
            height: CANVAS_H,
            backgroundColor: currentPage.bgColor,
            boxShadow: "0 4px 32px rgba(0,0,0,0.14)",
            borderRadius: 4,
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

const meta: Meta<typeof PortfolioCanvasDemo> = {
  title: "Design/Portfolio",
  component: PortfolioCanvasDemo,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "gray",
      values: [{ name: "gray", value: "#f1f5f9" }],
    },
    docs: {
      description: {
        component:
          "포트폴리오 에디터 캔버스 미리보기. 텍스트·사각형·이미지 요소를 클릭해 선택하면 오른쪽 속성 패널에 정보가 표시됩니다. 🔗 아이콘이 표시된 텍스트는 PDF 저장 시 클릭 가능한 링크로 삽입됩니다.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: "빈 포트폴리오",
  args: { bgColor: "#dce8f0", elements: [] },
};

export const MyCareer: Story = {
  name: "My Career 템플릿",
  args: { bgColor: "#dce8f0", elements: myCareerEls },
};

export const Developer: Story = {
  name: "개발자 포트폴리오",
  args: { bgColor: "#dce8f0", elements: developerEls },
};

export const MultiPage: Story = {
  name: "다중 페이지",
  render: () => (
    <PortfolioCanvasDemo
      pages={[
        { bgColor: "#dce8f0", elements: myCareerEls },
        { bgColor: "#dce8f0", elements: developerEls },
      ]}
    />
  ),
};
