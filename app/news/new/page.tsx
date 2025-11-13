// app/news/new/page.tsx
"use client";

import { useState } from "react";
import { addNews } from "@/firebase/news";
import { useRouter } from "next/navigation";

export default function NewsWritePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    date: "",
    img: "",
    category: "event" as "notice" | "race" | "event" | "etc",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    if (!form.title || !form.content) return alert("제목과 내용을 입력하세요.");
    try {
      setLoading(true);
      await addNews({
        title: form.title,
        content: form.content,
        date: form.date || new Date().toISOString().slice(0, 10),
        img: form.img || null,
        category: form.category,
      });
      router.push("/news");
    } catch (e: any) {
      alert("등록 실패: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 pb-24 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold mb-6">소식 작성</h2>

      <div className="bg-white p-4 rounded-xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">제목</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-black"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">날짜</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-black"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">카테고리</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-black"
            >
              <option value="notice">공지</option>
              <option value="race">대회</option>
              <option value="event">이벤트</option>
              <option value="etc">기타</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">대표 이미지 URL (선택)</label>
          <input
            name="img"
            value={form.img}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-black"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2 text-sm h-36 resize-none bg-white text-black"
            placeholder="내용을 입력하세요"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="fixed bottom-6 left-1/2 -translate-x-1/2
                   bg-white text-black border border-gray-300 w-[90%] py-4
                   rounded-xl shadow-md font-semibold active:scale-95 transition"
      >
        {loading ? "처리 중..." : "등록하기"}
      </button>
    </section>
  );
}
