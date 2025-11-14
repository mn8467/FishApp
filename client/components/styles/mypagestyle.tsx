import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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