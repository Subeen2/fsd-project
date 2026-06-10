import { useTranslations } from "next-intl";
import { Link } from "../../i18n/navigation";

const CARDS = [
  {
    href: "/chat" as const,
    icon: "💬",
    key: "chat" as const,
    hoverColor: "#2563eb",
    hoverShadow: "rgba(37,99,235,0.12)",
  },
  {
    href: "/mindmap" as const,
    icon: "🧠",
    key: "mindmap" as const,
    hoverColor: "#7c3aed",
    hoverShadow: "rgba(124,58,237,0.12)",
  },
  {
    href: "/invite" as const,
    icon: "🎉",
    key: "invite" as const,
    hoverColor: "#f59e0b",
    hoverShadow: "rgba(245,158,11,0.12)",
  },
  {
    href: "/portfolio" as const,
    icon: "📄",
    key: "portfolio" as const,
    hoverColor: "#0ea5e9",
    hoverShadow: "rgba(14,165,233,0.12)",
  },
  {
    href: "/three" as const,
    icon: "🎲",
    key: "three" as const,
    hoverColor: "#6366f1",
    hoverShadow: "rgba(99,102,241,0.12)",
  },
  {
    href: "/todo" as const,
    icon: "✅",
    key: "todo" as const,
    hoverColor: "#16a34a",
    hoverShadow: "rgba(22,163,74,0.12)",
  },
] as const;

export default function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("home.cards");

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
          {t("title")}
        </h1>
        <p
          style={{
            fontSize: "clamp(13px, 2vw, 16px)",
            color: "#94a3b8",
            margin: "10px 0 0",
          }}
        >
          {t("subtitle")}
        </p>
      </div>

      <div className="home-grid">
        {CARDS.map(({ href, icon, key, hoverColor, hoverShadow }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              className="home-card"
              style={
                {
                  "--hover-color": hoverColor,
                  "--hover-shadow": hoverShadow,
                } as React.CSSProperties
              }
            >
              <span className="home-card-icon">{icon}</span>
              <div style={{ textAlign: "center" }}>
                <p className="home-card-title">{tc(`${key}.label`)}</p>
                <p className="home-card-desc">{tc(`${key}.desc`)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
