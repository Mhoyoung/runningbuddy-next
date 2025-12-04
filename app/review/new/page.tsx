"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config"; 
import { addReview } from "@/firebase/review";
import { onAuthStateChanged } from "firebase/auth";
import { FaArrowLeft, FaImage } from "react-icons/fa";

export default function ReviewNewPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. 로그인 체크
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        alert("로그인이 필요한 서비스입니다.");
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, [router]);

  // 이미지 선택 시 미리보기 생성
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  // 저장 핸들러
  const handleSubmit = async () => {
    if (!text || !file) {
      alert("사진과 내용을 모두 입력해주세요!");
      return;
    }
    
    setLoading(true);
    try {
      await addReview(user.uid, text, file);
      
      alert("리뷰가 등록되었습니다! 📸");
      router.push("/review");
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white min-h-screen pb-24">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-xl p-2 hover:bg-gray-100 rounded-full transition">
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold">리뷰 작성 ✏️</h2>
      </div>

      <div className="space-y-6">
        {/* 이미지 업로드 영역 */}
        <div>
          <label 
            htmlFor="file-upload" 
            className="w-full aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:bg-gray-100 transition overflow-hidden relative"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <FaImage className="text-4xl text-gray-400 mb-2" />
                <span className="text-gray-500 text-sm font-medium">사진을 선택해주세요</span>
              </>
            )}
          </label>
          <input 
            id="file-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </div>

        {/* 텍스트 입력 */}
        <div>
          <label className="block font-bold mb-2 text-gray-700">내용</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border rounded-xl h-32 resize-none outline-none focus:border-black transition bg-gray-50"
            placeholder="오늘의 러닝은 어땠나요? (장소, 거리, 느낌 등)"
          />
        </div>

        {/* 등록 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-md active:scale-95 transition disabled:bg-gray-400"
        >
          {loading ? "업로드 중..." : "등록하기"}
        </button>
      </div>
    </div>
  );
}