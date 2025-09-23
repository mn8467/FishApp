import { Link } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { View, StyleSheet } from "react-native";

export default function MypageScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">
        <Link href="/signup">회원가입 이동</Link>
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