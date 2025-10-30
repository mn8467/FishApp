import React, { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet, Dimensions, Animated } from "react-native"; // ✅ 수정: SafeAreaView 제거(미사용)
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router"; // ✅ 수정: 라우팅을 위해 추가

type Fish = {
  fishId: string;
  fishName: string;
  imageUri: string;
};

// (더미데이터 제거 유지)

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ✅ 수정: 상세 화면으로 이동할 수 있도록 onPress를 주입받게 변경
function FishItem({ item, size, onPress }: { item: Fish; size: number; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 5,
      tension: 150,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 150,
    }).start();
  };

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress} // ✅ 수정: 아이템 터치 시 부모에서 넘긴 핸들러 실행
      style={[styles.cell, { width: size, transform: [{ scale }] }]}
    >
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.image} /> : null}
      </View>
      <Text style={styles.caption} numberOfLines={1}>
        {item.fishName /* name → fishName 유지 */}
      </Text>
    </AnimatedPressable>
  );
}

export default function Home() {
  const router = useRouter(); // ✅ 수정: 네비게이션 훅
  const [query, setQuery] = useState("");
  const [fishes, setFishes] = useState<Fish[]>([]);
  const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;
  const HOST = CURRENT_HOST || "localhost"; // ✅ 수정: 환경변수 미설정 시 안전한 기본값

  // 서버에서 데이터 불러오기
  useEffect(() => {
    const fetchFishes = async () => {
      try {
        const res = await axios.get(`http://${HOST}:8080/api/fish/data`); // ✅ 수정: HOST 사용
        const mapped: Fish[] = res.data.map((f: any) => ({
          fishId: f.fishId,
          fishName: f.fishName,
          imageUri: f.imageUrl ?? "", // 빈 문자열 기본값
                                      // Url(이미지) 없을 경우  WARN  source.uri should not be an empty string 디버깅 뜸
        }));
        setFishes(mapped);
      } catch (err) {
        console.error("🐟 데이터 로드 실패:", err);
      }
    };

    fetchFishes();
  }, [HOST]); // ✅ 수정: HOST 변경 시 재요청

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? fishes.filter((f) => f.fishName.toLowerCase().includes(q)) : fishes;
  }, [query, fishes]);

  const { width } = Dimensions.get("window");
  const padding = 16,
    gap = 12,
    columns = 4;
  const itemSize = Math.floor((width - padding * 2 - gap * (columns - 1)) / columns);

  // ✅ 수정: renderItem에서 각 아이템을 누르면 상세로 이동하도록 구현
  const renderItem = ({ item }: { item: Fish }) => (
    <FishItem
      item={item}
      size={itemSize}
      onPress={() =>
        router.push({
          pathname: "/fish/[fishId]", // 동적 라우트
          params: { fishId: item.fishId }, // ✅ 수정: 파라미터로 fishId 전달
        })
      }
    />
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
        keyExtractor={(i) => i.fishId} // fishId로 key 유지
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
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginRight: 4 },
  cell: { alignItems: "center" },
  circle: { backgroundColor: "#F5F5F7", overflow: "hidden", alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  caption: { marginTop: 6, fontSize: 12, color: "#111" },
});
