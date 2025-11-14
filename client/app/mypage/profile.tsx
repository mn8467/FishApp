import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "@/components/styles/profilestyle";

export default function ProfileScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필 페이지</Text>
      <Text style={styles.subtitle}>여기에 사용자 정보를 표시할 수 있어요.</Text>

      <Button
        title="마이페이지로 돌아가기"
        onPress={() => router.push("/mypage")}
      />
    </View>
  );
}
