import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
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
  title: "本周灵感 Demo",
  description: "小红书风格移动端本周灵感演示",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f4f4f4] text-[#1f1f1f]">
        <div className="mx-auto min-h-screen w-full max-w-[430px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
          <div
            className="w-full shrink-0 border-b border-gray-100/80 bg-gray-50 px-3 py-1.5 text-center text-[10px] leading-snug text-gray-500"
            role="note"
          >
            本 Demo 账号、内容及图片均由 AI 模拟生成，不代表真实个人信息。
          </div>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
