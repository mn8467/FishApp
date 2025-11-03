import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

type Props = { variant?: "inline" | "header" };
export default function Topbar({ variant = "inline" }: Props){
  const [query, setQuery] = useState("");


    return(
   <>
        {/* 검색바 */}
+   <View style={[styles.searchBox, variant === "header" && styles.headerAdjust]}>
        <Ionicons name="search" size={18} color="#9AA0A6" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="검색"
          placeholderTextColor="#9AA0A6"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
    </View>
   </>
    )
}

//css 코드 
const styles = StyleSheet.create({
    wrap: { flex: 1, backgroundColor: "#fff" },
  searchBox: {
    marginHorizontal: 16,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F2F3F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  headerAdjust: {
    marginHorizontal: 0,
    marginBottom: 0,
  },
  searchInput: { flex: 1, fontSize: 15 },
})