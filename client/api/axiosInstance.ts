import axios from "axios";
import * as SecureStore from "expo-secure-store";

const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;

const api = axios.create({
  baseURL: `http://${CURRENT_HOST}:8080/api`,
  timeout: 5000,
});

// ✅ 요청 인터셉터 → Access Token만 붙임
const authUrls = ["/auth/verify"]; // 검증에만 토큰 붙임
api.interceptors.request.use(async (config) => {
  
  const url = config.url ?? ""; // undefined면 빈 문자열
  if (authUrls.some((authUrl) => url.includes(authUrl))) {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    console.log("토큰 찍히나 확인",accessToken)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});


// ✅ 응답 인터셉터 → 401일 때만 userId + refreshToken 같이 전송
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const userId = await SecureStore.getItemAsync("userId");

        if (!refreshToken || !userId) {
          throw new Error("저장된 Refresh Token 또는 userId 없음");
        }

        // Refresh API 호출 → userId는 이때만 헤더에 붙여 보냄
        const refreshRes = await axios.post(
          `http://${process.env.EXPO_PUBLIC_CURRENT_HOST}:8080/api/auth/refresh`,
          { refreshToken }, // body에는 refreshToken
          { headers: { "X-User-Id": userId } } // 헤더에 userId
        );

        if (refreshRes.data.success) {
          const newAccessToken = refreshRes.data.accessToken;

          // 새 Access Token 저장
          await SecureStore.setItemAsync("accessToken", newAccessToken);

          // 원래 요청 다시 실행 (새 토큰으로 교체)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        console.error("토큰 재발급 실패:", refreshErr);
        // ❌ 재발급 실패 → 로그인 페이지 이동 시키는 로직 넣어도 됨
      }
    }

    return Promise.reject(err);
  }
);

export default api;
