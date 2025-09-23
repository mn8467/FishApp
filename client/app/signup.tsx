import React, { useState } from "react";
import {TouchableOpacity, View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    userName: "", // ID
    nickname: "", // 닉네임
    email: "", // 이메일 인증
    password: "", // 비밀번호
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/users", form);
    if (res.status === 200 || res.status === 201) {
      setForm({ userName: "", nickname: "", password: "", email: "" });
      Alert.alert(
        "회원가입 성공",
        undefined,
        [
          {
            text: "확인",
            onPress: () => router.push("/mypage"), // ✅ 확인 버튼 누르면 이동
          },
        ]
      );
    }else {
        Alert.alert("회원가입 실패", res.data?.message || "알 수 없는 오류");
      }
    } catch (error: any) {
      Alert.alert("회원가입 실패", error.response?.data?.message || "서버 연결 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>회원가입</Text>

        <TextInput
          placeholder="아이디"
          value={form.userName}
          onChangeText={(value) => handleChange("userName", value)}
          style={[styles.input, { color: "black", backgroundColor: "white" }]}
        />

        <TextInput
          placeholder="닉네임"
          value={form.nickname}
          onChangeText={(value) => handleChange("nickname", value)}
          style={[styles.input, { color: "black", backgroundColor: "white" }]}
        />

        <TextInput
          placeholder="이메일"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
          style={[styles.input, { color: "black", backgroundColor: "white" }]}
        />

        <TextInput
          placeholder="비밀번호"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => handleChange("password", value)}
          style={[styles.input, { color: "black", backgroundColor: "white" }]}
        />

      <Button title={loading ? "가입 중..." : "회원가입"} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});