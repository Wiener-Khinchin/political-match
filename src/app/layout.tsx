import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://presidentnuguvote.com";
const ogImage = `${siteUrl}/og-thumbnail.jpeg`;

export const metadata: Metadata = {
  title: {
    default: "대통령 누구 뽑지?",
    template: "%s | 대통령 누구 뽑지?",
  },
  description: "31문항으로 나와 맞는 후보를 찾아보는 테스트. 정치색 없이 중립적으로 설계되었습니다.",
  openGraph: {
    title: "대통령 누구 뽑지?",
    description: "31문항으로 나와 맞는 후보를 찾아보는 테스트. 정치색 없이 중립적으로 설계되었습니다.",
    url: siteUrl,
    siteName: "대통령 누구 뽑지?",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "정치 성향 테스트 썸네일",
      },
    ],
  },
  twitter: {
    title: "대통령 누구 뽑지?",
    description: "31문항으로 나와 맞는 후보를 찾아보는 테스트. 정치색 없이 중립적으로 설계되었습니다.",
    card: "summary_large_image",
    images: [ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>대통령 누구 뽑지? - 나와 가장 닮은 후보는?</title>
        <meta name="description" content="31문항으로 나와 맞는 후보를 찾아보는 테스트. 정치색 없이 중립적으로 설계되었습니다." />
        <meta name="keywords" content="대선 후보 매칭, 정치 성향 테스트, 대통령 선거, 대선 테스트, 설문, 대통령 누구 뽑지" />
        
        {/* Open Graph */}
        <meta property="og:title" content="대통령 누구 뽑지?" />
        <meta property="og:description" content="31문항으로 나와 맞는 후보를 찾아보는 테스트. 정치색 없이 중립적으로 설계되었습니다." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="대통령 누구 뽑지?" />
        <meta property="og:locale" content="ko_KR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="대통령 누구 뽑지?" />
        <meta name="twitter:description" content="31문항으로 나와 맞는 후보를 찾아보는 테스트. 정치색 없이 중립적으로 설계되었습니다." />
        <meta name="twitter:image" content={ogImage} />

        {/* Plausible 고급 추적 */}
        <script
          defer
          data-domain="presidentnuguvote.com"
          src="https://plausible.io/js/script.outbound-links.tagged-events.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible = window.plausible || function () {
                (window.plausible.q = window.plausible.q || []).push(arguments);
              };
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
