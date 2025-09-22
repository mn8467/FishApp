import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { ThemedText } from "@/components/themed-text";

export default function HomeScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api", {
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        console.error("API 요청 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText>불러오는 중...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title">응답:</ThemedText>
      <ThemedText>{JSON.stringify(data)}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});