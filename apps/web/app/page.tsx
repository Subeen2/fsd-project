"use client";

import Link from "next/link";

const CARDS = [
  {
    href: "/chat",
    icon: "💬",
    label: "채팅",
    desc: "실시간으로 대화하세요",
    hoverColor: "#2563eb",
    hoverShadow: "rgba(37,99,235,0.12)",
  },
  {
    href: "/mindmap",
    icon: "🧠",
    label: "마인드맵",
    desc: "아이디어를 구조화하세요",
    hoverColor: "#7c3aed",
    hoverShadow: "rgba(124,58,237,0.12)",
  },
  {
    href: "/invite",
    icon: "🎉",
    label: "초대장",
    desc: "초대장을 디자인하고 저장",
    hoverColor: "#f59e0b",
    hoverShadow: "rgba(245,158,11,0.12)",
  },
  {
    href: "/portfolio",
    icon: "📄",
    label: "포트폴리오",
    desc: "포트폴리오를 만들고 PDF로",
    hoverColor: "#0ea5e9",
    hoverShadow: "rgba(14,165,233,0.12)",
  },
  {
    href: "/three",
    icon: "🎲",
    label: "Three.js",
    desc: "3D 인터랙티브 데모",
    hoverColor: "#6366f1",
    hoverShadow: "rgba(99,102,241,0.12)",
  },
  {
    href: "/todo",
    icon: "✅",
    label: "할 일",
    desc: "할 일과 체크리스트 관리",
    hoverColor: "#16a34a",
    hoverShadow: "rgba(22,163,74,0.12)",
  },
] as const;

export default function HomePage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        gap: 40,
      }}
    >
      {/* 타이틀 */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Mindwave
        </h1>
        <p
          style={{
            fontSize: "clamp(13px, 2vw, 16px)",
            color: "#94a3b8",
            margin: "10px 0 0",
          }}
        >
          무엇을 시작할까요?
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="home-grid">
        {CARDS.map(({ href, icon, label, desc, hoverColor, hoverShadow }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              className="home-card"
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = hoverColor;
                el.style.boxShadow = `0 8px 24px ${hoverShadow}`;
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "#e2e8f0";
                el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                el.style.transform = "translateY(0)";
              }}
            >
              <span className="home-card-icon">{icon}</span>
              <div style={{ textAlign: "center" }}>
                <p className="home-card-title">{label}</p>
                <p className="home-card-desc">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
