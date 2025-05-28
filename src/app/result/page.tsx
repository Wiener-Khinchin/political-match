/* src/app/result/page.tsx */
"use client";

import { useSurveyStore } from "@/store/survey";
import { CANDIDATES } from "@/data/candidates";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { findBestMatch } from "@/lib/similarity";
import { candidateImageMap } from "@/data/candidateImageMap";
import { candidateNameMap } from "@/data/candidateNameMap";
import { candidateSymbolMap } from "@/data/candidateSymbolMap";
import { candidateColorMap } from "@/data/candidateColorMap";
import Image from "next/image";

/* ─────────── Kakao 타입 정의 ─────────── */
declare global {
  interface KakaoShareDefaultButtonOptions {
    objectType: "feed";
    content: {
      title: string;
      description: string;
      imageUrl: string;
      link: { mobileWebUrl: string; webUrl: string };
    };
    buttons: {
      title: string;
      link: { mobileWebUrl: string; webUrl: string };
    }[];
  }

  interface Kakao {
    init: (key: string) => void;
    isInitialized: () => boolean;
    Share: { sendDefault: (opt: KakaoShareDefaultButtonOptions) => void };
  }

  interface Window {
    Kakao: Kakao;
  }
}
/* ─────────────────────────────────────── */

export default function ResultPage() {
  const { userScores, bestMatch, setBestMatch } = useSurveyStore();
  const router = useRouter();
  const candidate = CANDIDATES.find((c) => c.id === bestMatch?.id);

  /* ─────────── 최초 로직 ─────────── */
  useEffect(() => {
    // 응답 없이 결과 페이지 접근 → 설문으로 리다이렉트
    if (!userScores || userScores.every((v) => v === 0)) {
      router.push("/survey");
      return;
    }

    // 아직 결과 계산 안 됐으면 계산
    if (!bestMatch) {
      const result = findBestMatch(userScores, CANDIDATES);
      setBestMatch({
        id: result.best.id,
        similarity: Math.round(result.similarity * 100),
      });
    }

    // 카카오 SDK 초기화
    if (
      process.env.NEXT_PUBLIC_KAKAO_JS_KEY &&
      typeof window !== "undefined" &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  }, [userScores, bestMatch, setBestMatch, router]);
  /* ──────────────────────────────── */

  if (!candidate || !bestMatch) return <div>Loading...</div>;

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}`; // 홈
  const startUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/survey`;
  const shareText = "대통령 누구 뽑지?";

  /* 1) Web Share API / Instagram */
  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: shareText, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("링크가 복사되었습니다!");
    }
  };

  /* 2) X(Twitter) */
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      startUrl
    )}&text=${encodeURIComponent(`${shareText}  (나와 맞는지 확인해보세요)`)}`;
    window.open(url, "_blank");
  };

  /* 3) KakaoTalk */
  const shareToKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: shareText,
        description: "대선 누구 뽑지? 테스트 결과",
        imageUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/og/${bestMatch.id}.png`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: "내 결과 보기",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        {
          title: "처음부터 설문하기",
          link: { mobileWebUrl: startUrl, webUrl: startUrl },
        },
      ],
    });
  };

  /* ─────────── UI ─────────── */
  return (
    <div
      className={`min-h-screen ${candidateColorMap[candidate.id]} transition-colors duration-300 flex items-center justify-center`}
    >
      <div className="w-full max-w-2xl p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* 제목 */}
            <h2 className="text-2xl font-semibold text-gray-800">
              나와 가장 맞는 후보는?
            </h2>

            {/* 사진 */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg">
              <Image
                src={candidateImageMap[candidate.id]}
                alt={`${candidateNameMap[candidate.id]} 프로필`}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 후보 번호·이름 */}
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-2">
                {candidateSymbolMap[candidate.id]}
              </p>
              <h1 className="text-3xl font-bold">
                {candidateNameMap[candidate.id]}
              </h1>
            </div>

            {/* 공유 섹션 */}
            <div className="w-full pt-6 border-t border-gray-200">
              <h3 className="mt-6 font-semibold text-center">공유하기</h3>
              <div className="flex justify-center gap-4 mt-4">
                {/* Native / Instagram */}
                <button
                  onClick={shareNative}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6"
                  >
                    <path d="M13 12h7l-8 8-8-8h7V4h2v8z" />
                  </svg>
                </button>

                {/* Twitter / X */}
                <button
                  onClick={shareToTwitter}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6"
                  >
                    <path d="M4.5 3h5.7l4 5.8L18.7 3h5.8l-7.4 10 7.5 11h-5.8l-4.1-6-4.2 6H4.5l7.5-11L4.5 3z" />
                  </svg>
                </button>

                {/* Kakao */}
                <button
                  onClick={shareToKakao}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-400 text-[#3C1E1E] hover:bg-yellow-500 transition-colors flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 5.463 2 9.702c0 2.682 1.76 5.036 4.41 6.39-.19.882-.74 3.22-.85 3.72-.13.56.2.55.37.4.14-.12 2.2-1.74 3.08-2.44.51.07 1.04.11 1.59.11 5.523 0 10-3.463 10-7.702S17.523 2 12 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}