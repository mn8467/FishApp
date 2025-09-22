import { StyleSheet, View } from 'react-native'; // ✅ View는 여기서!

import { Image } from 'expo-image';
import { Link } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <View>
      <ThemedText type="title">ㄹㅇ보이네 ✅</ThemedText>
    </View>
  );
}