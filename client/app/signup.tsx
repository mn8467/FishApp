import React, { useState, useEffect } from "react";
import {View,Text,TextInput,Button,Alert,StyleSheet} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Signup() {
    const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;
  const router = useRouter();
  const [form, setForm] = useState({
    userName: "",
    nickname: "",
    email: "",
    password: "",
  });

  const [authNumber, setAuthNumber] = useState(""); // 인증번호 상태
  const [loading, setLoading] = useState(false);
  const [isEmailLocked, setIsEmailLocked] = useState(false); // 이메일 입력 잠금
  const [timer, setTimer] = useState(0); // 카운트다운 (초 단위)
  const [isVerified, setIsVerified] = useState(false); // ✅ 인증 완료 여부

  // 타이머 동작
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 이메일 인증 요청
  const handleSendAuth = async () => {
    try {
      const res = await axios.post(`http://${CURRENT_HOST}:8080/api/users/mailAuth`, {
        email: form.email,
      });
      Alert.alert("인증 메일 발송", res.data?.message || "메일을 확인하세요.");
      setIsEmailLocked(true); // 이메일 수정 못하게 잠금
      setTimer(600); // 10분 타이머 시작
    } catch (error: any) {
      Alert.alert("인증 실패", error.response?.data?.message || "서버 오류");
    }
  };

  // 인증번호 확인
  const handleVerifyAuth = async () => {
    try {
      const res = await axios.post(
        `http://${CURRENT_HOST}:8080/api/users/checkAuthNum`,
        {
          email: form.email,
          authNumber,
        }
      );
      Alert.alert("인증 성공", res.data?.message || "인증번호가 확인되었습니다.");
      setIsVerified(true); // ✅ 인증 완료 처리
    } catch (error: any) {
      Alert.alert("인증 실패", error.response?.data?.message || "잘못된 인증번호");
    }
  };

  // 회원가입
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://${CURRENT_HOST}:8080/api/users`, form);
      if (res.status === 200 || res.status === 201) {
        setForm({ userName: "", nickname: "", password: "", email: "" });
        setAuthNumber("");
        setIsEmailLocked(false);
        setIsVerified(false);
        setTimer(0);
        Alert.alert("회원가입 성공", undefined, [
          {
            text: "확인",
            onPress: () => router.push("/mypage"),
          },
        ]);
      } else {
        Alert.alert("회원가입 실패", res.data?.message || "알 수 없는 오류");
      }
    } catch (error: any) {
      Alert.alert(
        "회원가입 실패",
        error.response?.data?.message || "서버 연결 실패"
      );
    } finally {
      setLoading(false);
    }
  };

  // 남은 시간을 "MM:SS" 형태로 변환
  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <Text>회원가입</Text>

      <TextInput
        placeholder="아이디"
        value={form.userName}
        onChangeText={(value) => handleChange("userName", value)}
        style={[styles.input]}
      />

      <TextInput
        placeholder="닉네임"
        value={form.nickname}
        onChangeText={(value) => handleChange("nickname", value)}
        style={[styles.input]}
      />

      {/* 이메일 입력칸 + 인증 버튼/타이머 */}
      <View style={styles.row}>
        <TextInput
          placeholder="이메일"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
          style={[styles.input, { flex: 1 }]}
          editable={!isEmailLocked} // 인증 시작 후 입력 불가
        />
        {timer > 0 ? (
          <Text style={styles.timer}>{formatTime(timer)}</Text>
        ) : (
          <Button title="인증" onPress={handleSendAuth} />
        )}
      </View>

           {/* 인증번호 입력칸 + 확인 버튼 + 인증 완료 메시지 */}
      <View style={styles.row}>
        {!isVerified ? (
          <>
            <TextInput
              placeholder="인증번호 입력"
              value={authNumber}
              onChangeText={(value) => setAuthNumber(value)}
              style={[styles.input, { flex: 1 }]}
            />
            <Button title="확인" onPress={handleVerifyAuth} />
          </>
        ) : (
          <Text style={styles.success}>인증이 완료되었습니다 ✅</Text>
        )}
      </View>

      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
        style={[styles.input]}
      />

      <Button
        title={loading ? "가입 중..." : "회원가입"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    color: "black",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 5,
  },
  timer: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  success: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
});
