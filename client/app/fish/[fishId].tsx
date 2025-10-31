import React, { useEffect, useState } from "react";

// 상단 import들 옆에 붙이기
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  DimensionValue,
  TextInput, // 추가
  FlatList,  // 추가
  KeyboardAvoidingView, // 추가
  Platform, // 추가
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


/** ✅ 댓글 타입(서버 응답 기준) */
// 댓글 가져올때 사용?
interface Comment {
    commentId: string;
    userId: string;
    nickname: string;
    fishId: string;
    body: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
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

    // ───────────────────────────── 댓글: 상태 ─────────────────────────────
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const CURRENT_USER_ID = 1;

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


// 서버 응답 → 클라이언트 Comment로 변환
const normalizeComment = (raw: any): Comment => ({
  commentId: String(raw.commentId),     // ID를 문자열로 강제
  userId:    String(raw.userId),        // 문자열로 강제
  nickname:  raw.nickname ?? "",        // null/undefined이면 빈 문자열
  fishId:    String(raw.fishId),        // 문자열로 강제
  body:      String(raw.body ?? ""),    // 비어 있으면 빈 문자열
  isDeleted: Boolean(raw.isDeleted),    // 불리언으로 강제
  createdAt: new Date(raw.createdAt),   // ISO 문자열 → Date 객체
  updatedAt: new Date(raw.updatedAt),   // ISO 문자열 → Date 객체
});

    //고쳐야함!!!
// 2) 댓글 목록 가져오기(useEffect)
useEffect(() => {
  const fetchComments = async () => {
    if (!fishId) return;
    try {
      setLoadingComments(true);
      const res = await axios.get<any[]>(`http://${CURRENT_HOST}:8080/api/comments/data/${fishId}`);

      // 서버 정렬이 이미 되어 있으면 이 정렬은 생략 가능
      const normalized = res.data.map(normalizeComment).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      setComments(normalized);
    } catch (err) {
      console.error("💬 Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };
  fetchComments();
}, [fishId]);

// 3) 댓글 작성(낙관적 업데이트 포함)
const handlePostComment = async () => {
  const body = newComment.trim();
  if (!body || !fishId) return;

  setPosting(true);

  // ✅ 임시 ID는 string으로, 유형을 명확히
  const tempId = `temp-${Date.now()}`;

  // ✅ 최신 Comment 타입에 맞춘 낙관적 객체
  const optimistic: Comment = {
    commentId: tempId,
    userId: String(CURRENT_USER_ID),
    nickname: "You",                 // 서버가 닉네임 돌려줄 때 교체될 값
    fishId: String(fishId),
    body,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  setComments((prev) => [optimistic, ...prev]);
  setNewComment("");

  try {
    // 서버는 생성된 댓글 전체를 반환하는 게 베스트
    const res = await axios.post<any>(
      `http://${CURRENT_HOST}:8080/api/fish/${fishId}/comments`,
      { userId: CURRENT_USER_ID, body }
    );

    const serverComment = normalizeComment(res.data);

    // ✅ 임시 ID를 서버 ID로 교체
    setComments((prev) =>
      prev.map((c) => (c.commentId === tempId ? serverComment : c))
    );
  } catch (err) {
    console.error("💬 Error posting comment:", err);
    // 롤백 + 입력 복구
    setComments((prev) => prev.filter((c) => c.commentId !== tempId));
    setNewComment(body);
  } finally {
    setPosting(false);
  }
};


  /** ✅ 댓글 아이템: 아바타 이니셜 + 본문 + 시간 */
const CommentItem = ({ item }: { item: Comment }) => {
  const initials = (item.nickname?.trim()?.[0] ?? "U").toUpperCase();
  const d = new Date(item.createdAt);
  const ts = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  return (
    <View style={styles.commentRow}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
      <View style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Text style={styles.nameText}>{item.nickname ?? `User#${item.userId}`}</Text>
          <Text style={styles.timeText}>{ts}</Text>
        </View>
        <Text style={styles.bodyText}>{item.body}</Text>
      </View>
    </View>
  );
};


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


            {/* ──────────────── ✅ 댓글 섹션 (필수 최소) ──────────────── */}
          <View style={[styles.section, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>댓글</Text>

            {/* 입력창 */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="댓글을 입력하세요"
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity
                  style={[styles.sendBtn, posting && { opacity: 0.6 }]}
                  onPress={handlePostComment}
                  disabled={posting}
                >
                  <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>

            {/* 목록 */}
            {loadingComments ? (
              <View style={{ paddingVertical: 12 }}>
                <ActivityIndicator />
              </View>
            ) : comments.length === 0 ? (
              <Text style={{ color: "#777", marginTop: 8 }}>첫 댓글을 남겨보세요.</Text>
            ) : (
              <FlatList
                data={comments}
                keyExtractor={(item) => String(item.commentId)}
                renderItem={({ item }) => <CommentItem item={item} />}
                scrollEnabled={false}              // 상위 ScrollView가 스크롤
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={{ paddingTop: 12 }}
              />
            )}
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
