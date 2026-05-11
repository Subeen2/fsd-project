import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
        <header className="border-b border-gray-200 px-6 py-4">
          <nav className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">FSD Project</span>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
