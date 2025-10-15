import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#fff" },

  // 검색
  searchBox: {
    marginHorizontal: 16,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F2F3F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },

  // 칩들
  chipsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#DADCE0",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  chipTxt: { fontSize: 13, color: "#111" },

  // 섹션 헤더
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginRight: 4 },

  // 그리드 셀
  cell: { alignItems: "center" },
  circle: {
    backgroundColor: "#F5F5F7",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  caption: { marginTop: 6, fontSize: 12, color: "#111" },

  // 탭바
  tabbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6E6",
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabTxt: { fontSize: 11 },
});