import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

// ─── Primitive color palette (Tailwind scale used by Panda CSS) ───────────────

const PALETTE = {
  Brand: {
    label: "indigo",
    shades: [
      { name: "50", hex: "#eef2ff" },
      { name: "100", hex: "#e0e7ff" },
      { name: "200", hex: "#c7d2fe" },
      { name: "300", hex: "#a5b4fc" },
      { name: "400", hex: "#818cf8" },
      { name: "500", hex: "#6366f1" },
      { name: "600", hex: "#4f46e5" },
      { name: "700", hex: "#4338ca" },
      { name: "800", hex: "#3730a3" },
      { name: "900", hex: "#312e81" },
      { name: "950", hex: "#1e1b4b" },
    ],
  },
  Neutral: {
    label: "slate",
    shades: [
      { name: "50", hex: "#f8fafc" },
      { name: "100", hex: "#f1f5f9" },
      { name: "200", hex: "#e2e8f0" },
      { name: "300", hex: "#cbd5e1" },
      { name: "400", hex: "#94a3b8" },
      { name: "500", hex: "#64748b" },
      { name: "600", hex: "#475569" },
      { name: "700", hex: "#334155" },
      { name: "800", hex: "#1e293b" },
      { name: "900", hex: "#0f172a" },
      { name: "950", hex: "#020617" },
    ],
  },
  Danger: {
    label: "rose",
    shades: [
      { name: "50", hex: "#fff1f2" },
      { name: "100", hex: "#ffe4e6" },
      { name: "200", hex: "#fecdd3" },
      { name: "300", hex: "#fda4af" },
      { name: "400", hex: "#fb7185" },
      { name: "500", hex: "#f43f5e" },
      { name: "600", hex: "#e11d48" },
      { name: "700", hex: "#be123c" },
      { name: "800", hex: "#9f1239" },
      { name: "900", hex: "#881337" },
      { name: "950", hex: "#4c0519" },
    ],
  },
  Success: {
    label: "emerald",
    shades: [
      { name: "50", hex: "#ecfdf5" },
      { name: "100", hex: "#d1fae5" },
      { name: "200", hex: "#a7f3d0" },
      { name: "300", hex: "#6ee7b7" },
      { name: "400", hex: "#34d399" },
      { name: "500", hex: "#10b981" },
      { name: "600", hex: "#059669" },
      { name: "700", hex: "#047857" },
      { name: "800", hex: "#065f46" },
      { name: "900", hex: "#064e3b" },
      { name: "950", hex: "#022c22" },
    ],
  },
  Warning: {
    label: "amber",
    shades: [
      { name: "50", hex: "#fffbeb" },
      { name: "100", hex: "#fef3c7" },
      { name: "200", hex: "#fde68a" },
      { name: "300", hex: "#fcd34d" },
      { name: "400", hex: "#fbbf24" },
      { name: "500", hex: "#f59e0b" },
      { name: "600", hex: "#d97706" },
      { name: "700", hex: "#b45309" },
      { name: "800", hex: "#92400e" },
      { name: "900", hex: "#78350f" },
      { name: "950", hex: "#451a03" },
    ],
  },
  Info: {
    label: "sky",
    shades: [
      { name: "50", hex: "#f0f9ff" },
      { name: "100", hex: "#e0f2fe" },
      { name: "200", hex: "#bae6fd" },
      { name: "300", hex: "#7dd3fc" },
      { name: "400", hex: "#38bdf8" },
      { name: "500", hex: "#0ea5e9" },
      { name: "600", hex: "#0284c7" },
      { name: "700", hex: "#0369a1" },
      { name: "800", hex: "#075985" },
      { name: "900", hex: "#0c4a6e" },
      { name: "950", hex: "#082f49" },
    ],
  },
};

// ─── Semantic token groups ────────────────────────────────────────────────────

