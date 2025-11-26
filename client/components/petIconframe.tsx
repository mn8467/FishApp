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
