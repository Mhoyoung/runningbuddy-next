import Link from "next/link";

export default async function RaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 더미 데이터 (나중에 DB 연결)
  const race = {
    id,
    name: "2025 서울 마라톤",
    date: "2025-03-18",
    location: "상암월드컵공원",
    meet: "상암월드컵공원",
    address: "대한민국 서울특별시 마포구 월드컵로 243-60",
    events: [
      { type: "10K", distance: "10.000km", start: "08:47:38" },
      { type: "EH", distance: "21.098km", start: "08:02:00" },
      { type: "W", distance: "21.098km", start: "08:00:00" },
      { type: "EF", distance: "42.195km", start: "08:03:01" },
      { type: "Full", distance: "42.195km", start: "08:03:01" },
    ],
  };

  return (
    <section className="p-4 pb-24 bg-gray-50 min-h-screen">
      <Link href="/record/race" className="text-primary text-sm">
        ← 대회 목록으로
      </Link>

      {/* 타이틀 */}
      <h1 className="text-2xl font-bold mt-4">{race.name}</h1>
      <p className="text-gray-400 mt-1">{race.date}</p>

      {/* 경기종목 */}
      <div className="bg-white p-4 rounded-xl shadow-sm mt-6">
        <h2 className="font-semibold mb-3">경기 종목</h2>

        <ul className="space-y-2">
          {race.events.map((e, i) => (
            <li key={i} className="text-gray-700">
              • {e.type} ({e.distance}) | 출발 {e.start}
            </li>
          ))}
        </ul>
      </div>

      {/* 장소 */}
      <div className="bg-white p-4 rounded-xl shadow-sm mt-6 space-y-2">
        <h2 className="font-semibold">장소 정보</h2>
        <p className="text-gray-700">📍 출발장소: {race.location}</p>
        <p className="text-gray-700">📍 집결지: {race.meet}</p>
        <p className="text-gray-700">📮 주소: {race.address}</p>
      </div>

      {/* 🔥 기록 조회 입력 영역 */}
      <div className="bg-white p-4 rounded-xl shadow-sm mt-8 space-y-4">
        <h2 className="font-semibold mb-1">대회 기록 조회</h2>

        <input
          type="text"
          placeholder="배번을 입력하세요"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="text"
          placeholder="이름을 입력하세요"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <button
          className="bg-primary text-white w-full py-3 rounded-lg font-semibold active:scale-95 transition"
        >
          기록 조회하기
        </button>
      </div>

      {/* 🔥 조회 결과 (디자인 미리보기) */}
      <div className="bg-white p-4 rounded-xl shadow-sm mt-6">
        <h2 className="font-semibold mb-2">조회 결과</h2>

        <p className="text-gray-700">기록: 03:42:10</p>
        <p className="text-gray-700">페이스: 5'15''</p>
        <p className="text-gray-700">순위: 1234위</p>

        <p className="text-gray-400 text-xs mt-3">
          ※ 실제 데이터는 나중에 API와 연결됩니다.
        </p>
      </div>
    </section>
  );
}
