import React, { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";
import { styles } from "@/components/styles/homestyle";
import { Pet } from "@/types/pet";
import { GetPetDTO } from "@/dto/petDTO";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PetItem({ item, size, onPress }: { item: Pet; size: number; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 5, tension: 150 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 150 }).start();

  return (
    <AnimatedPressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={[styles.cell, { width: size, transform: [{ scale }] }]}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        {!!item.petPortraitUrl && <Image source={{ uri: item.petPortraitUrl }} style={styles.image} />}
      </View>
      <Text style={styles.caption} numberOfLines={1}>{item.petName}</Text>
    </AnimatedPressable>
  );
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;
  const HOST = CURRENT_HOST || "localhost";

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get(`http://${HOST}:8080/api/pet/info`);
        const mapped: Pet[] = res.data.map((p: GetPetDTO) => ({
          petId: p.petId,
          petGrade: p.petGrade,
          petName: p.petName,
          petPortraitUrl: p.petPortraitUrl ?? ""
        }));
        setPets(mapped);
      } catch (err) {
        console.error("🐟 데이터 로드 실패:", err);
      }
    };
    fetchPets();
  }, [HOST]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? pets.filter((p) => p.petName.toLowerCase().includes(q)) : pets;
  }, [query, pets]);

  const { width } = Dimensions.get("window");
  const padding = 16, gap = 12, columns = 4;
  const itemSize = Math.floor((width - padding * 2 - gap * (columns - 1)) / columns);

  const renderItem = ({ item }: { item: Pet }) => (
    <PetItem
      item={item}
      size={itemSize}
      onPress={() => router.push({ pathname: "/pet/[petId]", params: { petId: item.petId } })}
    />
  );

  return (
    <SafeAreaProvider>
      {/* SafeAreaView로 상/하단 노치 영역 보호 */}
      <SafeAreaView style={styles.wrap} edges={["top", "bottom"]}>
        {/* ⬇️ 여기 ‘TopArea’는 항상 고정: 데이터가 0개여도 절대 안 내려감 */}
        <View style={styles.topArea}>
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
          </View>

          {/* 섹션 헤더 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>제목</Text>
            <Ionicons name="chevron-forward" size={18} color="#111" />
          </View>
        </View>

        {/* ⬇️ 여기부터가 스크롤 되는 영역 */}
        <View style={{ flex: 1 }}>
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.petId}
            renderItem={renderItem}
            numColumns={4}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 80 }}
            columnWrapperStyle={{ gap }}
            ItemSeparatorComponent={() => <View style={{ height: gap }} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ height: 200, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#888" }}>데이터가 없습니다.</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
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

