import { Link, router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useState,useEffect, useContext, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import api from "@/api/axiosInstance";
import { useVerifyTokenUsable } from "@/hooks/useCanUseToken";
import { AuthContext } from "@/utils/providers/StateProvider";
import { getAuth } from "@/api/checktoken";
import { useFocusEffect } from "@react-navigation/native";
import Snackbar from "@/components/ui/snackbar"; 
import { styles } from "@/components/styles/mypagestyle";
import { SnackbarAction } from "@/types/snackbar";



export default function MypageScreen() {
const {isLoggedIn, setIsLoggedIn, loading,setLoading} = useContext(AuthContext)
const [accessToken, setAccessToken] = useState<string | null>(null);
const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;

  const [snackbarVisible, setSnackbarVisible] = useState(false); // 스낵바에 필요
  const [snackbarMessage, setSnackbarMessage] = useState(""); // 스낵바에 필요
  const [snackbarAction, setSnackbarAction] = useState<SnackbarAction | undefined>(undefined);

    const showPlainSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarAction(undefined);     // 버튼 없음!
    setSnackbarVisible(true);
  
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 2000);
  };
  
  const showLoginSnackbar = (message = "") => {
    setSnackbarMessage(message);
    setSnackbarAction({
      label: "로그인",
      onPress: () => router.push("/login"),
    });
    setSnackbarVisible(true);
  
    setTimeout(() => {
      setSnackbarVisible(false);
      setSnackbarAction(undefined); // 닫힐 때 액션도 초기화
    }, 2000);
  };

// 화면 포커스할때마다 실행
useFocusEffect(
  useCallback(() => { // resetLogin 재사용만 하면 OK 되니 함수 객체를 계속 생성하지 않아도 됨
    let isActive = true;

    const resetLogin = async () => {
      try {
        setLoading(true);
        const res = await getAuth();

        if (!isActive) return;

        if (res.code === "TOKEN_VALID") {
          setIsLoggedIn(true);
        } else {
          Alert.alert("입력 시간이 초과되어 자동으로 로그아웃됩니다. 다시 로그인 해주세요.")
          setIsLoggedIn(false);
        }
      } catch (e) {
        if (!isActive) return;
        setIsLoggedIn(false);
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    };

    resetLogin(); // 화면에 포커스가 들어오는 순간 실행함

    return () => {                    //클린업 함수 사용 이유 : 포커스를 mypage가 아닌 다른 페이지로 옮기게 되면 이미 실행하던 작업을 취소하기 위함. 2025.11.14
      isActive = false;
    };
  }, [setIsLoggedIn, setLoading])
);


  const moveProfile = async () => {
  try {
        if (isLoggedIn !== true) {
          showLoginSnackbar("로그인이 필요한 기능입니다."); 
        return;
  }
      // ✅ 인터셉터(authUrls) 조건 충족 → Access Token 자동 헤더 추가됨
      console.log("경로타나 확인: front")
      const res = await api.get("auth/verify"); // 절대경로 추가해줬기 때문에 이렇게 맨앞 슬래시 제외 2025 - 09 - 30
      
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
    // ✅ api 인스턴스를 사용 → Access Token 자동 헤더 포함
    const res = await api.post("auth/logout");

    if (res.data.success) {
      // ✅ 서버 로그아웃 성공 → Access Token 삭제
      await SecureStore.deleteItemAsync("accessToken");
      setIsLoggedIn(false); // 화면 상태만 초기화


      showPlainSnackbar("로그아웃 완료!");
    }
  } catch (err: any) {
    if (err.response) {
      const { code, message } = err.response.data;
      console.log("로그아웃 실패 코드:", code);

      switch (code) {
        case "REFRESH_TOKEN_NOT_FOUND":
          await SecureStore.deleteItemAsync("accessToken");
          setIsLoggedIn(false);
          Alert.alert("세션 만료", "이미 로그아웃된 상태입니다.");
          break;

        case "INVALID_TOKEN":
          await SecureStore.deleteItemAsync("accessToken");
          setIsLoggedIn(false);
          Alert.alert("🚨", "토큰이 유효하지 않습니다. 다시 로그인해주세요.");
          break;

        default:
          Alert.alert("❌", message || "알 수 없는 오류 발생");
      }
    } else {
      await SecureStore.deleteItemAsync("accessToken");
      setIsLoggedIn(false);
      console.error("네트워크 오류:", err);
      Alert.alert("❌", "네트워크 오류 또는 서버 에러 발생");
    }
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
      
      <TouchableOpacity onPress={moveProfile}>
      <ThemedText type="title">프로필 페이지로 이동</ThemedText>
    </TouchableOpacity>
      

      {/* <ThemedText>내 Access Token: {accessToken ?"있음" : "없음"}</ThemedText> */}
      
      {/* ✅ 로그아웃 버튼 */}
      {isLoggedIn ? (
                            // 로그인 상태일 때 로그아웃 버튼을 보여줍니다.
                                  <TouchableOpacity style={styles.logoutbutton} onPress={handleLogout}>
                                    <ThemedText style={styles.buttonText}>로그아웃</ThemedText>
                                  </TouchableOpacity>
      
                        ) : (
                                  <TouchableOpacity style={styles.loginbutton} onPress={moveLoginPage}>
                                    <ThemedText style={styles.buttonText}>로그인</ThemedText>
                                  </TouchableOpacity>
                        )}
                  <Snackbar
                    visible={snackbarVisible}
                    message={snackbarMessage}
                    bottom={60}
                    action={
                      snackbarMessage === "로그인이 필요한 기능입니다."
                        ? {
                            label: "로그인",
                            onPress: () => router.push("/login"),
                          }
                        : undefined
                    }
                  />
    </View>
  
    
  );
}
