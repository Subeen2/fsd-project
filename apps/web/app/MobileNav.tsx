"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/chat", label: "💬 채팅" },
  { href: "/mindmap", label: "🧠 마인드맵" },
  { href: "/todo", label: "✅ 할 일" },
  { href: "/invite", label: "🎉 초대장" },
  { href: "/portfolio", label: "📄 포트폴리오" },
  { href: "/three", label: "🎲 Three.js" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 페이지 이동 시 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* 햄버거 버튼 — 모바일에서만 표시 */}
      <button
        className="show-mobile"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "block",
            width: 22,
            height: 2,
            background: "#374151",
            borderRadius: 2,
            transition: "all 0.2s",
          }}
        />
        <span
          style={{
            display: "block",
            width: 22,
            height: 2,
            background: "#374151",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            display: "block",
            width: 22,
            height: 2,
            background: "#374151",
            borderRadius: 2,
          }}
        />
      </button>

      {/* 오버레이 */}
      <div
        className={`mobile-overlay${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* 드로어 */}
      <div
        className={`mobile-drawer${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="내비게이션 메뉴"
      >
        {/* 드로어 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>
            Mindwave
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="메뉴 닫기"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 22,
              color: "#6b7280",
              lineHeight: 1,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* 링크 목록 */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "block",
                  padding: "14px 24px",
                  fontSize: 15,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#2563eb" : "#374151",
                  backgroundColor: active ? "#eff6ff" : "transparent",
                  textDecoration: "none",
                  borderLeft: `3px solid ${active ? "#2563eb" : "transparent"}`,
                  transition: "all 0.1s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
