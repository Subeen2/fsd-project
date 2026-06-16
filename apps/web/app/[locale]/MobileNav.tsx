"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../i18n/navigation";
import { useEffect, useState } from "react";

const NAV_KEYS = [
  { href: "/chat" as const, icon: "💬", key: "chat" as const },
  { href: "/mindmap" as const, icon: "🧠", key: "mindmap" as const },
  { href: "/todo" as const, icon: "✅", key: "todo" as const },
  // { href: "/invite" as const, icon: "🎉", key: "invite" as const },
  // { href: "/portfolio" as const, icon: "📄", key: "portfolio" as const },
  { href: "/three" as const, icon: "🎲", key: "three" as const },
];

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
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

      <div
        className={`mobile-overlay${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`mobile-drawer${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="내비게이션 메뉴"
      >
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

        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV_KEYS.map(({ href, icon, key }) => {
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
                {icon} {t(key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
