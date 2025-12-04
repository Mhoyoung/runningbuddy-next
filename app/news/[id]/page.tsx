import Link from "next/link";
import { getNewsById } from "@/firebase/news";
import { FaArrowLeft, FaExternalLinkAlt, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNewsById(id);

  if (!item) {
    return (
      <section className="p-4 min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p className="mb-4">존재하지 않는 소식입니다.</p>
        <Link href="/news" className="text-blue-500 underline">
          목록으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b px-4 h-14 flex items-center gap-4 z-10">
        <Link href="/news" className="text-xl p-2 hover:bg-gray-100 rounded-full transition">
          <FaArrowLeft />
        </Link>
        <h1 className="font-bold text-lg">공지사항</h1>
      </div>

      <div className="p-6">
        <span className="text-blue-600 font-bold text-sm mb-2 block">
          {item.source}
        </span>
        <h2 className="text-2xl font-bold mb-3 leading-tight text-gray-900">
          {item.title}
        </h2>
        <p className="text-gray-400 text-sm mb-6 border-b border-gray-100 pb-4">
          작성일: {item.date}
        </p>

        {/*  기간 & 장소 정보 카드 (정보가 있을 때만 표시) */}
        {(item.period || item.location) && (
          <div className="bg-gray-50 p-4 rounded-xl mb-8 space-y-2 text-sm text-gray-700">
            {item.period && (
              <div className="flex gap-2">
                <FaCalendarAlt className="text-gray-400 mt-0.5" />
                <span className="font-bold">기간:</span> {item.period}
              </div>
            )}
            {item.location && (
              <div className="flex gap-2">
                <FaMapMarkerAlt className="text-gray-400 mt-0.5" />
                <span className="font-bold">장소:</span> {item.location}
              </div>
            )}
          </div>
        )}

        {/* 본문 내용 */}
        <div className="prose prose-sm text-gray-700 mb-10 whitespace-pre-line leading-relaxed min-h-[100px]">
          {item.content ? (
            item.content
          ) : (
            <p>
              안녕하세요, 러닝버디입니다.
              <br /><br />
              <b>{item.title}</b>에 대한 자세한 내용을 안내해 드립니다.
              참가 신청 및 상세 요강은 아래 공식 홈페이지에서 확인하실 수 있습니다.
            </p>
          )}
        </div>

        {/* 링크가 있을 때만 버튼 표시 */}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-black text-white text-center py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <span>공식 홈페이지 바로가기</span>
            <FaExternalLinkAlt size={14} />
          </a>
        )}
      </div>
    </div>
  );
}