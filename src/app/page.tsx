export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">대통령 누구 뽑지?</h1>
      <p>31개의 질문에 응답하여 당신과 가장 유사한 대선 후보를 찾아보세요!</p>
      <a href="/survey" className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        테스트 시작하기
      </a>
    </div>
  );
}
