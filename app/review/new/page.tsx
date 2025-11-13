"use client";

import { useState, useEffect } from "react";
import { uploadReviewImage, addReview } from "../../../firebase/review";
import { auth } from "../../../firebase/config";
import { useRouter } from "next/navigation";

export default function ReviewNewPage() {
  const router = useRouter();

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 로그인 체크
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, []);

  // ✅ 이미지 선택 시 미리보기
  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!text && !imgFile) {
      alert("내용 또는 사진을 입력해주세요!");
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
      let imgUrl = null;

      // ✅ 이미지 업로드
      if (imgFile) {
        imgUrl = await uploadReviewImage(imgFile);
      }

      // ✅ Firestore 저장
      await addReview({
        uid: user.uid,
        text,
        img: imgUrl,
      });

      alert("리뷰가 등록되었습니다!");
      router.push("/review");
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
    }

    setLoading(false);
  };

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-6">리뷰 작성</h2>

      {/* ✅ 이미지 미리보기 */}
      {preview && (
        <img
          src={preview}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
      )}

      <input type="file" accept="image/*" onChange={handleImage} />

      {/* 글 입력 */}
      <textarea
        className="w-full p-3 border rounded-lg mt-4 h-32"
        placeholder="오늘의 러닝 경험을 공유해주세요!"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="
          w-full bg-white text-black !text-black 
          py-3 rounded-lg mt-6 shadow-md font-bold
          active:scale-95 transition
        "
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "업로드 중..." : "등록하기"}
      </button>
    </section>
  );
}
