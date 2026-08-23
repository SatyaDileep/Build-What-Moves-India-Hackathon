import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
