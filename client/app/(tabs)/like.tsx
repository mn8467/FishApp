// app/(tabs)/like.tsx
import { ThemedText } from '@/components/themed-text';
import React, { useRef, useState } from "react";
import { Platform, KeyboardAvoidingView, SafeAreaView, View, FlatList, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements"; // Expo Router도 내부적으로 사용 가능


export default function LikeScreen() {

  const [msg, setMsg] = useState("");
  const [data, setData] = useState(
    Array.from({ length: 20 }).map((_, i) => ({ id: String(i), body: `댓글 ${i}` }))
  );

   const inputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight(); // 없으면 0으로 두세요

 const onPressReply = () => {
    // 필요 시 리스트를 맨 아래로 내리고 입력창에 포커스
    listRef.current?.scrollToEnd({ animated: true });
    inputRef.current?.focus();
  };

  const send = () => {
    if (!msg.trim()) return;
    setData(prev => [...prev, { id: String(prev.length + 1), body: msg }]);
    setMsg("");
    // 새 메시지 추가 후 맨 아래로 스크롤
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    inputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: headerHeight, android: 0 })} // 상단 헤더만큼 오프셋
    >
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 12 + insets.bottom }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable onPress={onPressReply} style={styles.item}>
              <Text>{item.body}</Text>
            </Pressable>
          )}
        />

        {/* 하단 입력 바 */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom }]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={msg}
            onChangeText={setMsg}
            placeholder="댓글을 입력하세요"
            multiline
            onFocus={() => requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }))}
          />
          <Pressable style={styles.sendBtn} onPress={send}>
            <Text style={{ color: "white", fontWeight: "700" }}>전송</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  item: { padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#ddd" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f5f6f8",
  },
  sendBtn: {
    marginLeft: 8,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007aff",
  },
});
