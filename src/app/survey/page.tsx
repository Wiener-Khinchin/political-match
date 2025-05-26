"use client";

import { useState, useEffect, useRef } from "react";
import { useSurveyStore } from "@/store/survey";
import { QUESTIONS } from "@/data/questions";
import { CANDIDATES } from "@/data/candidates";
import { findBestMatch } from "@/lib/similarity";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  /* ---------------- store ---------------- */
  const {
    currentStep,
    userScores,
    setAnswer,
    setBestMatch,
    setCurrentStep,
  } = useSurveyStore();

  /* ---------------- local state ---------------- */
  const [showCons, setShowCons] = useState<number | null>(null);
  const [showPros, setShowPros] = useState<number | null>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  /* ---------------- pagination ---------------- */
  const currentPage  = currentStep >= 24 ? 4 : Math.floor(currentStep / 6);
  const startIndex   = currentPage === 0 ? 0 : currentPage * 6;
  const endIndex     = currentPage === 4 ? 31 : startIndex + 6;
  const currentQuestions = QUESTIONS.slice(startIndex, endIndex);

  /* ---------------- scroll on step change ---------------- */
  useEffect(() => {
    const idxInPage = currentStep - startIndex;
    questionRefs.current[idxInPage]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentStep, startIndex]);

  /* ---------------- answer handler ---------------- */
  const handleAnswer = (idxInPage: number, value: number) => {
    const globalIdx = idxInPage + startIndex;
    const prev      = userScores[globalIdx];

    const newScores = [
      ...userScores.slice(0, globalIdx),
      value,
      ...userScores.slice(globalIdx + 1),
    ];
    setAnswer(globalIdx, value);

    // 다음 문항 or 다음 페이지
    const pageFilled = newScores.slice(startIndex, endIndex).every(v => v !== 0);
    if (pageFilled && endIndex < QUESTIONS.length) {
      setCurrentStep(endIndex);
    } else if (prev === 0 && globalIdx + 1 < QUESTIONS.length) {
      setCurrentStep(globalIdx + 1);
    }

    // 설문 완료 → 결과
    if (newScores.every(v => v !== 0)) {
      const { best, similarity } = findBestMatch(newScores, CANDIDATES);
      setBestMatch({ id: best.id, similarity });
      router.push("/result");
    }
  };

  /* ---------------- render ---------------- */
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-12">
        {currentQuestions.map((question, idxInPage) => {
          const number     = idxInPage + startIndex + 1;
          const isActive   = number - 1 === currentStep;
          const isAnswered = userScores[number - 1] !== 0;
          const hasArgs    = question.cons !== "" || question.pros !== "";

          return (
            <div
              key={number}
              ref={(el) => { questionRefs.current[idxInPage] = el; }}
              className={`
                transition-all
                ${isActive
                  ? "opacity-100 scale-100"
                  : isAnswered
                  ? "opacity-60 scale-95"
                  : "opacity-40 scale-95"}
              `}
            >
              {/* 질문 텍스트 */}
              <h2 className="text-xl font-semibold mb-4 text-center">
                {number}. {question.text}
              </h2>

              {/* ───────── Likert 스케일 ───────── */}
              <div className="relative w-full">
                {/* 상단 라벨 */}
                <div className="grid grid-cols-5 mb-2">
                  <div className="flex justify-center">
                    <span className="text-sm font-medium text-red-500 -translate-x-[6px]">반대</span>
                  </div>
                  <div />
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-500">중립</span>
                  </div>
                  <div />
                  <div className="flex justify-center">
                    <span className="text-sm font-medium text-green-500 translate-x-[6px]">찬성</span>
                  </div>
                </div>

                {/* 답변 버튼 */}
                <div className="grid grid-cols-5 gap-4 mb-2">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const size =
                      val === 3 ? "w-10 h-10 text-sm"
                      : val === 1 || val === 5 ? "w-14 h-14 text-lg"
                      : "w-12 h-12 text-base";

                    const baseColor =
                      val <= 2 ? "border-red-500 hover:border-red-600"
                      : val >= 4 ? "border-green-500 hover:border-green-600"
                      : "border-gray-400 hover:border-gray-500";

                    const selColor =
                      val <= 2 ? "bg-red-500 border-red-500"
                      : val >= 4 ? "bg-green-500 border-green-500"
                      : "bg-gray-500 border-gray-500";

                    return (
                      <div key={val} className="flex justify-center items-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAnswer(idxInPage, val); }}
                          className={`
                            ${size} rounded-full border-2 flex items-center justify-center transition
                            ${
                              userScores[number - 1] === val
                                ? `${selColor} text-white`
                                : `${baseColor} hover:scale-105`}
                          `}
                        >
                          {val}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* 하단 라벨 */}
                <div className="grid grid-cols-5 gap-4">
                  {["매우 반대", "약간 반대", "중립", "약간 찬성", "매우 찬성"].map((txt) => (
                    <div key={txt} className="text-center">
                      <span className="text-xs text-gray-500">{txt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ───────── 근거 토글 ───────── */}
              {hasArgs && (
                <div className="space-y-2 mt-6">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCons(showCons === number - 1 ? null : number - 1);
                          setShowPros(null);
                        }}
                        className={`px-4 py-2 rounded text-sm ${showCons === number - 1 ? "bg-gray-200" : "bg-gray-100"}`}
                      >
                        [근거] 반대
                      </button>
                    </div>
                    <div />
                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPros(showPros === number - 1 ? null : number - 1);
                          setShowCons(null);
                        }}
                        className={`px-4 py-2 rounded text-sm ${showPros === number - 1 ? "bg-gray-200" : "bg-gray-100"}`}
                      >
                        [근거] 찬성
                      </button>
                    </div>
                  </div>

                  {(showCons === number - 1 || showPros === number - 1) && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {showCons === number - 1 && question.cons && <p className="text-gray-700">{question.cons}</p>}
                      {showPros === number - 1 && question.pros && <p className="text-gray-700">{question.pros}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
