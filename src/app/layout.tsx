import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "대통령 누구 뽑지?",
    template: "%s | 대통령 누구 뽑지?",
  },
  description: "31문항으로 나와 맞는 후보를 찾아보는 테스트",
  openGraph: {
    title: "대통령 누구 뽑지?",
    description: "31문항으로 나와 맞는 후보를 찾아보는 테스트",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "대통령 누구 뽑지?",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    title: "대통령 누구 뽑지?",
    description: "31문항으로 나와 맞는 후보를 찾아보는 테스트",
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {<script defer data-domain="presidentnuguvote.com" src="https://plausible.io/js/script.js"></script>}
        <Script
          defer
          data-domain="presidentnuguvote.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
