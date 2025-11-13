"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function EditProfile() {
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);

      const refUser = doc(db, "users", currentUser.uid);
      const snap = await getDoc(refUser);

      if (snap.exists()) {
        const data = snap.data();
        setNickname(data.nickname || "");
        setProfileImg(data.profileImg || null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      let imgURL = profileImg;

      // ✅ 프로필 사진 업로드
      if (file) {
        const imgRef = ref(storage, `profile/${user.uid}.jpg`);
        await uploadBytes(imgRef, file);
        imgURL = await getDownloadURL(imgRef);
      }

      // ✅ Firestore 업데이트
      await updateDoc(doc(db, "users", user.uid), {
        nickname,
        profileImg: imgURL ?? null,
      });

      alert("프로필이 수정되었습니다.");
      window.location.href = "/mypage";
    } catch (e) {
      console.error(e);
      alert("수정 중 오류 발생");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );

  return (
    <section className="p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">프로필 수정</h1>

      <div className="bg-white shadow p-6 rounded-xl space-y-6">
        {/* ✅ 프로필 사진 미리보기 */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
            {profileImg ? (
              <img
                src={profileImg}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200"></div>
            )}
          </div>

          {/* 파일 업로드 */}
          <input
            type="file"
            accept="image/*"
            className="mt-4"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
                setProfileImg(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
        </div>

        {/* 닉네임 입력 */}
        <div>
          <p className="text-sm text-gray-500 mb-1">닉네임</p>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold active:scale-95"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </section>
  );
}
