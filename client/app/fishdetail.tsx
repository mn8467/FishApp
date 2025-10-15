// FishDetailScreen.tsx
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/fishdetailstyle";



export default function FishDetailScreen() {
  const [activeTab, setActiveTab] = useState<"info" | "disease">("info");

  

  return (
    <ScrollView style={styles.container}>
      {/* 상단 이미지 + 좋아요 버튼 */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://maeno-demo-s3-v5.s3.ap-northeast-2.amazonaws.com/example.png" }}
          style={styles.image}
        />
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={28} color="#ff4d4d" />
        </TouchableOpacity>
      </View>

      {/* 이름 */}
      <Text style={styles.name}>상어</Text>

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
              accessibilityRole="button"
              style={[styles.tabButton, activeTab === "info" && styles.activeTab]}
              onPress={() => setActiveTab("info")}
            >
              <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>
                기본정보
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
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
          {/* 기본정보 화면 */}
          <View style={styles.statsContainer}>
            {[
              { label: "체력", value: 68 },
              { label: "공격력", value: 55 },
              { label: "방어력", value: 55 },
              { label: "특수공격", value: 50 },
              { label: "특수방어", value: 50 },
              { label: "스피드", value: 42 },
            ].map((stat, idx) => (
              <View key={idx} style={styles.statRow}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={styles.statBarBackground}>
                  <View style={[styles.statBar, { width: `${stat.value}%` }]} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>설명</Text>
            <Text style={styles.description}>
              숲속에서 조용히 먹이를 노리는 물고기입니다. 날카로운 눈으로 상대를 주시하며, 매우 민첩합니다.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>댓글</Text>
            <Text style={styles.comment}>아 너무 귀엽다 😍</Text>
            <Text style={styles.comment}>스피드가 조금 낮은 편이네요.</Text>
          </View>
        </>
      ) : (
        <>
          {/* 질병 정보 화면 */}
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
