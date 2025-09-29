import { Link } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { View, StyleSheet } from "react-native";
import { getToken } from "@/utils/secureStore";
import { useState,useEffect } from "react";
export default function MypageScreen() {

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken("accessToken");
      setAccessToken(token);
    };

    fetchToken();
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="title">
        <Link href="/signup">회원가입 이동</Link>
      </ThemedText>
      
      <ThemedText>내 Access Token: {accessToken ?? "없음"}</ThemedText>
      
      <ThemedText type="title">
        <Link href="/Login">로그인 페이지 이동</Link>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // 전체 화면 차지
    justifyContent: "center", // 세로 중앙 정렬
    alignItems: "center",     // 가로 중앙 정렬
  },
});