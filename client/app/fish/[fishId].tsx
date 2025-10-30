import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  DimensionValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../components/fishdetailstyle";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;

// 🎯 서버에서 내려오는 데이터 타입
interface Fish {
  fishId: number;
  fishName: string;
  familyName: string;
  habitat: string;
  bodyLength: string;
  description: string;
  imageUrl: string;
  totalStats: number;
  hp: number;
  hpDesc: string;
  attack: number;
  attackDesc: string;
  defense: number;
  defenseDesc: string;
  special: number;
  specialDesc: string;
  speed: number;
  speedDesc: string;
}

const STAT_MAX = 200;
const TOTAL_MAX = 1000;
// [CHANGED] 라벨 영역 너비(아래 desc 들여쓰기에도 사용). 너 스타일에 맞춰 80~88로 조절 가능.
const LABEL_WIDTH = 88; 

const clamp = (n: number, min = 0, max = STAT_MAX): number =>
  Math.max(min, Math.min(max, n));

const toWidthPct = (n: number): DimensionValue =>
  `${(clamp(n) / STAT_MAX) * 100}%`;

const toTotalPct = (n: number): DimensionValue =>
  `${(Math.max(0, Math.min(TOTAL_MAX, n)) / TOTAL_MAX) * 100}%`;

export default function FishDetailScreen() {
  const [activeTab, setActiveTab] = useState<"info" | "disease">("info");
  const { fishId } = useLocalSearchParams<{ fishId?: string }>();
  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);

  // [CHANGED] 체력(? 아이콘) 설명 토글 상태
  const [showHpInfo, setShowHpInfo] = useState(false);
  const [showAttackInfo, setShowAttackInfo] = useState(false);
  const [showDefenceInfo, setShowDefenceInfo] = useState(false);
  const [showSpecialInfo, setShowSpecialInfo] = useState(false);
  const [showSpeedInfo, setShowSpeedInfo] = useState(false);


  useEffect(() => {
    const fetchFish = async () => {
      try {
        const res = await axios.get<Fish>(
          `http://${CURRENT_HOST}:8080/api/fish/${fishId || 1}`
        );
        setFish(res.data);
      } catch (err) {
        console.error("🐟 Error fetching fish info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFish();
  }, [fishId]);

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4BA3C3" />
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  if (!fish) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text>물고기 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 상단 이미지 */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: fish.imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={28} color="#ff4d4d" />
        </TouchableOpacity>
      </View>

      {/* 이름 */}
      <Text style={styles.name}>{fish.fishName}</Text>

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "info" && styles.activeTab]}
          onPress={() => setActiveTab("info")}
        >
          <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>
            기본정보
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "disease" && styles.activeTab]}
          onPress={() => setActiveTab("disease")}
        >
          <Text style={[styles.tabText, activeTab === "disease" && styles.activeTabText]}>
            질병
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭 내용 */}
      {activeTab === "info" ? (
        <>
          {/* 스탯 바 */}
          <View style={styles.statsContainer}>
            {[
              // [CHANGED] hp 행만 ? 아이콘/설명 토글 기능을 붙일 거라 label로 판별
              { label: "체력", value: fish.hp, desc: fish.hpDesc },
              { label: "공격력", value: fish.attack, desc: fish.attackDesc },
              { label: "방어력", value: fish.defense, desc: fish.defenseDesc },
              { label: "특수능력", value: fish.special, desc: fish.specialDesc },
              { label: "스피드", value: fish.speed, desc: fish.speedDesc },
            ].map((stat, idx) => {
              const barWidth: DimensionValue = toWidthPct(stat.value);
              const isHP = stat.label === "체력"; // [CHANGED]
              const isAttack = stat.label === "공격력"; // [CHANGED]
              const isDefense = stat.label === "방어력"; // [CHANGED]
              const isSpecial = stat.label === "특수능력"; // [CHANGED]
              const isSpeed = stat.label === "스피드"; // [CHANGED]



              return (
                <View key={idx} style={{ marginBottom: isHP && showHpInfo ? 6 : 0 }}>
                  <View style={styles.statRow}>
                    {/* [CHANGED] 라벨 + ? 아이콘 묶어서 같은 줄에 배치 */}
                    <View style={{ width: LABEL_WIDTH, flexDirection: "row", alignItems: "center" }}>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                      {isHP && (
                        <TouchableOpacity
                          onPress={() => setShowHpInfo((v) => !v)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.helpIcon /* [CHANGED] */}
                        >
                          <Ionicons name="help-circle-outline" size={16} color="#888" />
                        </TouchableOpacity>
                      )}
                      {isAttack && (
                        <TouchableOpacity
                          onPress={() => setShowAttackInfo((v) => !v)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.helpIcon /* [CHANGED] */}
                        >
                          <Ionicons name="help-circle-outline" size={16} color="#888" />
                        </TouchableOpacity>
                      )}
                      {isDefense && (
                        <TouchableOpacity
                          onPress={() => setShowDefenceInfo((v) => !v)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.helpIcon /* [CHANGED] */}
                        >
                          <Ionicons name="help-circle-outline" size={16} color="#888" />
                        </TouchableOpacity>
                      )}
                      {isSpecial && (
                        <TouchableOpacity
                          onPress={() => setShowSpecialInfo((v) => !v)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.helpIcon /* [CHANGED] */}
                        >
                          <Ionicons name="help-circle-outline" size={16} color="#888" />
                        </TouchableOpacity>
                      )}
                      {isSpeed && (
                        <TouchableOpacity
                          onPress={() => setShowSpeedInfo((v) => !v)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.helpIcon /* [CHANGED] */}
                        >
                          <Ionicons name="help-circle-outline" size={16} color="#888" />
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.statBarBackground}>
                      <View style={[styles.statBar, { width: barWidth }]} />
                    </View>
                    <Text style={styles.statValue}>{clamp(stat.value)}</Text>
                  </View>

                  {/* [CHANGED] hpDesc 토글 표시 (라벨 영역만큼 들여쓰기) */}
                  {isHP && showHpInfo && (
                    <Text
                      style={{
                        marginLeft: LABEL_WIDTH,
                        marginTop: 4,
                        marginRight: 8,
                        fontSize: 12,
                        color: "#666",
                        lineHeight: 18,
                      }}
                      numberOfLines={4}
                    >
                      {stat.desc}
                    </Text>
                  )}
                  {isAttack && showAttackInfo && (
                    <Text
                      style={{
                        marginLeft: LABEL_WIDTH,
                        marginTop: 4,
                        marginRight: 8,
                        fontSize: 12,
                        color: "#666",
                        lineHeight: 18,
                      }}
                      numberOfLines={4}
                    >
                      {stat.desc}
                    </Text>
                  )}
                  {isDefense && showDefenceInfo && (
                    <Text
                      style={{
                        marginLeft: LABEL_WIDTH,
                        marginTop: 4,
                        marginRight: 8,
                        fontSize: 12,
                        color: "#666",
                        lineHeight: 18,
                      }}
                      numberOfLines={4}
                    >
                      {stat.desc}
                    </Text>
                  )}
                  {isSpecial && showSpecialInfo && (
                    <Text
                      style={{
                        marginLeft: LABEL_WIDTH,
                        marginTop: 4,
                        marginRight: 8,
                        fontSize: 12,
                        color: "#666",
                        lineHeight: 18,
                      }}
                      numberOfLines={4}
                    >
                      {stat.desc}
                    </Text>
                  )}
                  {isSpeed && showSpeedInfo && (
                    <Text
                      style={{
                        marginLeft: LABEL_WIDTH,
                        marginTop: 4,
                        marginRight: 8,
                        fontSize: 12,
                        color: "#666",
                        lineHeight: 18,
                      }}
                      numberOfLines={4}
                    >
                      {stat.desc}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* 총합 바 */}
          <View style={[styles.section, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>총합</Text>
            <View style={styles.statRow}>
              <View style={{ width: LABEL_WIDTH }}>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statBarBackground}>
                <View style={[styles.statBar, { width: toTotalPct(fish.totalStats) }]} />
              </View>
              <Text style={styles.statValue}>{Math.min(fish.totalStats, TOTAL_MAX)}</Text>
            </View>
          </View>

          {/* 설명 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>설명</Text>
            <Text style={styles.description}>{fish.description}</Text>
          </View>

          {/* 기본 정보 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>기본 정보</Text>
            <Text>과명: {fish.familyName}</Text>
            <Text>서식지: {fish.habitat}</Text>
            <Text>몸길이: {fish.bodyLength}</Text>
          </View>
        </>
      ) : (
        <>
          {/* 질병 탭 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>질병 정보</Text>
            <Text style={styles.description}>
              이 어종은 수온이 낮거나 탁한 물에서 지느러미 부식증, 백점병 등이 발생할 수 있습니다.
              정기적인 수질 관리와 깨끗한 환경 유지가 중요합니다.
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}
