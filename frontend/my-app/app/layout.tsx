import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Route53 Clone",
  description: "AWS Route53 Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
