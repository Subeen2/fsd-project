"use client";

import { useEffect, useState } from "react";
import { useChatTheme } from "@fsd/features";
import { css } from "../../styled-system/css";
import { Link } from "../../i18n/navigation";

export function HeaderTitle() {
  const { roomName } = useChatTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/"
      className={css({
        fontSize: "xl",
        fontWeight: "bold",
        color: "blue.600",
        textDecoration: "none",
        _hover: { opacity: 0.8 },
      })}
      suppressHydrationWarning
    >
      {mounted ? roomName : "Mindwave"}
    </Link>
  );
}
