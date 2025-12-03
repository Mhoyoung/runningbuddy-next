// firebase/auth.ts
import { auth } from "./config"; // ✅ config에서 미리 만들어둔 auth 가져오기
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// 회원가입
export function signUp(email: string, password: string) {
  // await는 호출하는 쪽에서 처리하도록 Promise 자체를 반환
  return createUserWithEmailAndPassword(auth, email, password);
}

// 로그인
export function logIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// 로그아웃
export function logOut() {
  return signOut(auth);
}