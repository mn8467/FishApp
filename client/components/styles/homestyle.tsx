import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#fff" },

  // ⬇️ 고정 상단 영역 (검색/칩/섹션)
  topArea: {
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
  },

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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginRight: 4 },

  cell: { alignItems: "center" },
  circle: { backgroundColor: "#F5F5F7", overflow: "hidden", alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  caption: { marginTop: 6, fontSize: 12, color: "#111" },
});