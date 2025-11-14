// components/ui/Snackbar.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity,Animated, Easing } from "react-native";
import { snackbarStyle } from "../styles/snackberstyle";
import { router } from "expo-router";

//Props 받을 타입
type Props = {
  visible: boolean;
  message: string;
  bottom?: number;

};


const goLogin = () => {
    router.push("/login");
  };

export default function Snackbar({ visible, message, bottom }: Props) {
     // 0 ~ 1 사이 값으로 애니메이션 제어
  const [anim] = useState(new Animated.Value(0));
  const [shouldRender, setShouldRender] = useState(false);

useEffect(() => {
    if (visible) {
      // 처음에 안 보이던 애도 애니메이션 하면서 나타나게
      setShouldRender(true);

      Animated.timing(anim, {
        toValue: 1,
        duration: 200,           // ⬅️ 여기 시간 늘리면 더 부드러워짐 (예: 300~400)
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      // 사라질 때 애니메이션 → 끝난 뒤에만 언마운트
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
        }
      });
    }
  }, [visible, anim]);

  if (!shouldRender) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0], // 0일 땐 아래쪽(살짝 내려가 있음) → 1일 땐 제자리
  });


  return (
           <Animated.View
      style={[
        snackbarStyle.snackbar,
        {
          bottom,                // 🔹 여기에서 동적으로 bottom 받기
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          style={[snackbarStyle.snackbarText, { flexShrink: 1, marginRight: 8 }]}
          numberOfLines={2}
        >
          {message}
        </Text>

        <TouchableOpacity onPress={goLogin} style={{ marginLeft: "auto" }}>
          <Text style={{ color: "#ff7300ff" }}>로그인</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}