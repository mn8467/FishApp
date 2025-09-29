import { Link, router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { getUserId } from "@/utils/secureStore";
import { useState,useEffect } from "react";
import * as SecureStore from "expo-secure-store"; 
import axios from "axios";

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

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `http://${CURRENT_HOST}:8080/api/auth/logout`,
        { userId }
        ,
        { withCredentials: true }
      );

      if (res.data.success) {
        // 서버 로그아웃 성공 후 토큰 삭제
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("userId");
        setUserId(null);

        Alert.alert("로그아웃 완료!", undefined, [{ text: "확인" }]);
      } else {
        Alert.alert("❌", "서버 로그아웃 실패");
      }
    } catch (err) {
      console.error("로그아웃 실패:", err);
      Alert.alert("🚨", "로그아웃 중 오류가 발생했습니다.");
    }
  };
  const moveLoginPage = async() => {
    router.push("/login")
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title">
        <Link href="/signup">회원가입 이동</Link>
      </ThemedText>
      
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