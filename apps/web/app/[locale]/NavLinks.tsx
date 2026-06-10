"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../i18n/navigation";

const NAV_KEYS = [
  { href: "/chat" as const, key: "chat" as const },
  { href: "/mindmap" as const, key: "mindmap" as const },
  { href: "/todo" as const, key: "todo" as const },
  { href: "/invite" as const, key: "invite" as const },
  { href: "/portfolio" as const, key: "portfolio" as const },
  { href: "/three" as const, key: "three" as const },
];

export function NavLinks() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="hide-mobile" style={{ display: "flex", gap: "4px" }}>
      {NAV_KEYS.map(({ href, key }) => {
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
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
