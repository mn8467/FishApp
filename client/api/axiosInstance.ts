import axios from "axios";
import * as SecureStore from "expo-secure-store";

const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;

const api = axios.create({
  baseURL: `http://${CURRENT_HOST}:8080/api`,
  timeout: 5000,
});

// ✅ 요청 인터셉터 → Access Token만 붙임
api.interceptors.request.use(async (config) => {
  const url = config.url ?? "";
  console.log("인터셉터 URL:", url);

  const accessToken = await SecureStore.getItemAsync("accessToken");
  console.log("SecureStore에서 읽은 토큰:", accessToken);

  if (accessToken) {
    (config.headers as any).authorization = `Bearer ${accessToken}`;
  }

  console.log("최종 요청 헤더:", config.headers);  // ✅ 여기에 찍으면 됨

  return config;
});


// ✅ 응답 인터셉터 → 401일 때만 refreshToken 같이 전송
api.interceptors.response.use(
  async (res) => {
    const newAccessToken = res.headers["x-new-access-token"];
    if (newAccessToken) {
      await SecureStore.setItemAsync("accessToken", newAccessToken);
      console.log("🔄 새 Access Token 저장됨:", newAccessToken);
    }
      console.log("서버 응답 메시지:", res.data);
    return res;
  },
  (err) => Promise.reject(err)
);

export default api;
