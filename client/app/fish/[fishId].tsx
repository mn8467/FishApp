import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Alert,
  Pressable,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  DimensionValue,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons, } from "@expo/vector-icons";
import { styles } from "../../components/fishdetailstyle";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import api from "@/api/axiosInstance";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "@/utils/providers/StateProvider";
import Snackbar from "@/components/ui/snackbar"; // 🔹 이것만 남기고
import { Fish } from "@/types/fish";
import { Comment, WriteComment } from "@/types/comment";



type CommentView = Comment & {
  liked: boolean;   // 이 유저가 좋아요 눌렀는지
  likes_count: number;    // 총 좋아요 수
};


// -------- 유틸 --------
const STAT_MAX = 200;
const TOTAL_MAX = 1000;
const LABEL_WIDTH = 88;

const clamp = (n: number, min = 0, max = STAT_MAX): number =>
  Math.max(min, Math.min(max, n));
const toWidthPct = (n: number): DimensionValue =>
  `${(clamp(n) / STAT_MAX) * 100}%`;
const toTotalPct = (n: number): DimensionValue =>
  `${(Math.max(0, Math.min(TOTAL_MAX, n)) / TOTAL_MAX) * 100}%`;

const normalizeComment = (raw: any): Comment => ({
  commentId: String(raw.commentId),
  userId: String(raw.userId),
  nickname: raw.nickname ?? "",
  fishId: String(raw.fishId),
  body: String(raw.body ?? ""),
  isDeleted: Boolean(raw.isDeleted),
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
  isModified: Boolean(raw.isModified),
  likeCount: String(raw.likeCount)
});


// -------- 개별 댓글 컴포넌트(메모 + 로컬 편집 상태) --------
type CommentItemProps = {
  item: Comment;
  isEditing: boolean;
  onOpenMenu: (c: Comment) => void;
  onCancelEdit: () => void;
  onSaveEdit: (commentId: string, nextBody: string) => void;
  scrollToEnd: () => void;
};




