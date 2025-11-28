import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Bryx's Digital Twin - MCP Server",
  description: "AI-powered interview preparation system using RAG technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
