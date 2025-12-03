"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfileDetailPage() {
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setNickname(data.nickname || "");
        setProfileImage(data.profileImage || null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (!user && !loading)
    return <p className="p-6 text-center">로그인이 필요합니다.</p>;

  if (loading)
    return (
      <div className="p-6 space-y-6 max-w-lg mx-auto">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-32 h-4" />
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">프로필</h2>

      <div className="flex items-center gap-4">
        <img
          src={profileImage ?? "/placeholder.png"}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <p className="text-lg font-semibold">{nickname}</p>
      </div>

      <Link
        href="/mypage/profile/edit"
        className="block text-center bg-black text-white py-3 rounded-md mt-4"
      >
        ✏ 수정하기
      </Link>
    </div>
  );
}