const SEMANTIC_GROUPS = [
  {
    label: "Background",
    tokens: [
      {
        name: "bg.default",
        hex: "#ffffff",
        dark: "#020617",
        desc: "Page / card background",
      },
      {
        name: "bg.subtle",
        hex: "#f8fafc",
        dark: "#0f172a",
        desc: "Subtle section fill",
      },
      {
        name: "bg.muted",
        hex: "#f1f5f9",
        dark: "#1e293b",
        desc: "Input, disabled fill",
      },
      {
        name: "bg.inverted",
        hex: "#0f172a",
        dark: "#ffffff",
        desc: "Dark surface on light",
      },
    ],
  },
  {
    label: "Text",
    tokens: [
      {
        name: "text.default",
        hex: "#0f172a",
        dark: "#f8fafc",
        desc: "Primary body text",
      },
      {
        name: "text.subtle",
        hex: "#475569",
        dark: "#94a3b8",
        desc: "Secondary / helper text",
      },
      {
        name: "text.muted",
        hex: "#94a3b8",
        dark: "#475569",
        desc: "Placeholder / hint",
      },
      {
        name: "text.inverted",
        hex: "#ffffff",
        dark: "#0f172a",
        desc: "Text on dark background",
      },
      {
        name: "text.disabled",
        hex: "#cbd5e1",
        dark: "#334155",
        desc: "Disabled state",
      },
    ],
  },
  {
    label: "Border",
    tokens: [
      {
        name: "border.default",
        hex: "#e2e8f0",
        dark: "#334155",
        desc: "Standard divider",
      },
      {
        name: "border.subtle",
        hex: "#f1f5f9",
        dark: "#1e293b",
        desc: "Very faint separator",
      },
      {
        name: "border.strong",
        hex: "#94a3b8",
        dark: "#64748b",
        desc: "Emphasized border",
      },
    ],
  },
  {
    label: "Brand",
    tokens: [
      {
        name: "brand.default",
        hex: "#4f46e5",
        dark: "#818cf8",
        desc: "Primary actions",
      },
      {
        name: "brand.subtle",
        hex: "#eef2ff",
        dark: "#1e1b4b",
        desc: "Hover / selected bg",
      },
      {
        name: "brand.muted",
        hex: "#e0e7ff",
        dark: "#312e81",
        desc: "Focus ring bg",
      },
      {
        name: "brand.fg",
        hex: "#ffffff",
        dark: "#ffffff",
        desc: "Text on brand",
      },
      {
        name: "brand.text",
        hex: "#4338ca",
        dark: "#a5b4fc",
        desc: "Brand-colored text",
      },
      {
        name: "brand.border",
        hex: "#c7d2fe",
        dark: "#3730a3",
        desc: "Brand border",
      },
    ],
  },
  {
    label: "Danger",
    tokens: [
      {
        name: "danger.default",
        hex: "#f43f5e",
        dark: "#fb7185",
        desc: "Destructive action",
      },
      {
        name: "danger.subtle",
        hex: "#fff1f2",
        dark: "#4c0519",
        desc: "Error bg",
      },
      {
        name: "danger.text",
        hex: "#be123c",
        dark: "#fda4af",
        desc: "Error message text",
      },
      {
        name: "danger.border",
        hex: "#fecdd3",
        dark: "#9f1239",
        desc: "Error border",
      },
    ],
  },
  {
    label: "Success",
    tokens: [
      {
        name: "success.default",
        hex: "#10b981",
        dark: "#34d399",
        desc: "Positive confirmation",
      },
      {
        name: "success.subtle",
        hex: "#ecfdf5",
        dark: "#022c22",
        desc: "Success bg",
      },
      {
        name: "success.text",
        hex: "#047857",
        dark: "#6ee7b7",
        desc: "Success text",
      },
    ],
  },
  {
    label: "Warning",
    tokens: [
      {
        name: "warning.default",
        hex: "#f59e0b",
        dark: "#fbbf24",
        desc: "Caution / alert",
      },
      {
        name: "warning.subtle",
        hex: "#fffbeb",
        dark: "#451a03",
        desc: "Warning bg",
      },
      {
        name: "warning.text",
        hex: "#b45309",
        dark: "#fcd34d",
        desc: "Warning text",
      },
    ],
  },
  {
    label: "Info",
    tokens: [
      {
        name: "info.default",
        hex: "#0ea5e9",
        dark: "#38bdf8",
        desc: "Informational",
      },
      { name: "info.subtle", hex: "#f0f9ff", dark: "#082f49", desc: "Info bg" },
      { name: "info.text", hex: "#0369a1", dark: "#7dd3fc", desc: "Info text" },
    ],
  },
];

