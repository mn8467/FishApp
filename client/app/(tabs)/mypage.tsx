import { Link } from "expo-router";
import { ThemedText } from "@/components/themed-text";

export default function MypageScreen() {
  return (
    <ThemedText type="title">
      <Link href="/signup">회원가입 이동</Link>
    </ThemedText>
  );
}