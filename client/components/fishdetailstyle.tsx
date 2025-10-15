import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },

  /* ── 탭 영역 ─────────────────────────────────────────── */
  tabContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    width: "100%",
    marginTop: 10,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,                 // ✅ 각 탭이 정확히 1/2
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    backgroundColor: "#f5f7f3ff",   // 기본 배경(비활성)
  },
  activeTab: {
    backgroundColor: "#7db3ff",   // ✅ 활성 탭 배경색
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#ffffffff",                     //글자 색
    fontWeight: "700",
  },

  /* ── 기존 스타일 ─────────────────────────────────────── */
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
    position: "relative",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  statsContainer: {
    backgroundColor: "#fff", 
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  statLabel: {
    width: 80,
    fontWeight: "600",
  },
  statBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginHorizontal: 8,
  },
  statBar: {
    height: 10,
    backgroundColor: "#7db3ff",
    borderRadius: 5,
  },
  statValue: {
    width: 30,
    textAlign: "right",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
  },
  comment: {
    fontSize: 14,
    color: "#333",
    marginVertical: 4,
  },
});
