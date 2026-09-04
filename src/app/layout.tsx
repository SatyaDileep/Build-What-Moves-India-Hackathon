import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  variable: '--font-devanagari',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DocBridge - Smart Document Upload Middleware",
  description: "AI-powered middleware that automatically parses portal requirements, fetches documents from DigiLocker, and optimizes them to meet strict government upload specifications.",
  keywords: ["DocBridge", "document upload", "DigiLocker", "government portal", "EPFO", "UPSC", "AI", "middleware"],
  authors: [{ name: "DocBridge Team" }],
  openGraph: {
    title: "DocBridge - Smart Document Upload Middleware",
    description: "Never get rejected again. AI-powered document processing for Indian government portals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${devanagari.variable}`}>
      <body className={`${inter.className} antialiased`} style={{ fontFamily: "var(--font-inter), var(--font-devanagari), 'Noto Sans Devanagari', system-ui, sans-serif" }}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
