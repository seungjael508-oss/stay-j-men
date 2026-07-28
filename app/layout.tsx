import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stay J Men — 남성 스타일 어드바이저",
  description: "나를 알고, 오늘을 결정하고, 해낼 때까지 함께하는 남성 스타일 어드바이저",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body className={geist.variable}>{children}</body></html>;
}
