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
  title: "대통령 누구 뽑지?",
  description: "31문항으로 누구 뽑을지 정해보기!",
  openGraph: {
    title: "대통령 누구 뽑지?",
    description: "31문항으로 누구 뽑을지 정해보기!",
    type: "website",
    locale: "ko_KR",
    siteName: "대통령 누구 뽑지?",
  },
  twitter: {
    title: "대통령 누구 뽑지?",
    description: "31문항으로 누구 뽑을지 정해보기!",
    card: "summary_large_image",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script src="https://developers.kakao.com/sdk/js/kakao.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
