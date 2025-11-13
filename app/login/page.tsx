"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logIn } from "../../firebase/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      await logIn(email, password);
      alert("로그인 성공!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("로그인 실패! 이메일 또는 비밀번호를 확인해주세요.");
    }

    setLoading(false);
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">로그인</h2>

      {/* 이메일 */}
      <label className="block mb-4">
        <p className="font-semibold mb-1">이메일</p>
        <input
          type="email"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />
      </label>

      {/* 비밀번호 */}
      <label className="block mb-6">
        <p className="font-semibold mb-1">비밀번호</p>
        <input
          type="password"
          className="w-full p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
      </label>

      {/* ✅ 로그인 버튼 (흰 배경 + 검정 글씨로 통일) */}
      <button
        className="
          w-full 
          bg-white 
          text-black 
          !text-black 
          py-3 
          rounded-lg 
          font-bold 
          shadow-md 
          active:scale-95 
          transition
        "
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "로그인 중..." : "로그인 하기"}
      </button>

      {/* 회원가입 이동 */}
      <div className="text-center mt-6">
        <p className="text-gray-600">계정이 없으신가요?</p>
        <button
          onClick={() => router.push("/signup")}
          className="mt-2 underline text-black !text-black font-semibold"
        >
          회원가입 하러가기 →
        </button>
      </div>
    </section>
  );
}
