"use client";

import { useState } from "react";
import { storage, db } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "@/firebase/auth";
import { useRouter } from "next/navigation";

export default function NewReviewPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!image || !text) {
      alert("사진과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    // 1️⃣ Storage Upload
    const storageRef = ref(storage, `reviews/${Date.now()}-${image.name}`);
    await uploadBytes(storageRef, image);

    const imageUrl = await getDownloadURL(storageRef);

    // 2️⃣ Firestore Save
    await addDoc(collection(db, "reviews"), {
      image: imageUrl,
      text,
      likes: 0,
      likedBy: [],
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    router.push("/review");
  }

  return (
    <div className="p-5 space-y-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">리뷰 작성</h2>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        className="w-full border p-2 rounded-md"
      />

      {/* Preview */}
      {image && (
        <img
          src={URL.createObjectURL(image)}
          className="w-full h-[250px] object-cover rounded-xl"
        />
      )}

      {/* Text Input */}
      <textarea
        placeholder="내용을 입력하세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-md p-3 h-[120px]"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-md text-lg disabled:opacity-50"
      >
        {loading ? "업로드 중..." : "등록하기"}
      </button>
    </div>
  );
}
