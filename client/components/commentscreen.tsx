// screens/CommentScreen.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubeComments, { Comment } from "@/components/commentparts";

export default function CommentScreen() {
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "User123",
      text: "이 펫 진짜 귀엽다...",
      likes: 12,
      createdAt: "3시간 전",
    },
    {
      id: "2",
      author: "FishMaster",
      text: "정보 감사합니다!",
      likes: 3,
      createdAt: "1일 전",
    },
  ]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: "나",
      text: trimmed,
      likes: 0,
      createdAt: "방금 전",
    };

    setComments((prev) => [newComment, ...prev]); // 위에 추가
    setInput("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YoutubeComments
        comments={comments}
        totalCount={comments.length}
        inputValue={input}
        onChangeInput={setInput}
        onSubmit={handleSubmit}
        onPressSort={() => {
          // 정렬 눌렀을 때 처리 (예: 최신순/좋아요순 토글)
        }}
      />
    </SafeAreaView>
  );
}
