import { StyleSheet } from "react-native";


export const snackbarStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1E90FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  snackbar: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
  },
  snackbarText: {
    color: "#fff",
  },
  
});