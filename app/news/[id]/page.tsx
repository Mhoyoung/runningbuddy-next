// app/news/[id]/page.tsx
import Link from "next/link";
import { getNewsById } from "@/firebase/news";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNewsById(id);

  if (!item) {
    return (
      <section className="p-4 min-h-screen">
        <p>존재하지 않는 소식입니다.</p>
        <Link href="/news" className="text-primary">← 목록으로</Link>
      </section>
    );
  }

  return (
    <section className="p-4 pb-24 bg-gray-50 min-h-screen">
      <Link href="/news" className="text-primary text-sm">← 소식 목록으로</Link>

      <div className="w-full h-48 rounded-xl bg-gray-200 mt-4 overflow-hidden">
        {item.img ? (
          <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <h1 className="text-2xl font-bold mt-4">{item.title}</h1>
      <p className="text-gray-400 text-sm mt-1">{item.date}</p>

      <div className="bg-white p-4 rounded-xl shadow-sm mt-6 whitespace-pre-line">
        <p className="text-gray-700 leading-relaxed">{item.content}</p>
      </div>
    </section>
  );
}
