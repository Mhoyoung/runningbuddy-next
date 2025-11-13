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
    if (form.password.length < 6)
      return alert("비밀번호는 6자 이상이어야 합니다.");
    if (form.password !== form.passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다!");

    try {
      setLoading(true);

      // ✅ Firebase Auth 회원가입
      const userCredential = await signUp(form.email, form.password);
      const user = userCredential.user;

      // ✅ Firestore users 컬렉션에 저장
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nickname: form.nickname,
        email: form.email,
        createdAt: new Date(),
      });

      // ✅ 성공 모달 표시
      setSuccessModal(true);

    } catch (err: any) {
      console.error(err);
      alert("회원가입 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 pb-24 min-h-screen bg-gray-50 flex flex-col justify-center">

      <h1 className="text-3xl font-extrabold text-center mb-10">회원가입</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-5">

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-semibold mb-1">닉네임</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={onChange}
            placeholder="러닝 닉네임"
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
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
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
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
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
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
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        {/* ✅ 가입하기 버튼 */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-lg text-lg font-bold active:scale-95 shadow-sm"
        >
          {loading ? "가입 처리 중..." : "가입하기"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        이미 회원이신가요?{" "}
        <Link href="/login" className="text-primary font-semibold">
          로그인
        </Link>
      </p>

      {/* ✅ 가입 성공 모달 */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-72 p-6 rounded-xl text-center shadow-lg">
            <p className="text-xl font-bold mb-3">가입 완료!</p>
            <p className="text-gray-600 mb-5">이제 로그인할 수 있어요.</p>
            <button
              className="w-full py-2 bg-primary text-white rounded-lg font-semibold"
              onClick={() => (window.location.href = "/login")}
            >
              확인
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
