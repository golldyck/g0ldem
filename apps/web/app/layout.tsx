import type { Metadata } from "next";
import { Cinzel, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const display = Cinzel({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "G0LDEM — Forge golden minds on 0G",
  description: "Vibe-code an AI golem, forge it as an INFT, own the intelligence itself.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
