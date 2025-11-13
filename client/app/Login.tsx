import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
// import { useQueryClient } from "@tanstack/react-query"; // ✅ 추가

// ✅ 서버 응답 타입 (userData 포함)
type UserDTO = {
  userId: string;
  nickname: string;
  userRole: string;
  email: string;
  userStatus: string;
};

export default function Login() {
  const router = useRouter();
  const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;
  // const qc = useQueryClient(); // ✅ React Query 캐시 핸들

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ SecureStore 저장 함수
  const saveToSecureStore = async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error(`${key} 저장 실패:`, err);
    }
  };

  const handleSubmit = async () => {
    if (!form.userName || !form.password) {
      Alert.alert("⚠️", "아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `http://${CURRENT_HOST}:8080/api/auth/login`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        const accessToken = res.data.accessToken;
        // const userData = res.data.userData;
        // console.log("유저데이터 가져오는지 확인",userData)
        
        await saveToSecureStore("accessToken", accessToken);
        // qc.setQueryData<UserDTO>(["me"], userData);

        // const cached = qc.getQueryData<UserDTO>(["me"]);
        // console.log("ME cached now >>>", cached);

        Alert.alert("로그인 성공!", undefined, [
          {
            text: "확인",
            onPress: () => router.push("/mypage"),
          },
        ]);
      } else {
        Alert.alert("❌", "로그인 실패. 아이디/비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 에러:", JSON.stringify(error, null, 2));
      console.error("로그인 에러:", error);
      Alert.alert("🚨", "서버 오류 또는 네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        placeholderTextColor="red"
        value={form.userName}
        onChangeText={(text) => handleChange("userName", text)}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "로그인 중..." : "로그인"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
