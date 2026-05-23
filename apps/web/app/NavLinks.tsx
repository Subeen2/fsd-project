"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/chat", label: "채팅" },
  { href: "/mindmap", label: "마인드맵" },
  { href: "/todo", label: "할 일" },
  { href: "/invite", label: "초대장" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav style={{ display: "flex", gap: "4px" }}>
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: active ? 600 : 400,
              color: active ? "#2563eb" : "#6b7280",
              backgroundColor: active ? "#eff6ff" : "transparent",
              textDecoration: "none",
              transition: "all 0.1s",
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
