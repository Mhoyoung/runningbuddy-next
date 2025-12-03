"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/Skeleton";

export default function EditProfile() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const refUser = doc(db, "users", currentUser.uid);
      const snap = await getDoc(refUser);

      if (snap.exists()) {
        const data = snap.data();
        setNickname(data.nickname || "");
        setProfileImage(data.profileImage || null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      let imgURL = profileImage;

      // 🔥 프로필 이미지 업데이트
      if (file) {
        const imgRef = ref(storage, `profile/${user.uid}.jpg`);
        await uploadBytes(imgRef, file);
        imgURL = await getDownloadURL(imgRef);
      }

      // 🔥 Firestore 업데이트 (필드명 통일)
      await updateDoc(doc(db, "users", user.uid), {
        nickname,
        profileImage: imgURL ?? null,
      });

      alert("프로필이 업데이트되었습니다!");
      router.push("/mypage/profile");
    } catch (e) {
      console.error(e);
      alert("수정 중 오류 발생");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 max-w-lg mx-auto">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-40 h-5 mt-4" />
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">프로필 수정</h2>

      {/* 프로필 이미지 입력 */}
      <label className="flex justify-center cursor-pointer">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-md">
          {profileImage ? (
            <img src={profileImage} className="object-cover w-full h-full" />
          ) : (
            <p className="text-center text-gray-400 text-sm pt-14">이미지</p>
          )}
        </div>

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
              setProfileImage(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
      </label>

      {/* 닉네임 입력 */}
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="w-full border p-3 rounded-md"
      />

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-black text-white py-3 rounded-md text-lg disabled:opacity-50"
      >
        {saving ? "저장 중..." : "저장하기"}
      </button>
    </div>
  );
}
