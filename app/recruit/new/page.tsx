"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addRecruit } from "../../../firebase/recruit";
import { auth } from "../../../firebase/config";

export default function RecruitNewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 로그인 안된 사용자 접근 방지
  useEffect(() => {
    if (!auth.currentUser) router.push("/login");
  }, []);

  const handleSave = async () => {
    if (!title || !content || !time || !location) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      await addRecruit({
        uid: user.uid,
        title,
        content,
        time,
        location,
      });

      alert("모집 글이 등록되었습니다!");
      router.push("/recruit");
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }

    setLoading(false);
  };

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-6">모집 글 작성</h2>

      <label className="block mb-4">
        <p className="font-semibold">제목</p>
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="예: 오늘 저녁 반포대교 같이 뛰어요!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="block mb-4">
        <p className="font-semibold">설명</p>
        <textarea
          className="w-full p-3 border rounded-lg h-32"
          placeholder="어떤 모임인지 설명해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>

      <label className="block mb-4">
        <p className="font-semibold">시간</p>
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="예: 오늘 19:00"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>

      <label className="block mb-4">
        <p className="font-semibold">장소</p>
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="예: 반포대교"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        className="
          w-full bg-white text-black !text-black
          py-3 rounded-lg font-bold shadow-md 
          active:scale-95 transition
        "
      >
        {loading ? "등록 중..." : "등록하기"}
      </button>
    </section>
  );
}