// ─── Typography ───────────────────────────────────────────────────────────────

const TYPE_SCALE = [
  { token: "2xs", rem: "0.625rem", px: "10px" },
  { token: "xs", rem: "0.75rem", px: "12px" },
  { token: "sm", rem: "0.875rem", px: "14px" },
  { token: "md", rem: "1rem", px: "16px" },
  { token: "lg", rem: "1.125rem", px: "18px" },
  { token: "xl", rem: "1.25rem", px: "20px" },
  { token: "2xl", rem: "1.5rem", px: "24px" },
  { token: "3xl", rem: "1.875rem", px: "30px" },
  { token: "4xl", rem: "2.25rem", px: "36px" },
  { token: "5xl", rem: "3rem", px: "48px" },
];

// ─── Radii ────────────────────────────────────────────────────────────────────

const RADII = [
  { token: "none", value: "0", px: "0px" },
  { token: "xs", value: "0.125rem", px: "2px" },
  { token: "sm", value: "0.25rem", px: "4px" },
  { token: "md", value: "0.375rem", px: "6px" },
  { token: "lg", value: "0.5rem", px: "8px" },
  { token: "xl", value: "0.75rem", px: "12px" },
  { token: "2xl", value: "1rem", px: "16px" },
  { token: "3xl", value: "1.5rem", px: "24px" },
  { token: "full", value: "9999px", px: "9999px" },
];

// ─── Shadows ──────────────────────────────────────────────────────────────────

const SHADOWS = [
  { token: "xs", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  {
    token: "sm",
    value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  {
    token: "md",
    value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  {
    token: "lg",
    value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  {
    token: "xl",
    value:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  { token: "2xl", value: "0 25px 50px -12px rgb(0 0 0 / 0.25)" },
  { token: "inner", value: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)" },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  page: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    color: "#0f172a",
    padding: "40px 48px",
    maxWidth: 960,
    margin: "0 auto",
    lineHeight: 1.5,
  } as React.CSSProperties,
  h1: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    margin: "0 0 6px",
  } as React.CSSProperties,
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 48,
  } as React.CSSProperties,
  h2: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#64748b",
    margin: "48px 0 20px",
    paddingBottom: 8,
    borderBottom: "1px solid #e2e8f0",
  } as React.CSSProperties,
  h3: {
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    margin: "24px 0 10px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  } as React.CSSProperties,
  tag: {
    display: "inline-block",
    fontSize: 11,
    fontFamily: "ui-monospace, monospace",
    background: "#f1f5f9",
    color: "#475569",
    borderRadius: 4,
    padding: "1px 6px",
  } as React.CSSProperties,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ColorRow({
  hex,
  name,
  desc,
}: {
  hex: string;
  name: string;
  desc?: string;
}) {
  const isLight = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 > 160;
  };
  const fg = isLight(hex) ? "#0f172a" : "#ffffff";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: hex,
          border: "1px solid rgb(0 0 0 / 0.06)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          color: fg,
          fontFamily: "ui-monospace, monospace",
        }}
      >
        {hex}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
          {name}
        </div>
        {desc && (
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
            {desc}
          </div>
        )}
      </div>
    </div>
  );
}

