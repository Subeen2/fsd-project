"use client";

import { useEffect, useState } from "react";
import { useChatTheme } from "@fsd/features";
import { css } from "../../styled-system/css";

export function HeaderTitle() {
  const { roomName } = useChatTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <span
      className={css({
        fontSize: "xl",
        fontWeight: "bold",
        color: "blue.600",
      })}
      suppressHydrationWarning
    >
      {mounted ? roomName : "Mindwave"}
    </span>
  );
}
