import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "心动板 Demo",
  description: "小红书风格移动端心动板演示",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f4f4f4] text-[#1f1f1f]">
        <div className="mx-auto min-h-screen w-full max-w-[430px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
          {children}
        </div>
      </body>
    </html>
  );
}
