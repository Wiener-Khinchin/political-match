/* src/app/result/page.tsx */
"use client";

import { useSurveyStore } from "@/store/survey";
import { CANDIDATES } from "@/data/candidates";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { findBestMatch } from "@/lib/similarity";

/* ✅ 각 파일을 정확히 import */
import { candidateImageMap }   from "@/data/candidateImageMap";
import { candidateNameMap }    from "@/data/candidateNameMap";
import { candidateSymbolMap }  from "@/data/candidateSymbolMap";
import { candidateColorMap }   from "@/data/candidateColorMap";

import Image from "next/image";

export default function ResultPage() {
  const { userScores, bestMatch, setBestMatch } = useSurveyStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const candidate = CANDIDATES.find(c => c.id === bestMatch?.id);

  /* ── 최초 로직 ── */
  useEffect(() => {
    if (!userScores || userScores.every(v => v === 0)) {
      router.push("/survey");
      return;
    }
    if (!bestMatch) {
      const { best, similarity } = findBestMatch(userScores, CANDIDATES);
      setBestMatch({ id: best.id, similarity: Math.round(similarity * 100) });
    }
    setLoading(false);
  }, []);

  if (loading || !bestMatch || !candidate)
    return <p className="text-center mt-10">결과를 불러오는 중...</p>;

  /* ── 공유 링크 & 텍스트 ── */
  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const shareUrl  = siteOrigin;
  const shareText = `나와 가장 맞는 후보는 ${candidateNameMap[candidate.id]}!`;

  /* ---------- 공유 핸들러 ---------- */
  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: shareText, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("링크가 복사되었습니다!");
    }
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  /* ── UI ── */
  return (
    <div
      className={`min-h-screen ${candidateColorMap[candidate.id]} flex items-center justify-center transition-colors duration-300`}
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

            {/* 기호 + 이름 */}
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-2">
                {candidateSymbolMap[candidate.id]}
              </p>
              <h1 className="text-3xl font-bold">
                {candidateNameMap[candidate.id]}
              </h1>
            </div>

            {/* 공유: 링크 복사 / X */}
            <div className="w-full pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-center mb-4">
                설문 링크 공유하기
              </h3>
              <div className="flex justify-center gap-4">
                {/* Web Share / 링크 복사 */}
                <button
                  onClick={shareNative}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="링크 공유하기"
                >
                  {/* 화살표 아이콘 */}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>

                {/* X(Twitter) */}
                <button
                  onClick={shareToTwitter}
                  className="p-3 rounded-full bg-black hover:bg-gray-800 transition-colors"
                  title="X(Twitter)로 공유"
                >
                  {/* X 아이콘 */}
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
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
