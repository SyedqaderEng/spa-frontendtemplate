import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPA Template",
  description: "A modern, professional SaaS template built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
