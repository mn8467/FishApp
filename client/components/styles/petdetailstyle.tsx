// components/styles/petdetailstyle.ts
import { StyleSheet } from "react-native";

const ACCENT = "#FF3FBF";
const BG = "#050508";
const CARD = "#15151B";

export const styles = StyleSheet.create({
    line: {
      bottom:6,
      flex: 17, 
      borderBottomWidth: 0.2,
      width: "100%",
      borderBottomColor: '#ffffffff',
    },
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    paddingTop: 70,
    paddingVertical: 24,
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTextBox: {
    flexShrink: 1,
    paddingRight: 12,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  gradeBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: ACCENT,
  },
  gradeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  nameText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  roleText: {
    color: "#c4c4c4",
    fontSize: 12,
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: ACCENT,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#22232B",
    borderRadius: 999,
    padding: 3,
    marginTop: 8,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
  },
  tabItemActive: {
    backgroundColor: ACCENT,
  },
  tabText: {
    fontSize: 13,
    color: "#aaa",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  sectionCard: {
    backgroundColor: "#1C1C24",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  skillName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 8,
  },
  skillBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  skillBadgeText: {
    color: ACCENT,
    fontSize: 11,
    fontWeight: "600",
  },
  skillDesc: {
    color: "#d0d0d0",
    fontSize: 12,
    lineHeight: 18,
  },
  skillCooldown: {
    color: "#8b8b95",
    fontSize: 11,
    marginTop: 4,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  // 🔽 레벨 드롭다운 영역
  levelDropdown: {
    position: "relative",
    minWidth: 2,
    alignItems: "flex-end",
  },
  levelDropdownControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#333541",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  levelDropdownText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  levelDropdownArrow: {
    color: "#fff",
    fontSize: 10,
    marginLeft: 6,
  },
  levelDropdownMenu: {
    position: "absolute",
    top: 34,
    right: 0,
    backgroundColor: "#2A2A33",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333541",
    paddingVertical: 4,
    minWidth: 110,
    zIndex: 10,
    elevation: 4, // 안드로이드 그림자
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  levelDropdownItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  levelDropdownItemText: {
    color: "#e0e0e8",
    fontSize: 13,
  },
  levelDropdownItemTextActive: {
    color: ACCENT,
    fontWeight: "700",
  },

  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statsCol: {
    flex: 1,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statLabel: {
    color: "#c7c7d4",
    fontSize: 12,
  },
  statValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  pillButton: {
    flexDirection: "row",     // ← 가로 정렬
    alignItems: "center",     // ← 세로 가운데 정렬
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT,
  },
   jobIcon: {
    width: 14,
    height: 12,
    marginLeft:-2,
    right:2
  },
  pillText: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: "600",
  },
  subText: {
    color: "#c4c4c4",
    fontSize: 12,
  },
  footer: {
    marginTop: 16,
  },
  ctaButton: {
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
