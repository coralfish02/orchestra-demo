import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "オーケストラ練習支援エージェント",
  description: "アマチュアオーケストラ演奏家のための練習準備支援AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
