import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import  app  from "./config";

// 🔥 Firebase Auth 객체 생성
export const auth = getAuth(app);

// -----------------------------------------
// 🚀 인증 기능 함수들
// -----------------------------------------

// 회원가입
export async function signUp(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// 로그인
export async function logIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// 로그아웃
export async function logOut() {
  return await signOut(auth);
}