// ============================================
//                 메인 화면
// ============================================
export default function FishDetailScreen() {
  const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext);
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

  // 입력창/스크롤 참조
  const inputRef = useRef<TextInput | null>(null);
  const scrollRef = useRef<any>(null);
  const headerHeight = useHeaderHeight();

  // 댓글
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const [newComment, setNewComment] = useState<WriteComment>({ fishId: "", body: "" });
  const [posting, setPosting] = useState(false);

  // 댓글 수정 관련 (부모는 "누가 편집 중인지"만 가짐)
  const [menuComment, setMenuComment] = useState<Comment | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false); // 연타 방지용 useState
  const [snackbarVisible, setSnackbarVisible] = useState(false); // 스낵바에 필요
  const [snackbarMessage, setSnackbarMessage] = useState(""); // 스낵바에 필요

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 2000);
  };

  const CommentItem = React.memo(function CommentItem({
  item,
  isEditing,
  onOpenMenu,
  onCancelEdit,
  onSaveEdit,
  scrollToEnd,
}: CommentItemProps) {
  const initials = (item.nickname?.trim()?.[0] ?? "U").toUpperCase();




const created = new Date(item.createdAt);
const updated = new Date(item.updatedAt);
// 수정 여부: 값 비교
const isEdited = updated.getTime() !== created.getTime();

// ✅ 수정됨이면 updated, 아니면 created
const shownDate = isEdited ? updated : created;

  // Like 버튼 핸들러
const [like, setLiked] = useState(false);
const [localLikeCount, setLocalLikeCount] = useState(
  Number(item.likeCount) || 0
);

const  handleLikeSubmit = async (commentId: string)=>{
  
  if (isLoggedIn !== true) {
    showSnackbar("로그인이 필요한 기능입니다."); 
    return;
  }


  if (submitting) return;                 // 연타 방지를 위한 코드
    setSubmitting(true);

  
  const next = !like;                     // 토글될 상태 UI먼저 업데이트 시켜 사용자 경험 향상시키기 위함
  const delta = next ? 1 : -1;

  setLiked(next);                         

  const endpoint = next ? "like" : "unlike";
  setLocalLikeCount(prev => prev + delta);


  try{
      const res = await api.post(`request/${endpoint}/${commentId}`);
      
    }catch(err){
    
      setLiked(!next);                  // 요청 실패시 롤백
      setLocalLikeCount(prev => prev - delta);

    }finally{
          
          setSubmitting(false);         // 연타 방지 닫아주기
    }

}


const ts =
  `${shownDate.getFullYear()}-${String(shownDate.getMonth() + 1).padStart(2, "0")}-${String(shownDate.getDate()).padStart(2, "0")} ` +
  `${String(shownDate.getHours()).padStart(2, "0")}:${String(shownDate.getMinutes()).padStart(2, "0")}`;

const likeFalse = "https://maeno-demo-s3-v5.s3.ap-northeast-2.amazonaws.com/likeFalse.png";
const likeTrue = "https://maeno-demo-s3-v5.s3.ap-northeast-2.amazonaws.com/likeTrue.png";
 
const iconlike = like ? likeTrue : likeFalse;


  // ✅ 편집 텍스트는 로컬에서 관리 → 부모 리렌더 영향 최소화
  const [localText, setLocalText] = useState(item.body);
  useEffect(() => {
    if (isEditing) setLocalText(item.body); // 편집 시작시 현재 본문으로 초기화
  }, [isEditing, item.body]);

  return (
    <View style={styles.commentRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={{ flex: 1 }}>
        {/* 상단 헤더(닉네임·시간·점3개) */}
        <View style={[styles.headerRow, { alignItems: "center" }]}>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8, flex: 1 }}>
            <Text style={styles.nameText}>{item.nickname || `User#${item.userId}`}</Text>
            <Text style={styles.timeText}>{ts}</Text>
          
          <TouchableOpacity style={[{ opacity: 0.9 }]}
          onPress ={()=>handleLikeSubmit(item.commentId)}>
              <Image source={{uri:iconlike}}
                style={{ width: 14, height: 12 }}   // 반드시 크기 지정 안하면 아이콘 안뜸
                resizeMode="contain" 
              />
          </TouchableOpacity>
          <Text style={{margin:-5}}>{localLikeCount}</Text>
          

             {isEdited ? (
               <View>
                <Text style={{margin:10 }}> 수정됨 </Text>
              </View> 
            ):( 
              <View/>
            )}
          </View>

          <TouchableOpacity
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            onPress={() => onOpenMenu(item)}
            accessibilityLabel="댓글 작업 메뉴 열기"
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 본문 vs 편집모드 */}
        {isEditing ? (
          <View style={{ marginTop: 6 }}>
            <TextInput
              value={localText}
              onChangeText={setLocalText}
              style={styles.editInput}
              placeholder="내용을 수정하세요"
              multiline
              blurOnSubmit={false} // 엔터로 포커스 날아가지 않게
              onFocus={() => {
                // 포커스때만 살짝 스크롤(입력 중에는 호출 X)
                requestAnimationFrame(scrollToEnd);
              }}
            />

           
            
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
              <TouchableOpacity onPress={onCancelEdit} style={styles.editCancelBtn}>
                <Text style={styles.editCancelText}>취소</Text>
              </TouchableOpacity>

              <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: 8  }} />
              <TouchableOpacity onPress={() => onSaveEdit(item.commentId, localText)} style={styles.editSaveBtn}> 
                <Text style={styles.editSaveText}>저장</Text>
              </TouchableOpacity>

              
            </View>
          </View>
        ) : (
          <Text style={styles.bodyText}>{item.body}</Text>
        )}
      </View>
    </View>
  );
});

  // 물고기 정보
  useEffect(() => {
    const fetchFish = async () => {
      try {
        const res = await axios.get<Fish>(`http://${process.env.EXPO_PUBLIC_CURRENT_HOST}:8080/api/fish/${fishId}`);
        setFish(res.data);
      } catch (err) {
        console.error("🐟 Error fetching fish info:", err);
      } finally {
        setLoading(false);
      }
    };
    if (fishId) fetchFish();
  }, [fishId]);

  // 댓글 가져오기 (초기 + 새 댓글 작성 후)
  useEffect(() => {

    // 표시용 날짜 선택 함수 (같으면 created, 다르면 updated)
  const pickShownDate = (created: Date, updated: Date) =>
  updated.getTime() !== created.getTime() ? updated : created;
  
  const fetchComments = async () => {
  
      if (!fishId) {
        return Alert.alert("❌", "잘못된 접근입니다.");
        
      }
      try {
        setLoadingComments(true);
        const res = await axios.get<Comment[]>(`http://${process.env.EXPO_PUBLIC_CURRENT_HOST}:8080/api/comments/${fishId}`);
        
        const normalized = res.data
          .map(normalizeComment)
          .map(c => {
            const isEdited = c.isModified;
            const shownDate = pickShownDate(c.createdAt, c.updatedAt);
            return{...c, isEdited,shownDate }
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setComments(normalized);

      } catch (err) {
        console.error("💬 Error fetching comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [fishId, posting]);

  // 댓글 수정(낙관적 업데이트 + 실패시 롤백)
  const handleEditSubmit = async (commentId: string, nextBody: string) => {
    const body = nextBody.trim();
    if (!body) return Alert.alert("알림", "내용을 입력하세요.");

    const snapshot = comments;
    setComments(prev => prev.map(c => (c.commentId === commentId ? { ...c, body, updatedAt: new Date() } : c)));
    setEditingId(null);

    try {
      await api.put(`comments/${fishId}/${commentId}`, { body });
      Alert.alert("댓글 수정이 완료되었습니다.");
      //버튼 왜 두번눌러야되는지 알아내야함
    } catch (err) {
      //접근 권한이 없는경우 만들어야함
      console.error("💬 댓글 수정 실패:", err);
      setComments(snapshot);
      Alert.alert("오류", "댓글 수정에 실패했습니다.");
    }
  };

  // 작업메뉴
  const openMenu = (c: Comment) => setMenuComment(c);
  const closeMenu = () => setMenuComment(null);

  // 편집 시작/취소
  const handleEditPress = (c: Comment) => {
    closeMenu();
    setEditingId(c.commentId);
    // (편집 텍스트는 각 CommentItem 내부 로컬 상태에서 관리)
  };
  const handleEditCancel = () => setEditingId(null);

  // 댓글 작성
  const handlePostComment = async () => {

     if (isLoggedIn !== true) {
    showSnackbar("로그인이 필요한 기능입니다."); 
    return;
  }

    const body = newComment.body?.trim();
    if (!fishId) return Alert.alert("잘못된 접근입니다.");
    if (!body) return Alert.alert("알림", "댓글 내용을 입력하세요.");

    setPosting(true);
    try {
      await api.post(`comments/${fishId}/new`, { body });
      setNewComment(prev => ({ ...prev, body: "" }));
      Alert.alert("댓글 입력이 완료되었습니다.");
    } catch (err: any) {
      console.error("💬 댓글 등록 실패:", err?.response?.data ?? err);
      Alert.alert("오류", "댓글 등록에 실패했습니다.");
    } finally {
      setPosting(false);
      // 입력창 다시 포커스 주고 싶으면:
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  // FlatList 렌더러/키 안정화
  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      
      <CommentItem
        item={item}
        isEditing={editingId === item.commentId}
        onOpenMenu={openMenu}
        onCancelEdit={handleEditCancel}
        onSaveEdit={handleEditSubmit}
        scrollToEnd={() => scrollRef.current?.scrollToEnd?.({ animated: true })}
      />
    ),
    [editingId]
  );

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
    // ✅ KeyboardAvoidingView 제거 — KeyboardAwareScrollView만 사용
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView
      innerRef={(ref) => (scrollRef.current = ref)}
      enableAutomaticScroll={true}   // ✅ 자동 스크롤 켜기 (기본값이긴 한데 명시해두자)
      style={styles.container}
      enableOnAndroid
      extraScrollHeight={0}
      extraHeight={Platform.OS === "ios" ? headerHeight : 0}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"  // 탭 시 키보드 유지
      keyboardDismissMode="none"          // 드래그로 키보드 닫힘 방지
      contentContainerStyle={{ paddingBottom: 24 }}
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
          <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>기본정보</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "disease" && styles.activeTab]}
          onPress={() => setActiveTab("disease")}
        >
          <Text style={[styles.tabText, activeTab === "disease" && styles.activeTabText]}>질병</Text>
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

          {/* 댓글 섹션 */}
          <View style={[styles.section, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>댓글</Text>

            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="댓글을 입력하세요"
                value={newComment.body}
                onChangeText={(text) => setNewComment(prev => ({ ...prev, body: text }))}
                blurOnSubmit={false}
                onFocus={() => requestAnimationFrame(() => scrollRef.current?.scrollToEnd?.({ animated: true }))}
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
                renderItem={renderComment}
                scrollEnabled={false} // 상위 ScrollView가 스크롤
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={{ paddingTop: 12 }}
                removeClippedSubviews={false} // 편집 중 잘리는 현상 방지
                initialNumToRender={10}
              />
            )}

            {/* ▼ 작업메뉴 바텀시트 */}
            <Modal visible={!!menuComment} transparent animationType="slide" onRequestClose={() => setMenuComment(null)}>
              <Pressable style={{ flex: 1, backgroundColor: "transparent" }} onPress={() => setMenuComment(null)} />
              <View style={styles.sheetContainer}>
                <View style={styles.sheetHandle} />

                <TouchableOpacity style={styles.sheetItem} onPress={() => menuComment && handleEditPress(menuComment)}>
                  <Ionicons name="create-outline" size={20} />
                  <Text style={styles.sheetItemText}>댓글 수정</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sheetItem}>
                  <Ionicons name="trash-outline" size={20} />
                  <Text style={[styles.sheetItemText, { color: "#d33" }]}>댓글 삭제</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.sheetItem, { justifyContent: "center" }]} onPress={() => setMenuComment(null)}>
                  <Text style={styles.sheetCancelText}>취소</Text>
                </TouchableOpacity>
              </View>
            </Modal>
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
      <Snackbar visible={snackbarVisible} message={snackbarMessage} bottom={20} />
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
  );
}