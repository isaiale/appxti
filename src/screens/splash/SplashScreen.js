import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../../context/AuthContext";

const SplashScreen = ({ navigation }) => {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      // Redirige según el estado del usuario
      navigation.replace(user ? "Drawer" : "AuthStack");
    }
  }, [loading, user, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>XTI</Text>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Cargando, por favor espera...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { fontSize: 40, fontWeight: "bold", marginBottom: 20 },
  loadingText: { fontSize: 16, marginTop: 10, color: "#666" },
});

export default SplashScreen;
