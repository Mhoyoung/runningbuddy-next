"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addRecruit } from "../../../firebase/recruit";
import { auth } from "../../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function RecruitNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 폼 상태 관리
  const [form, setForm] = useState({
    title: "",
    content: "",
    dateTime: "",
    location: "",
    maxPeople: 4,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        alert("로그인이 필요합니다.");
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, [router]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.title || !form.content || !form.dateTime || !form.location) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    setLoading(true);

    try {
      const dateObj = new Date(form.dateTime);
      const dateStr = dateObj.toLocaleDateString("ko-KR"); 
      const timeStr = dateObj.toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit', hour12: false });

      await addRecruit({
        uid: user.uid,
        title: form.title,
        content: form.content,
        date: dateStr,
        time: timeStr,
        location: form.location,
        maxPeople: Number(form.maxPeople),
      });

      alert("모집 글이 등록되었습니다!");
      router.push("/recruit");
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <section className="p-6 max-w-lg mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">모집 글 작성</h2>
        <button onClick={() => router.back()} className="text-sm text-gray-500">취소</button>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="font-semibold text-gray-700">제목</span>
          <input
            name="title"
            className="w-full p-3 border rounded-xl mt-1 outline-none focus:border-black transition"
            placeholder="예: 오늘 저녁 반포대교 런!"
            value={form.title}
            onChange={handleChange}
          />
        </label>

        {/* 일시 & 인원 */}
        <div className="flex gap-3">
          <label className="block flex-1">
            <span className="font-semibold text-gray-700">일시</span>
            <input
              type="datetime-local"
              name="dateTime"
              className="w-full p-3 border rounded-xl mt-1 bg-white"
              value={form.dateTime}
              onChange={handleChange}
            />
          </label>
          
          <label className="block w-24">
            <span className="font-semibold text-gray-700">인원</span>
            <select
              name="maxPeople"
              className="w-full p-3 border rounded-xl mt-1 bg-white"
              value={form.maxPeople}
              onChange={handleChange}
            >
              {[2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n}명</option>)}
            </select>
          </label>
        </div>

        {/* 장소  */}
        <label className="block">
          <span className="font-semibold text-gray-700">장소</span>
          <input
            name="location"
            className="w-full p-3 border rounded-xl mt-1 outline-none focus:border-black transition"
            placeholder="예: 반포 한강공원 편의점 앞"
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label className="block">
          <span className="font-semibold text-gray-700">내용</span>
          <textarea
            name="content"
            className="w-full p-3 border rounded-xl mt-1 h-32 resize-none outline-none focus:border-black transition"
            placeholder="코스, 페이스 등 자세한 내용을 적어주세요."
            value={form.content}
            onChange={handleChange}
          />
        </label>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-md active:scale-95 transition disabled:bg-gray-400 mt-4"
        >
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </section>
  );
}