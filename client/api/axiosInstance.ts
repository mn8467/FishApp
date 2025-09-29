// api/axiosInstance.ts
import axios from "axios";
import { getToken, saveToken } from "@/utils/secureStore";

const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;

const api = axios.create({
  baseURL: `http://${CURRENT_HOST}:8080/api`,
  withCredentials: true,
});

// 요청 인터셉터 → 매 요청마다 Access Token 헤더에 자동 추가
api.interceptors.request.use(async (config) => {
  const accessToken = await getToken("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터 → 401 나오면 Refresh Token으로 Access Token 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access Token 만료 (401) + 재시도 안했을 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getToken("refreshToken");
        if (!refreshToken) throw new Error("Refresh Token 없음");

        // Refresh API 호출
        const res = await axios.post(`http://${CURRENT_HOST}:8080/api/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;

        // 새 Access Token 저장
        await saveToken("accessToken", newAccessToken);

        // 원래 요청 다시 실행
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("토큰 재발급 실패:", err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
