"use client";

import { useState } from "react";

export default function ReviewNewPage() {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [text, setText] = useState("");

  const onFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) setImgFile(file);
  };

  return (
    <section className="p-4 space-y-4">
      <h2 className="text-xl font-bold">리뷰 작성</h2>

      {/* 이미지 미리보기 */}
      {imgFile && (
        <img
          src={URL.createObjectURL(imgFile)}
          className="w-full rounded-xl"
          alt="preview"
        />
      )}

      {/* 이미지 업로드 */}
      <label className="block">
        <span className="text-gray-700 font-medium">사진 업로드</span>
        <input type="file" accept="image/*" onChange={onFileChange} className="mt-2" />
      </label>

      {/* 글 작성 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="러닝 리뷰를 입력하세요!"
        className="w-full h-32 border rounded-lg p-3"
      />

      {/* 저장 버튼 */}
      <button
        className="w-full py-3 bg-black text-white rounded-xl text-lg font-bold active:scale-95 transition"
      >
        저장하기
      </button>
    </section>
  );
}
