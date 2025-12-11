"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/firebase/auth";
import { db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const onChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.nickname.trim()) return alert("닉네임을 입력하세요.");
    if (!form.email.trim()) return alert("이메일을 입력하세요.");
    if (!form.password.trim()) return alert("비밀번호를 입력하세요.");
    if (form.password.length < 6) return alert("비밀번호는 6자 이상이어야 합니다.");
    if (form.password !== form.passwordConfirm) return alert("비밀번호가 일치하지 않습니다!");

    try {
      setLoading(true);

      // 1. Firebase Auth 회원가입 (auth.ts에서 인증 메일 발송됨)
      const userCredential = await signUp(form.email, form.password);
      const user = userCredential.user;

      // 2. Firestore에 닉네임 저장
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nickname: form.nickname,
        email: form.email,
        profileImage: null, // 초기 프로필 이미지 없음
        createdAt: new Date(),
      });

      // 3. 성공 모달 표시
      setSuccessModal(true);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        alert("이미 사용 중인 이메일입니다.");
      } else if (err.code === 'auth/invalid-email') {
        alert("이메일 형식이 올바르지 않습니다.");
      } else {
        alert("회원가입 실패: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 pb-24 min-h-screen bg-gray-50 flex flex-col justify-center">

      <h1 className="text-3xl font-extrabold text-center mb-10">회원가입</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-5 border border-gray-100">

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-semibold mb-1">닉네임</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={onChange}
            placeholder="러닝 닉네임"
            className="w-full border rounded-lg px-3 py-3 text-sm bg-gray-50 focus:border-black outline-none transition"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-semibold mb-1">이메일</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="example@email.com"
            className="w-full border rounded-lg px-3 py-3 text-sm bg-gray-50 focus:border-black outline-none transition"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm font-semibold mb-1">비밀번호</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="6자리 이상"
            className="w-full border rounded-lg px-3 py-3 text-sm bg-gray-50 focus:border-black outline-none transition"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-semibold mb-1">비밀번호 확인</label>
          <input
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={onChange}
            placeholder="한 번 더 입력"
            className="w-full border rounded-lg px-3 py-3 text-sm bg-gray-50 focus:border-black outline-none transition"
          />
        </div>

        {/* 가입하기 버튼 */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-4 bg-black text-white rounded-xl text-lg font-bold active:scale-95 shadow-md hover:bg-gray-800 transition disabled:bg-gray-400 mt-4"
        >
          {loading ? "가입 처리 중..." : "가입하기"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        이미 회원이신가요?{" "}
        <Link href="/login" className="text-black font-bold underline ml-1">
          로그인
        </Link>
      </p>

      {/* ✅ [수정됨] 인증 안내 모달 */}
      {successModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-8 rounded-2xl text-center shadow-2xl">
            <div className="text-4xl mb-4">📧</div>
            <p className="text-xl font-bold mb-2">인증 메일 발송!</p>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              입력하신 이메일로 인증 링크를 보냈습니다.<br/>
              <span className="text-blue-600 font-bold">메일함에서 링크를 클릭</span>해주세요!
            </p>
            <button
              className="w-full py-3 bg-black text-white rounded-xl font-bold shadow-md hover:bg-gray-800 transition"
              onClick={() => (window.location.href = "/login")}
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      )}

    </section>
  );
}