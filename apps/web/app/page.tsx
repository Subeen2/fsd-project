"use client";

import Link from "next/link";

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
        gap: 48,
      }}
    >
      {/* 타이틀 */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Mindwave
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", margin: "10px 0 0" }}>
          무엇을 시작할까요?
        </p>
      </div>

      {/* 카드 선택 */}
      <div style={{ display: "flex", gap: 24 }}>
        <Link href="/chat" style={{ textDecoration: "none" }}>
          <div
            style={{
              width: 240,
              height: 280,
              backgroundColor: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#2563eb";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 24px rgba(37,99,235,0.12)";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 1px 4px rgba(0,0,0,0.06)";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
            }}
          >
            <span style={{ fontSize: 56 }}>💬</span>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                채팅
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  margin: "6px 0 0",
                  lineHeight: 1.5,
                }}
              >
                실시간으로 대화하세요
              </p>
            </div>
          </div>
        </Link>

        <Link href="/mindmap" style={{ textDecoration: "none" }}>
          <div
            style={{
              width: 240,
              height: 280,
              backgroundColor: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#7c3aed";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 24px rgba(124,58,237,0.12)";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 1px 4px rgba(0,0,0,0.06)";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
            }}
          >
            <span style={{ fontSize: 56 }}>🧠</span>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                마인드맵
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  margin: "6px 0 0",
                  lineHeight: 1.5,
                }}
              >
                아이디어를 구조화하세요
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
