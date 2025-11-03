import React, { useEffect, useState, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Pressable,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  DimensionValue,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../components/fishdetailstyle";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";

const CURRENT_HOST = process.env.EXPO_PUBLIC_CURRENT_HOST;

// 서버 타입
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
const LABEL_WIDTH = 88;

const clamp = (n: number, min = 0, max = STAT_MAX): number =>
  Math.max(min, Math.min(max, n));
const toWidthPct = (n: number): DimensionValue =>
  `${(clamp(n) / STAT_MAX) * 100}%`;
const toTotalPct = (n: number): DimensionValue =>
  `${(Math.max(0, Math.min(TOTAL_MAX, n)) / TOTAL_MAX) * 100}%`;

export default function FishDetailScreen() {
  const { fishId } = useLocalSearchParams<{ fishId?: string }>();
  const [activeTab, setActiveTab] = useState<"info" | "disease">("info");
  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);

  // 설명 토글
  const [showHpInfo, setShowHpInfo] = useState(false);
  const [showAttackInfo, setShowAttackInfo] = useState(false);
  const [showDefenceInfo, setShowDefenceInfo] = useState(false);
  const [showSpecialInfo, setShowSpecialInfo] = useState(false);
  const [showSpeedInfo, setShowSpeedInfo] = useState(false);

  // 🔒 입력창/스크롤 참조
  const inputRef = useRef<TextInput | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const headerHeight = useHeaderHeight();

  // 댓글 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const CURRENT_USER_ID = 1;

  // 물고기 정보
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

  // 댓글 정규화
  const normalizeComment = (raw: any): Comment => ({
    commentId: String(raw.commentId),
    userId: String(raw.userId),
    nickname: raw.nickname ?? "",
    fishId: String(raw.fishId),
    body: String(raw.body ?? ""),
    isDeleted: Boolean(raw.isDeleted),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  });

  // 댓글 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      if (!fishId) return;
      try {
        setLoadingComments(true);
        const res = await axios.get<any[]>(
          `http://${CURRENT_HOST}:8080/api/comments/data/${fishId}`
        );
        const normalized = res.data
          .map(normalizeComment)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setComments(normalized);
      } catch (err) {
        console.error("💬 Error fetching comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [fishId]);

  // 댓글 작성 ------------------------------------------------------------------ 업뎃 예정
  const handlePostComment = async () => {
    const body = newComment.trim();
    if (!body || !fishId) return;

    setPosting(true);
    const tempId = `temp-${Date.now()}`;
    const optimistic: Comment = {
      commentId: tempId,
      userId: String(CURRENT_USER_ID),
      nickname: "You",
      fishId: String(fishId),
      body,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setComments((prev) => [optimistic, ...prev]);
    setNewComment("");

    // UX: 전송 직후 아래로 스크롤 + 포커스 유지
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
      setTimeout(() => inputRef.current?.focus(), 0);
    });

    try {
      const res = await axios.post<any>(
        `http://${CURRENT_HOST}:8080/api/fish/${fishId}/comments`,
        { userId: CURRENT_USER_ID, body }
      );
      const serverComment = normalizeComment(res.data);
      setComments((prev) =>
        prev.map((c) => (c.commentId === tempId ? serverComment : c))
      );
    } catch (err) {
      console.error("💬 Error posting comment:", err);
      setComments((prev) => prev.filter((c) => c.commentId !== tempId));
      setNewComment(body);
    } finally {
      setPosting(false);
    }
  };

  const CommentItem = ({ item }: { item: Comment }) => {
    const initials = (item.nickname?.trim()?.[0] ?? "U").toUpperCase();
    const d = new Date(item.createdAt);
    const ts = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return (
      <View style={styles.commentRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <Text style={styles.nameText}>{item.nickname || `User#${item.userId}`}</Text>
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
    >
            <KeyboardAwareScrollView
              innerRef={(ref) => (scrollRef.current = ref)}
              style={styles.container}
              keyboardShouldPersistTaps="handled"
              enableOnAndroid
              extraScrollHeight={64}      // ⬅️ 키보드 위로 좀 더 올려줌
              extraHeight={64}
              keyboardOpeningTime={0}
            >
        {/* 상단 이미지 */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: fish.imageUrl }} style={styles.image} />
          <TouchableOpacity style={styles.likeButton}>
            <Ionicons name="heart-outline" size={28} color="#ff4d4d" />
          </TouchableOpacity>
        </View>

        {/* 이름 */}
        <Text style={styles.name}>{fish.fishName}</Text>

        {/* 탭 */}
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

        {activeTab === "info" ? (
          <>
            {/* 스탯 바 */}
            <View style={styles.statsContainer}>
              {[
                { label: "체력", value: fish.hp, desc: fish.hpDesc },
                { label: "공격력", value: fish.attack, desc: fish.attackDesc },
                { label: "방어력", value: fish.defense, desc: fish.defenseDesc },
                { label: "특수능력", value: fish.special, desc: fish.specialDesc },
                { label: "스피드", value: fish.speed, desc: fish.speedDesc },
              ].map((stat, idx) => {
                const barWidth: DimensionValue = toWidthPct(stat.value);
                const isHP = stat.label === "체력";
                const isAttack = stat.label === "공격력";
                const isDefense = stat.label === "방어력";
                const isSpecial = stat.label === "특수능력";
                const isSpeed = stat.label === "스피드";

                return (
                  <View key={idx} style={{ marginBottom: (isHP && showHpInfo) ? 6 : 0 }}>
                    <View style={styles.statRow}>
                      <View style={{ width: LABEL_WIDTH, flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                        {isHP && (
                          <TouchableOpacity onPress={() => setShowHpInfo(v => !v)} hitSlop={8} style={styles.helpIcon}>
                            <Ionicons name="help-circle-outline" size={16} color="#888" />
                          </TouchableOpacity>
                        )}
                        {isAttack && (
                          <TouchableOpacity onPress={() => setShowAttackInfo(v => !v)} hitSlop={8} style={styles.helpIcon}>
                            <Ionicons name="help-circle-outline" size={16} color="#888" />
                          </TouchableOpacity>
                        )}
                        {isDefense && (
                          <TouchableOpacity onPress={() => setShowDefenceInfo(v => !v)} hitSlop={8} style={styles.helpIcon}>
                            <Ionicons name="help-circle-outline" size={16} color="#888" />
                          </TouchableOpacity>
                        )}
                        {isSpecial && (
                          <TouchableOpacity onPress={() => setShowSpecialInfo(v => !v)} hitSlop={8} style={styles.helpIcon}>
                            <Ionicons name="help-circle-outline" size={16} color="#888" />
                          </TouchableOpacity>
                        )}
                        {isSpeed && (
                          <TouchableOpacity onPress={() => setShowSpeedInfo(v => !v)} hitSlop={8} style={styles.helpIcon}>
                            <Ionicons name="help-circle-outline" size={16} color="#888" />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={styles.statBarBackground}>
                        <View style={[styles.statBar, { width: barWidth }]} />
                      </View>
                      <Text style={styles.statValue}>{clamp(stat.value)}</Text>
                    </View>

                    {isHP && showHpInfo && (
                      <Text style={{ marginLeft: LABEL_WIDTH, marginTop: 4, marginRight: 8, fontSize: 12, color: "#666", lineHeight: 18 }} numberOfLines={4}>
                        {stat.desc}
                      </Text>
                    )}
                    {isAttack && showAttackInfo && (
                      <Text style={{ marginLeft: LABEL_WIDTH, marginTop: 4, marginRight: 8, fontSize: 12, color: "#666", lineHeight: 18 }} numberOfLines={4}>
                        {stat.desc}
                      </Text>
                    )}
                    {isDefense && showDefenceInfo && (
                      <Text style={{ marginLeft: LABEL_WIDTH, marginTop: 4, marginRight: 8, fontSize: 12, color: "#666", lineHeight: 18 }} numberOfLines={4}>
                        {stat.desc}
                      </Text>
                    )}
                    {isSpecial && showSpecialInfo && (
                      <Text style={{ marginLeft: LABEL_WIDTH, marginTop: 4, marginRight: 8, fontSize: 12, color: "#666", lineHeight: 18 }} numberOfLines={4}>
                        {stat.desc}
                      </Text>
                    )}
                    {isSpeed && showSpeedInfo && (
                      <Text style={{ marginLeft: LABEL_WIDTH, marginTop: 4, marginRight: 8, fontSize: 12, color: "#666", lineHeight: 18 }} numberOfLines={4}>
                        {stat.desc}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* 총합 */}
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

            {/* ✅ 댓글 섹션 */}
            <View style={[styles.section, { marginTop: 16 }]}>
              <Text style={styles.sectionTitle}>댓글</Text>

              <View style={styles.inputRow}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder="댓글을 입력하세요"
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  onFocus={() =>
                    requestAnimationFrame(() => {
                      // 포커스 시 맨 아래로 스크롤
                      scrollRef.current?.scrollToEnd({ animated: true });
                    })
                  }
                />
                <TouchableOpacity
                  style={[styles.sendBtn, posting && { opacity: 0.6 }]}
                  onPress={handlePostComment}
                  disabled={posting}
                >
                  <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

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
                  scrollEnabled={false} // 상위 ScrollView가 스크롤
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
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
