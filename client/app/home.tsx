import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Fish = { id: string; name: string; imageUri: string | null };
const FISHES: Fish[] = [
  { id: "1", name: "제목", imageUri: "https://picsum.photos/seed/fish1/300" },
  { id: "2", name: "제목", imageUri: "https://picsum.photos/seed/fish2/300" },
  { id: "3", name: "제목", imageUri: null },
  { id: "4", name: "제목", imageUri: "https://picsum.photos/seed/fish4/300" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? FISHES.filter(f => f.name.toLowerCase().includes(q)) : FISHES;
  }, [query]);

  const { width } = Dimensions.get("window");
  const padding = 16, gap = 12, columns = 4;
  const itemSize = Math.floor((width - padding * 2 - gap * (columns - 1)) / columns);

  const renderItem = ({ item }: { item: Fish }) => (
    <Pressable style={[styles.cell, { width: itemSize }]}>
      <View style={[styles.circle, { width: itemSize, height: itemSize, borderRadius: itemSize / 2 }]}>
        {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.image} /> : null}
      </View>
      <Text style={styles.caption} numberOfLines={1}>{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaProvider style={styles.wrap}>
      {/* 검색바 */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#9AA0A6" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="검색"
          placeholderTextColor="#9AA0A6"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      {/* 칩들 */}
      <View style={styles.chipsRow}>
        <Chip icon={<Ionicons name="heart-outline" size={16} />} label="즐겨찾기" />
        <Chip icon={<Ionicons name="time-outline" size={16} />} label="기록" />
        <Chip icon={<Feather name="file-text" size={16} />} label="주문" />
      </View>

      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>제목</Text>
        <Ionicons name="chevron-forward" size={18} color="#111" />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        numColumns={4}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 80 }}
        columnWrapperStyle={{ gap }}
        ItemSeparatorComponent={() => <View style={{ height: gap }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaProvider>
  );
}

function Chip({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.chip}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon}
        <Text style={styles.chipTxt}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#fff" },

  searchBox: {
    marginHorizontal: 16, height: 40, borderRadius: 10, backgroundColor: "#F2F3F5",
    flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },

  chipsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  chip: { borderWidth: StyleSheet.hairlineWidth, borderColor: "#DADCE0", borderRadius: 18, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#fff" },
  chipTxt: { fontSize: 13, color: "#111" },

  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginRight: 4 },

  cell: { alignItems: "center" },
  circle: { backgroundColor: "#F5F5F7", overflow: "hidden", alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  caption: { marginTop: 6, fontSize: 12, color: "#111" },
});
