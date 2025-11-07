import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
item: { padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#ddd" },
  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 8 } as const,
  input: {
    flex: 1, minHeight: 40, maxHeight: 120, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10, backgroundColor: "#fff", fontSize: 14,
  } as const,
  sendBtn: {
    height: 40, width: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#4BA3C3",
  } as const,
  commentRow: {
    flexDirection: "row", gap: 10, padding: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12, backgroundColor: "#fafafa",
  } as const,
  avatar: { height: 36, width: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#d7eef5" } as const,
  avatarText: { fontWeight: "700", color: "#2a6f85" } as const,
  headerRow: { flexDirection: "row", alignItems: "baseline", gap: 8 } as const,
  nameText: { fontWeight: "700", fontSize: 13, color: "#333" } as const,
  timeText: { fontSize: 11, color: "#999" } as const,
  bodyText: { marginTop: 4, fontSize: 14, color: "#333", lineHeight: 20 } as const,

  container: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },

    /* ── 댓글 수정/삭제 스타일 영역 ─────────────────────────────────────────── */
    editInput: {
      marginTop: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      fontSize: 14,
      backgroundColor: "#fff",
    },
    editCancelBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: "#eee",
    },
    editCancelText: { color: "#333", fontWeight: "600" },
    editSaveBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: "#4BA3C3",
    },
    editSaveText: { color: "#fff", fontWeight: "700" },

    // 바텀시트
    sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
    sheetContainer: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: 24,
      paddingTop: 8,
      paddingHorizontal: 12,
      position: "absolute",
      left: 0, right: 0, bottom: 0,
      shadowColor: "#000", shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: -2 }, shadowRadius: 8, elevation: 10,
    },
    sheetHandle: {
      alignSelf: "center", width: 40, height: 4,
      borderRadius: 2, backgroundColor: "#ddd", marginBottom: 8,
    },
    sheetItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 14, paddingHorizontal: 6 },
    sheetItemText: { fontSize: 16, color: "#222" },
    sheetCancelText: { fontSize: 16, color: "#555", textAlign: "center", fontWeight: "600" },

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
  marginVertical: 6,
},
statLabel: {
  width: 88,
  fontWeight: "600",
  flexShrink: 0,
},
statBarBackground: {
  flex: 1,
  height: 12,
  backgroundColor: "#eee",
  borderRadius: 6,
  marginHorizontal: 8,
  overflow: "hidden",
},
statBar: {
  height: "100%",
  backgroundColor: "#7db3ff",
  borderRadius: 6,
},
statValue: {
  width: 48,
  minWidth: 44,
  textAlign: "right",
  fontVariant: ["tabular-nums"],
  flexShrink: 0,
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
/* ── 추가된 스타일 ───────────────────────────────────── */
  labelBox: {                // [ADDED] 라벨+? 아이콘을 감싸는 박스
    width: 88,               // statLabel과 동일 값 유지
    position: "relative",
    paddingRight: 18,        // 아이콘 자리 확보
    justifyContent: "center",
  },
  helpIcon: {                // [ADDED] ? 아이콘 절대 위치
    position: "absolute",
    right: 0,
    top: "50%",
    marginTop: -8,           // 아이콘 높이(16)의 절반
  },
  statDesc: {                // [ADDED] hpDesc 등 설명 텍스트
    marginLeft: 88,          // 라벨 폭만큼 들여쓰기
    marginTop: 4,
    marginRight: 8,
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
})