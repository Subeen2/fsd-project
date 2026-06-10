"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "../../i18n/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = locale === "ko" ? "en" : "ko";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      style={{
        padding: "4px 10px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        background: "transparent",
        fontSize: "13px",
        fontWeight: 500,
        color: isPending ? "#94a3b8" : "#374151",
        cursor: isPending ? "not-allowed" : "pointer",
        transition: "all 0.1s",
        letterSpacing: "0.02em",
      }}
    >
      {locale === "ko" ? "EN" : "KO"}
    </button>
  );
}
