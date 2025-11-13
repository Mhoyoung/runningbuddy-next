"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addRecord } from "../../../firebase/record";
import { auth } from "../../../firebase/config";

export default function RecordNewPage() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [pace, setPace] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 로그인 검사
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, []);

  const calculatePace = () => {
    if (!time || !distance) return;

    const [min, sec] = time.split(":").map(Number);
    const totalSec = min * 60 + sec;
    const perKm = totalSec / Number(distance);

    const paceMin = Math.floor(perKm / 60);
    const paceSec = Math.floor(perKm % 60);

    setPace(`${paceMin}:${paceSec.toString().padStart(2, "0")}`);
  };

  const handleSave = async () => {
    if (!date || !distance || !time || !pace) {
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
      await addRecord({
        uid: user.uid,
        date,
        distance,
        time,
        pace,
      });

      alert("기록이 저장되었습니다!");
      router.push("/record");
    } catch (error) {
      console.error(error);
      alert("저장 중 오류 발생");
    }

    setLoading(false);
  };

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-6">기록 추가</h2>

      <label className="block mb-4">
        <p className="font-semibold mb-1">날짜</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </label>

      <label className="block mb-4">
        <p className="font-semibold mb-1">거리 (km)</p>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="예: 5"
        />
      </label>

      <label className="block mb-4">
        <p className="font-semibold mb-1">시간 (MM:SS)</p>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          onBlur={calculatePace}
          className="w-full p-3 border rounded-lg"
          placeholder="예: 32:10"
        />
      </label>

      <label className="block mb-6">
        <p className="font-semibold mb-1">페이스</p>
        <input
          type="text"
          value={pace}
          readOnly
          className="w-full p-3 border rounded-lg bg-gray-100"
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
        {loading ? "저장 중..." : "기록 저장하기"}
      </button>
    </section>
  );
}
