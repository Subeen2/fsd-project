import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import "../globals.css";
import { Providers } from "./providers";
import { css } from "../../styled-system/css";
import { HeaderTitle } from "./HeaderTitle";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "./LanguageSwitcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mindwave",
    template: "%s | Mindwave",
  },
  description: "Full-Stack Delivery monorepo project",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ko" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <LanguageSwitcher />
                <MobileNav />
              </div>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
