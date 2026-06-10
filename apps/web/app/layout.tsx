import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { css } from "../styled-system/css";
import { HeaderTitle } from "./HeaderTitle";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mindware",
    template: "%s | Mindware",
  },
  description: "Full-Stack Delivery monorepo project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
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
            <HeaderTitle />
            <NavLinks />
            <MobileNav />
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
