// app/result/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대통령 누구 뽑지?",
  description: "나와 맞는 후보를 알아보는 테스트 결과",
  openGraph: {
    title: "대통령 누구 뽑지?",
    description: "테스트 결과를 확인해보세요",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "대통령 누구 뽑지?",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    title: "대통령 누구 뽑지?",
    description: "테스트 결과를 확인해보세요",
    card: "summary_large_image",
  },
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
