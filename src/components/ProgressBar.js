import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

/**
 * Componente reutilizable de Barra de Progreso con Icono y Texto
 * @param {string} iconName - Nombre del icono de Ionicons (Ejemplo: "battery-charging-outline").
 * @param {string} label - Texto descriptivo superior.
 * @param {number} value - Valor actual del progreso.
 * @param {number} minValue - Valor mínimo.
 * @param {number} maxValue - Valor máximo.
 * @param {string} color - Color de la barra de progreso.
 * @param {string} tipo -para definir que tipo
 */
const ProgressBar = ({ iconName = "", label = "", value = 0, minValue = 0, maxValue = 0, color = "#007BFF", tipo="@" }) => {

  const safeMax = maxValue || 1; // Evitar divisiones por 0
  // console.log("--------------------------------------------------------------------");
  // console.log("safeMax: ",safeMax);
  const safeValue = Math.min(Math.max(value, 0), safeMax); // Limitar a rango válido
  // console.log("safeValue: ", safeValue);
  const progress = useSharedValue((safeValue - 0) / (safeMax - 0) * 100);
  // console.log("progress: ", progress);
  useEffect(() => {
    progress.value = withTiming((safeValue - 0) / (safeMax - 0) * 100, { duration: 500 });
  }, [value, maxValue]);

  // console.log("Valor progreso value", progress.value);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.container}>
      {/* Texto descriptivo */}
      <Text style={styles.label}>{label}</Text>

      {/* Icono + Barra de progreso */}
      <View style={styles.progressContainer}>
        <Icon name={iconName} size={30} color={color} style={styles.icon} />
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, animatedStyle, { backgroundColor: color }]} />
        </View>
      </View>

      {/* Valores extremos */}
      <View style={styles.valuesContainer}>
        <Text style={styles.valueText}>{minValue}</Text>
        <Text style={styles.valueText}>{maxValue} {tipo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
    marginBottom: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    // marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  valuesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },
  valueText: {
    fontSize: 14,
    color: "#666",
  },
});

export default ProgressBar;
