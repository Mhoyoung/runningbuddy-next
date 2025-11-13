// app/page.tsx
// TEST DEPLOY
import Link from "next/link";

export default function Home() {
  const recentRecruit = [
    { id: 1, title: "오늘 저녁 반포대교 러닝!", place: "반포대교" },
    { id: 2, title: "초보 러너 환영, 5km 가볍게 뛰어요", place: "뚝섬" },
    { id: 3, title: "새벽 한강 러닝 크루 번개", place: "이촌" },
  ];

  const recentReviews = [
    { id: 1, img: null },
    { id: 2, img: null },
    { id: 3, img: null },
  ];

  const recentNews = [
    { id: 1, title: "서울 마라톤 안내", date: "2025-11-05" },
    { id: 2, title: "크루 연합 러닝 이벤트", date: "2025-11-03" },
    { id: 3, title: "초보 러너 팁 공개", date: "2025-11-01" },
  ];

  return (
    <div className="flex flex-col items-center px-4 py-6 pb-24 bg-gray-50">

      {/* 배너 */}
      <div className="w-full rounded-xl overflow-hidden shadow-md">
        <img
          src="/runner-banner.jpg"
          alt="러닝 배너"
          className="w-full h-48 object-cover"
        />
      </div>

      {/* 소개 */}
      <section className="mt-7 text-center">
        <h2 className="text-2xl font-bold">RunningBuddy</h2>
        <p className="text-gray-600 mt-2">
          함께 달리고, 함께 기록하는 러너들의 공간 🏃‍♂️
        </p>
      </section>

      {/* 최신 모집 */}
      <section className="w-full mt-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">최신 모집</h3>
          <Link href="/recruit" className="text-primary text-sm font-medium">
            더보기 →
          </Link>
        </div>

        <div className="space-y-3">
          {recentRecruit.map((r) => (
            <Link
              key={r.id}
              href={`/recruit/${r.id}`}
              className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold">{r.title}</p>
              <p className="text-gray-500 text-sm mt-1">장소: {r.place}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 최신 리뷰 */}
      <section className="w-full mt-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">최신 리뷰</h3>
          <Link href="/review" className="text-primary text-sm font-medium">
            더보기 →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {recentReviews.map((rev) => (
            <Link
              key={rev.id}
              href="/review"
              className="block w-full aspect-square bg-gray-300 rounded-xl"
            ></Link>
          ))}
        </div>
      </section>

      {/* 최신 소식 */}
      <section className="w-full mt-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">소식</h3>
          <Link href="/news" className="text-primary text-sm font-medium">
            더보기 →
          </Link>
        </div>

        <div className="space-y-3">
          {recentNews.map((n) => (
            <Link
              key={n.id}
              href={`/news/${n.id}`}
              className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold">{n.title}</p>
              <p className="text-gray-500 text-sm mt-1">{n.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