function ColorStrip({ shades }: { shades: { name: string; hex: string }[] }) {
  return (
    <div
      style={{
        display: "flex",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      {shades.map(({ name, hex }) => {
        const isLight = (h: string) => {
          const r = parseInt(h.slice(1, 3), 16);
          const g = parseInt(h.slice(3, 5), 16);
          const b = parseInt(h.slice(5, 7), 16);
          return r * 0.299 + g * 0.587 + b * 0.114 > 160;
        };
        return (
          <div
            key={name}
            title={`${name} — ${hex}`}
            style={{
              flex: 1,
              height: 56,
              background: hex,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 5,
              fontSize: 10,
              fontFamily: "ui-monospace, monospace",
              color: isLight(hex)
                ? "rgb(0 0 0 / 0.5)"
                : "rgb(255 255 255 / 0.6)",
            }}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Foundations component ───────────────────────────────────────────────

function Foundations() {
  return (
    <div style={S.page}>
      <h1 style={S.h1}>Design Foundations</h1>
      <p style={S.subtitle}>
        FSD Design System의 토큰 & 파운데이션 — 색상, 타이포그래피, 간격,
        그림자의 기준값입니다.
      </p>

      {/* ── Primitive Colors ────────────────────────────────────────────── */}
      <h2 style={S.h2}>Primitive Colors</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
        Panda CSS 기본 팔레트(Tailwind 스케일)를 그대로 사용합니다. 컴포넌트에서
        직접 사용하지 말고 아래 Semantic Token을 통해 참조하세요.
      </p>
      {Object.entries(PALETTE).map(([role, { label, shades }]) => (
        <div key={role} style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>{role}</span>
            <span style={S.tag}>{label}</span>
          </div>
          <ColorStrip shades={shades} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "4px 12px",
            }}
          >
            {shades.map(({ name, hex }) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "2px 0",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: hex,
                    border: "1px solid rgb(0 0 0 / 0.08)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "ui-monospace, monospace",
                    color: "#475569",
                  }}
                >
                  {label}.{name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── Semantic Colors ─────────────────────────────────────────────── */}
      <h2 style={S.h2}>Semantic Tokens — Colors</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
        의미 기반 색상 토큰입니다. 컴포넌트에서는 항상 이 토큰을 사용하세요.
        Light / Dark 값은 Panda CSS가 자동으로 적용합니다.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 32,
        }}
      >
        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 style={S.h3}>{group.label}</h3>
            {group.tokens.map((t) => (
              <div key={t.name} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                    <div
                      title={`Light: ${t.hex}`}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "6px 0 0 6px",
                        background: t.hex,
                        border: "1px solid rgb(0 0 0 / 0.07)",
                      }}
                    />
                    <div
                      title={`Dark: ${t.dark}`}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "0 6px 6px 0",
                        background: t.dark,
                        border: "1px solid rgb(0 0 0 / 0.07)",
                      }}
                    />
                  </div>
                  <div>
                    <span style={S.tag}>{t.name}</span>
                    <span
                      style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}
                    >
                      {t.desc}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Typography ──────────────────────────────────────────────────── */}
      <h2 style={S.h2}>Typography</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
        <span style={S.tag}>font.sans</span>: Inter, ui-sans-serif &nbsp;·&nbsp;
        <span style={S.tag}>font.serif</span>: Georgia &nbsp;·&nbsp;
        <span style={S.tag}>font.mono</span>: Fira Code
      </p>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {TYPE_SCALE.map(({ token, rem, px }, i) => (
          <div
            key={token}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "12px 20px",
              background: i % 2 === 0 ? "#fff" : "#f8fafc",
              borderBottom:
                i < TYPE_SCALE.length - 1 ? "1px solid #f1f5f9" : "none",
            }}
          >
            <div style={{ width: 80, flexShrink: 0 }}>
              <span style={S.tag}>{token}</span>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                {rem} / {px}
              </div>
            </div>
            <div
              style={{
                fontSize: rem,
                fontWeight: 400,
                color: "#0f172a",
                lineHeight: 1.2,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              The quick brown fox
            </div>
          </div>
        ))}
      </div>

      {/* Font Weight */}
      <h3 style={{ ...S.h3, marginTop: 32 }}>Font Weight</h3>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {[
          { token: "normal", weight: 400 },
          { token: "medium", weight: 500 },
          { token: "semibold", weight: 600 },
          { token: "bold", weight: 700 },
          { token: "extrabold", weight: 800 },
        ].map(({ token, weight }) => (
          <div key={token} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: weight,
                color: "#0f172a",
                lineHeight: 1,
              }}
            >
              Ag
            </div>
            <div style={{ ...S.tag, marginTop: 6 }}>{token}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
              {weight}
            </div>
          </div>
        ))}
      </div>

      {/* ── Border Radius ───────────────────────────────────────────────── */}
      <h2 style={S.h2}>Border Radius</h2>
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        {RADII.map(({ token, px }) => (
          <div key={token} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: "#e0e7ff",
                border: "2px solid #818cf8",
                borderRadius: px,
                margin: "0 auto",
              }}
            />
            <div style={{ ...S.tag, marginTop: 8 }}>{token}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
              {px}
            </div>
          </div>
        ))}
      </div>

      {/* ── Shadows ─────────────────────────────────────────────────────── */}
      <h2 style={S.h2}>Shadows</h2>
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          alignItems: "flex-end",
          paddingBottom: 24,
        }}
      >
        {SHADOWS.map(({ token, value }) => (
          <div key={token} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: "#ffffff",
                borderRadius: 12,
                boxShadow: value,
                margin: "0 auto",
                border: "1px solid #f1f5f9",
              }}
            />
            <div style={{ ...S.tag, marginTop: 12 }}>{token}</div>
          </div>
        ))}
      </div>

      {/* ── Z-Index ─────────────────────────────────────────────────────── */}
      <h2 style={S.h2}>Z-Index Scale</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { token: "hide", value: "-1" },
          { token: "base", value: "0" },
          { token: "raised", value: "1" },
          { token: "dropdown", value: "1000" },
          { token: "sticky", value: "1100" },
          { token: "overlay", value: "1200" },
          { token: "modal", value: "1300" },
          { token: "popover", value: "1400" },
          { token: "toast", value: "1500" },
          { token: "tooltip", value: "1600" },
        ].map(({ token, value }) => (
          <div
            key={token}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 14px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#4338ca" }}>
              {value}
            </span>
            <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
              {token}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: "Foundations/Design Tokens",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "FSD Design System의 색상, 타이포그래피, 간격, 그림자 토큰 레퍼런스입니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Tokens: Story = {
  render: () => <Foundations />,
  name: "All Tokens",
};

export const Colors: Story = {
  render: () => (
    <div style={{ ...S.page }}>
      <h1 style={S.h1}>Colors</h1>
      <h2 style={S.h2}>Primitive</h2>
      {Object.entries(PALETTE).map(([role, { label, shades }]) => (
        <div key={role} style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>{role}</span>
            <span style={S.tag}>{label}</span>
          </div>
          <ColorStrip shades={shades} />
        </div>
      ))}
      <h2 style={S.h2}>Semantic</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 28,
        }}
      >
        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 style={S.h3}>{group.label}</h3>
            {group.tokens.map((t) => (
              <ColorRow key={t.name} hex={t.hex} name={t.name} desc={t.desc} />
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
  name: "Colors",
};

export const Typography: Story = {
  render: () => (
    <div style={{ ...S.page }}>
      <h1 style={S.h1}>Typography</h1>
      <h2 style={S.h2}>Font Size Scale</h2>
      {TYPE_SCALE.map(({ token, rem, px }) => (
        <div
          key={token}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <div style={{ width: 80, flexShrink: 0 }}>
            <span style={S.tag}>{token}</span>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
              {px}
            </div>
          </div>
          <div style={{ fontSize: rem, color: "#0f172a", lineHeight: 1.2 }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
      ))}
    </div>
  ),
  name: "Typography",
};
