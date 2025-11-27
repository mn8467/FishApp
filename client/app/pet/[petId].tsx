// PetDetailScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
} from "react-native";

import { styles } from "@/components/styles/petdetailstyle";

const job_em = "https://maeno-demo-s3-v5.s3.ap-northeast-2.amazonaws.com/job_emblem_image/1_11.webp";


type Pet = {
  name: string;
  grade: string;
  role: string;
  avatarUrl: string;
  skill: {
    type: string;
    name: string;
    desc: string;
    cooldown: string;
  };
  level: number;
  stats: {
    str: number;
    dex: number;
    int: number;
    will: number;
    luck: number;
    charm: number;
    crit: number;
    multihit: number;
  };
};

// 1레벨 / 40레벨 선택용
const LEVEL_OPTIONS = [1, 40];

const mockPet: Pet = {
  name: "갈색 포메라니안",
  grade: "에픽",
  role: "고유 스킬: 궁극의 응원",
  avatarUrl:
    "https://maeno-demo-s3-v5.s3.ap-northeast-2.amazonaws.com/epic_grade_pet/brown_pomeranian.png",
  skill: {
    type: "액티브",
    name: "궁극의 응원",
    desc: "시전 시 펫 주인의 궁극기 게이지를 6% 충전합니다.",
    cooldown: "재사용 대기 시간: 40초",
  },
  level: 1,
  stats: {
    str: 0,
    dex: 0,
    int: 0,
    will: 0,
    luck: 0,
    charm: 0,
    crit: 0,
    multihit: 0,
  },
};

const PetDetailScreen = () => {
  const [activeTab, setActiveTab] = useState<"info" | "image">("info");
  const pet = mockPet;

  // 레벨 상태 + 드롭다운 열림 여부
  const [level, setLevel] = useState<number>(pet.level);
  const [isLevelOpen, setIsLevelOpen] = useState(false);

  const handleSelectLevel = (lv: number) => {
    setLevel(lv);
    setIsLevelOpen(false);
    // TODO: 레벨에 따라 스탯 다시 계산하려면 여기서 처리
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextBox}>
            <View style={styles.badgeRow}>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>{pet.grade}</Text>
              </View>
            </View>
            <Text style={styles.nameText}>{pet.name}</Text>
            <Text style={styles.roleText}>{pet.role}</Text>
          </View>

          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: pet.avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* 탭 */}
        <View style={styles.tabRow}>
          <Pressable
            style={[
              styles.tabItem,
              activeTab === "info" && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab("info")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "info" && styles.tabTextActive,
              ]}
            >
              기본 정보
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabItem,
              activeTab === "image" && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab("image")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "image" && styles.tabTextActive,
              ]}
            >
              이미지
            </Text>
          </Pressable>
        </View>

        {/* 탭 내용 */}
        {activeTab === "info" ? (
          <>
            {/* 고유 스킬 카드 */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>고유 스킬</Text>
              <View style={styles.line}></View>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{pet.skill.name}</Text>
                <View style={styles.skillBadge}>
                  <Text style={styles.skillBadgeText}>
                    {pet.skill.type}
                  </Text>
                </View>
              </View>
              <Text style={styles.skillDesc}>{pet.skill.desc}</Text>
              <Text style={styles.skillCooldown}>{pet.skill.cooldown}</Text>
            </View>

            {/* 레벨 & 스탯 카드 */}
            <View style={styles.sectionCard}>
              <View style={styles.levelRow}>

                  <Text style={styles.sectionTitle}>레벨</Text>
                    

                  {/* 🔽 커스텀 드롭다운 */}
                  <View style={styles.levelDropdown}>
                    <Pressable
                      style={styles.levelDropdownControl}
                      onPress={() => setIsLevelOpen((prev) => !prev)}
                    >
                      <Text style={styles.levelDropdownText}>{level} 레벨</Text>
                      <Text style={styles.levelDropdownArrow}>
                        {isLevelOpen ? "▲" : "▼"}
                      </Text>
                    </Pressable>
                    

                  {isLevelOpen && (
                    <View style={styles.levelDropdownMenu}>
                      {LEVEL_OPTIONS.map((lv) => (
                        <Pressable
                          key={lv}
                          style={styles.levelDropdownItem}
                          onPress={() => handleSelectLevel(lv)}
                        >
                          <Text
                            style={[
                              styles.levelDropdownItemText,
                              level === lv &&
                                styles.levelDropdownItemTextActive,
                            ]}
                          >
                            {lv} 레벨
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statsCol}>
                  <StatRow label="힘" value={pet.stats.str} />  
                  <StatRow label="솜씨" value={pet.stats.dex} />
                  <StatRow label="지력" value={pet.stats.int} />
                  <StatRow label="의지" value={pet.stats.will} />
                  <StatRow label="행운" value={pet.stats.luck} />
                  <StatRow label="매력" value={pet.stats.charm} />
                  {/* <StatRow label="치명타" value={pet.stats.crit} />
                  <StatRow label="연타 강화" value={pet.stats.multihit} /> 위에는 공통 사항이므로 하드코딩 & 치명타,연타강화 부분은 펫마다 다르므로 데이터 가져옴  */} 
                </View>
              </View>
            </View>

            {/* 주요 추가 능력 카드 */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>주요 추가 능력</Text>
              
              <View style={styles.pillRow}>
                <Pressable style={styles.pillButton}>
                  <Text style={styles.pillText}>치명타</Text>
                </Pressable>
                <Pressable style={styles.pillButton}>
                  <Text style={styles.pillText}>연타 강화</Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>이미지</Text>
            <Text style={styles.subText}>펫의 다른 포즈/스킨을 여기에 표시</Text>
          </View>
        )}


        <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>추천 직업</Text>
              <View style={styles.pillRow}>
                <View style={styles.pillButton}>
                  <Image source={{uri:job_em}}
                                  style={styles.jobIcon}   // 반드시 크기 지정 안하면 아이콘 안뜸
                                  resizeMode="contain" 
                                />
                  <Text style={styles.pillText}>검술사</Text>
                </View>
              </View>
            </View>
      </View>
    </ScrollView>
  );
};

type StatRowProps = {
  label: string;
  value: number;
};

const StatRow = ({ label, value }: StatRowProps) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default PetDetailScreen;
