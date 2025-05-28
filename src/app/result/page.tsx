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

export default function ResultPage() {
  const { userScores, bestMatch, setBestMatch } = useSurveyStore();
  const router = useRouter();
  const candidate = CANDIDATES.find((c) => c.id === bestMatch?.id);

  /* 최초 로직 */
  useEffect(() => {
    if (!userScores || userScores.every((v) => v === 0)) {
      router.push("/survey");
      return;
    }
    if (!bestMatch) {
      const { best, similarity } = findBestMatch(userScores, CANDIDATES);
      setBestMatch({
        id: best.id,
        similarity: Math.round(similarity * 100),
      });
    }
  }, [userScores, bestMatch, setBestMatch, router]);

  if (!candidate || !bestMatch) return <div>Loading...</div>;

  /* 공유 링크 계산 */
  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const shareUrl = siteOrigin;
  const startUrl = `${siteOrigin}/survey`;
  const shareText = "대통령 누구 뽑지?";

  /* 공유 핸들러 */
  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: shareText, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("링크가 복사되었습니다!");
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      startUrl
    )}&text=${encodeURIComponent(
      `${shareText} (나와 맞는지 확인해보세요)`
    )}`;
    window.open(url, "_blank");
  };

  /* UI */
  return (
    <div
      className={`min-h-screen ${candidateColorMap[candidate.id]} flex items-center justify-center transition-colors duration-300`}
    >
      <div className="w-full max-w-2xl p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              나와 가장 맞는 후보는?
            </h2>

            <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg">
              <Image
                src={candidateImageMap[candidate.id]}
                alt={`${candidateNameMap[candidate.id]} 프로필`}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="text-center">
              <p className="text-xl text-gray-600 mb-2">
                {candidateSymbolMap[candidate.id]}
              </p>
              <h1 className="text-3xl font-bold">
                {candidateNameMap[candidate.id]}
              </h1>
            </div>

            {/* 공유 섹션: 버튼 2개 */}
            <div className="w-full pt-6 border-t border-gray-200">
              <h3 className="mt-6 font-semibold text-center">공유하기</h3>
              <div className="flex flex-col items-center space-y-4 mt-4">
                <button
                  onClick={shareNative}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  링크 복사 / Web Share
                </button>
                <button
                  onClick={shareToTwitter}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  X(트위터)로 공유
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
