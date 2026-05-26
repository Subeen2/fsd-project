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
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
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

        <Link href="/invite" style={{ textDecoration: "none" }}>
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
              (e.currentTarget as HTMLDivElement).style.borderColor = "#f59e0b";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 24px rgba(245,158,11,0.12)";
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
            <span style={{ fontSize: 56 }}>🎉</span>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                초대장
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  margin: "6px 0 0",
                  lineHeight: 1.5,
                }}
              >
                초대장을 디자인하고 저장
              </p>
            </div>
          </div>
        </Link>

        <Link href="/portfolio" style={{ textDecoration: "none" }}>
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
              (e.currentTarget as HTMLDivElement).style.borderColor = "#0ea5e9";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 24px rgba(14,165,233,0.12)";
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
            <span style={{ fontSize: 56 }}>📄</span>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                포트폴리오
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  margin: "6px 0 0",
                  lineHeight: 1.5,
                }}
              >
                포트폴리오를 만들고 PDF로
              </p>
            </div>
          </div>
        </Link>

        <Link href="/three" style={{ textDecoration: "none" }}>
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
              (e.currentTarget as HTMLDivElement).style.borderColor = "#6366f1";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 24px rgba(99,102,241,0.12)";
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
            <span style={{ fontSize: 56 }}>🎲</span>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Three.js
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  margin: "6px 0 0",
                  lineHeight: 1.5,
                }}
              >
                3D 인터랙티브 데모
              </p>
            </div>
          </div>
        </Link>

        <Link href="/todo" style={{ textDecoration: "none" }}>
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
              (e.currentTarget as HTMLDivElement).style.borderColor = "#16a34a";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 24px rgba(22,163,74,0.12)";
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
            <span style={{ fontSize: 56 }}>✅</span>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                할 일
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  margin: "6px 0 0",
                  lineHeight: 1.5,
                }}
              >
                할 일과 체크리스트 관리
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
