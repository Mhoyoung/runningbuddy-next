"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { updateUserProfile } from "@/firebase/auth";
import { FaArrowLeft, FaCamera, FaUserCircle } from "react-icons/fa";
import Skeleton from "@/components/Skeleton";

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
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

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setNickname(data.nickname || "");
        setPreview(data.profileImage || null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (!nickname.trim()) return alert("닉네임을 입력해주세요.");
    
    setSaving(true);
    try {
      await updateUserProfile(user, nickname, file);
      alert("프로필이 수정되었습니다! ");
      router.push("/mypage");
    } catch (e: any) {
      console.error(e);
      //  중복 에러 처리
      if (e.message === "NICKNAME_EXISTS") {
        alert("이미 사용 중인 닉네임입니다. 다른 이름을 입력해주세요! ");
      } else {
        alert("수정 중 오류가 발생했습니다.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Skeleton className="w-full h-40"/></div>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-xl p-2 hover:bg-gray-100 rounded-full transition">
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold">프로필 수정</h2>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* 이미지 업로드 */}
        <label className="relative cursor-pointer group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-100 shadow-sm flex items-center justify-center">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              // 기본 이미지가 없을 때 보여줄 아이콘
              <FaUserCircle className="text-gray-300 w-full h-full" />
            )}
          </div>
          
          {/* 카메라 아이콘 오버레이 */}
          <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-[1px]">
            <FaCamera className="text-white text-2xl" />
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>

        {/* 닉네임 입력 */}
        <div className="w-full">
          <label className="block font-bold mb-2 text-gray-700">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-4 border rounded-xl outline-none focus:border-black transition bg-gray-50"
            placeholder="닉네임을 입력하세요"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-md active:scale-95 transition disabled:bg-gray-400 mt-4"
        >
          {saving ? "저장 중..." : "저장 완료"}
        </button>
      </div>
    </div>
  );
}