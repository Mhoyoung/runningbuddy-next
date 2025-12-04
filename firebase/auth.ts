import { auth, db } from "./config"; 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 회원가입
export function signUp(email: string, password: string) {
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

// 프로필 업데이트 (중복 검사 + Auth + Firestore + Storage)
export async function updateUserProfile(user: any, nickname: string, file?: File | null) {
  
  // 1. 닉네임 중복 검사
  // users 컬렉션에서 입력한 nickname과 같은 유저가 있는지 찾음
  const q = query(collection(db, "users"), where("nickname", "==", nickname));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existUser = snapshot.docs[0];
    // 찾은 유저가 '나' 자신이 아니라면 중복 에러 발생!
    if (existUser.id !== user.uid) {
      throw new Error("NICKNAME_EXISTS");
    }
  }

  // --- 아래는 기존 로직 ---

  let photoURL = user.photoURL;

  // 2. 이미지가 있다면 업로드
  if (file) {
    const storage = getStorage();
    const storageRef = ref(storage, `profiles/${user.uid}`);
    await uploadBytes(storageRef, file);
    photoURL = await getDownloadURL(storageRef);
  }

  // 3. Auth 프로필 업데이트
  await updateProfile(user, {
    displayName: nickname,
    photoURL: photoURL,
  });

  // 4. Firestore 동기화
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    nickname: nickname,
    profileImage: photoURL,
    email: user.email,
  }, { merge: true });
}