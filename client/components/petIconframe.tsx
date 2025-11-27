// components/petIconframe.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  size: number;
  outerColor: string;
  innerColor: string;
  children: React.ReactNode;
};

export default function PetIconFrame({ size, outerColor, innerColor, children }: Props) {
  const radius = size * 0.27;

  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: outerColor,
          padding: size * 0.06,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            borderRadius: radius * 0.9,
            backgroundColor: innerColor,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const gradeColors: { [key: number]: { outer: string; inner: string } } = {
  1: { outer: "#1e713b", inner: "#20914c" }, // 초록
  2: { outer: "#1b59af", inner: "#152c48" }, // 파랑
  3: { outer: "#6e45c9", inner: "#5f4270" }, // 보라
  4: { outer: "#b62986", inner: "#7b376e" }, // 핑크
};

function getGradeColors(grade: number) {
  return gradeColors[grade] ?? gradeColors[1]; // 기본은 초록
}

const styles = StyleSheet.create({
  outer: {
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
