// components/YoutubeComments.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type Comment = {
  id: string;
  author: string;
  avatarUrl?: string;
  text: string;
  likes: number;
  createdAt: string; // "3시간 전" 이런 형식으로 넣어도 됨
};

type Props = {
  comments: Comment[];
  totalCount: number;
  inputValue: string;
  onChangeInput: (text: string) => void;
  onSubmit: () => void;
  onPressSort?: () => void;
};

export default function CommentsForm({
  comments,
  totalCount,
  inputValue,
  onChangeInput,
  onSubmit,
  onPressSort,
}: Props) {
  const renderItem = ({ item }: { item: Comment }) => (
    <CommentItem comment={item} />
  );

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      {/* 상단 헤더: 댓글 개수 + 정렬 */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>댓글 {totalCount}개</Text>
        <Pressable style={styles.sortBtn} onPress={onPressSort}>
          <Ionicons name="swap-vertical" size={18} color="#111" />
          <Text style={styles.sortText}>정렬 기준</Text>
        </Pressable>
      </View>

      {/* 댓글 리스트 */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 하단 입력창 */}
      <View style={styles.inputRow}>
        {/* 프로필 동그라미 (실제 아바타 이미지로 교체 가능) */}
        <View style={styles.meAvatar}>
          <Text style={styles.meAvatarInitial}>M</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="댓글 추가..."
            placeholderTextColor="#9AA0A6"
            value={inputValue}
            onChangeText={onChangeInput}
            multiline
          />
        </View>

        <Pressable
          style={[
            styles.sendBtn,
            inputValue.trim().length === 0 && { opacity: 0.4 },
          ]}
          onPress={onSubmit}
          disabled={inputValue.trim().length === 0}
        >
          <Text style={styles.sendText}>게시</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <View style={styles.commentRow}>
      {/* 아바타 */}
      {comment.avatarUrl ? (
        <Image source={{ uri: comment.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>
            {comment.author.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      {/* 오른쪽 내용 */}
      <View style={styles.commentBody}>
        {/* 닉네임 + 시간 */}
        <View style={styles.metaRow}>
          <Text style={styles.author}>{comment.author}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{comment.createdAt}</Text>
        </View>

        {/* 내용 */}
        <Text style={styles.commentText}>{comment.text}</Text>

        {/* 좋아요/싫어요 + 답글 */}
        <View style={styles.actionRow}>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="thumbs-up-outline" size={16} color="#606060" />
            {comment.likes > 0 && (
              <Text style={styles.likeCount}>{comment.likes}</Text>
            )}
          </Pressable>

          <Pressable style={styles.actionBtn}>
            <Ionicons name="thumbs-down-outline" size={16} color="#606060" />
          </Pressable>

          <Pressable>
            <Text style={styles.replyText}>답글</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 13,
    color: "#111111",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // 댓글 아이템
  commentRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  commentBody: {
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  author: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },
  dot: {
    marginHorizontal: 4,
    color: "#606060",
  },
  time: {
    fontSize: 12,
    color: "#606060",
  },
  commentText: {
    fontSize: 14,
    color: "#111",
    lineHeight: 18,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: "#606060",
  },
  replyText: {
    fontSize: 12,
    color: "#606060",
    fontWeight: "500",
  },

  // 하단 입력 영역
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  meAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  meAvatarInitial: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  inputBox: {
    flex: 1,
    minHeight: 36,
    maxHeight: 90,
    borderRadius: 18,
    backgroundColor: "#F1F3F4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: "center",
  },
  input: {
    fontSize: 14,
    color: "#111",
    padding: 0,
  },
  sendBtn: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sendText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065fd4", // 유튜브 파란색 느낌
  },
});
