import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetaMe - AI Agent Desktop",
  description: "Control your AI Agent from anywhere",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
