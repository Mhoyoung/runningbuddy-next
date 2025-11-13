import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// ✅ 회원가입
export async function signUp(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// ✅ 로그인
export async function logIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// ✅ 로그아웃
export async function logOut() {
  return await signOut(auth);
}
