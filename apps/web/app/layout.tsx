import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { css } from "../styled-system/css";

export const metadata: Metadata = {
  title: {
    default: "FSD Project",
    template: "%s | FSD Project",
  },
  description: "Full-Stack Delivery monorepo project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header
          className={css({
            borderBottomWidth: "1px",
            borderStyle: "solid",
            borderColor: "gray.200",
            px: "6",
            py: "4",
          })}
        >
          <nav
            className={css({
              maxW: "5xl",
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            })}
          >
            <span
              className={css({
                fontSize: "xl",
                fontWeight: "bold",
                color: "blue.600",
              })}
            >
              FSD Project
            </span>
          </nav>
        </header>
        <main
          className={css({
            maxW: "5xl",
            mx: "auto",
            px: "6",
            py: "8",
          })}
        >
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
