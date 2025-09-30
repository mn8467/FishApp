import { Link, router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { getUserId } from "@/utils/secureStore";
import { useState,useEffect } from "react";
import * as SecureStore from "expo-secure-store"; 
import axios from "axios";
import api from "@/api/axiosInstance"; // ✅ 인터셉터 적용된 axios 인스턴스


export default function MypageScreen() {

  const [userId, setUserId] = useState<string | null>(null);
  const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;
  

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getUserId("userId");
      setUserId(token);
    };

    fetchToken();
  }, []);

  const moveProfile = async () => {
  try {
      // ✅ 인터셉터(authUrls) 조건 충족 → Access Token 자동 헤더 추가됨
      
      const res = await api.get(`${CURRENT_HOST}:8080/api/auth/verify`);
      console.log("경로타나 확인: front",res)
      if (res.data.success) {
        // 👉 프로필 정보가 잘 불려왔다면 화면 이동
        router.push("/mypage/profile");
      } else {
        Alert.alert("🚨", "프로필 정보를 불러오지 못했습니다.");
      }
    } catch (err: any) {
      console.error("프로필 요청 실패:", err);
      Alert.alert("❌", "세션이 만료되었거나 권한이 없습니다.");
    } finally {
      console.log("프로필 요청 완료");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `http://${CURRENT_HOST}:8080/api/auth/logout`,
        { userId },
        { withCredentials: true }
      );
      
      
      if (res.data.success) {
        // ✅ 서버 로그아웃 성공
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("userId");
        setUserId(null);
      
        Alert.alert("로그아웃 완료!", undefined, [{ text: "확인" }]);
      }
    } catch (err: any) {
  if (err.response) {
    const { code, message } = err.response.data;

    console.log("코드 잘 가져오나?",code)
    switch (code) {
      case "REFRESH_TOKEN_NOT_FOUND":
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("userId");
        setUserId(null);
        Alert.alert("세션 만료", "이미 로그아웃된 상태입니다.");
        break;

      case "USER_ID_REQUIRED":
        Alert.alert("🚨", "userId가 필요합니다.");
        break;
        
      default:
        Alert.alert("❌", message || "알 수 없는 오류 발생");
    }
  } else {
    console.error("네트워크 오류:", err);
    Alert.alert("❌", "네트워크 오류 또는 서버 에러 발생");
      }
    }
  }


  const moveLoginPage = async() => {
    router.push("/login")
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title">
        <Link href="/signup">회원가입 이동</Link>
      </ThemedText>
      
      <TouchableOpacity onPress={moveProfile}>
      <ThemedText type="title">프로필 페이지로 이동</ThemedText>
    </TouchableOpacity>
      

      <ThemedText>내 Access Token: {userId ?? "없음"}</ThemedText>
      
      {/* ✅ 로그아웃 버튼 */}
      {userId ? (
                            // 로그인 상태일 때 로그아웃 버튼을 보여줍니다.
                                  <TouchableOpacity style={styles.logoutbutton} onPress={handleLogout}>
                                    <ThemedText style={styles.buttonText}>로그아웃</ThemedText>
                                  </TouchableOpacity>
      
                        ) : (
                                  <TouchableOpacity style={styles.loginbutton} onPress={moveLoginPage}>
                                    <ThemedText style={styles.buttonText}>로그인</ThemedText>
                                  </TouchableOpacity>
                        )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // 전체 화면 차지
    justifyContent: "center", // 세로 중앙 정렬
    alignItems: "center",     // 가로 중앙 정렬
  },
   loginbutton: {
    marginTop: 20,
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 8,
  },
   logoutbutton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});