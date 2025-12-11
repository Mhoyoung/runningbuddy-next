"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logIn } from "@/firebase/auth";
import { auth } from "@/firebase/config"; // signOut을 위해 필요
import { signOut } from "firebase/auth"; // signOut 함수 import
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 동작 방지

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 1. Firebase 로그인 시도
      const credential = await logIn(email.trim(), password);
      const user = credential.user;

      // 🔥 2. [보안 강화] 이메일 인증 여부 검사
      if (!user.emailVerified) {
        // 인증 안 된 사용자면 바로 로그아웃 처리
        await signOut(auth);
        
        alert(
          "⛔ 이메일 인증이 완료되지 않았습니다!\n\n" +
          "가입하신 이메일의 편지함을 확인하고\n" +
          "인증 링크를 클릭해주세요. 📧"
        );
        
        setLoading(false); // 로딩 끄기
        return; // 🚨 여기서 함수 종료 (메인 페이지 이동 막음)
      }

      // 3. 인증된 사용자만 통과
      alert(`환영합니다! ${user.displayName || "러너"}님 🏃‍♂️`);
      router.push("/"); 

    } catch (error: any) {
      console.error(error);
      setLoading(false); // 실패 시 로딩 끄기
      
      // 에러 메시지 사용자 친화적으로 변환
      if (
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password'
      ) {
        alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else if (error.code === 'auth/invalid-email') {
        alert("이메일 형식이 올바르지 않습니다.");
      } else if (error.code === 'auth/too-many-requests') {
        alert("로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("로그인 실패: " + error.message);
      }
    }
  };

  return (
    <section className="p-6 min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-center">로그인</h2>

        {/* 폼 태그로 감싸서 엔터 키 입력 시 자동 제출 지원 */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* 이메일 */}
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">이메일</label>
            <input
              type="email"
              className="w-full p-3 border rounded-xl outline-none focus:border-black transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">비밀번호</label>
            <input
              type="password"
              className="w-full p-3 border rounded-xl outline-none focus:border-black transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-md active:scale-95 transition disabled:bg-gray-400 mt-4"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 회원가입 이동 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-black font-bold underline ml-1">
            회원가입
          </Link>
        </div>
      </div>
    </section>
  );
}