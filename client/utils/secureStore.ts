// utils/secureStore.ts
import * as SecureStore from "expo-secure-store";

//토큰 저장
export async function saveToken(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (err) {
    console.error(`${key} 저장 실패:`, err);
  }
}

//토큰 불러오기
export async function getToken(key: string) {
  try {
    const userId = await SecureStore.getItemAsync("userId");

    return userId;
  } catch (err) {
    console.error(`${key} 불러오기 실패:`, err);
    return null;
  }
}

//토큰 삭제
export async function deleteToken(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (err) {
    console.error(`${key} 삭제 실패:`, err);
  }
}
