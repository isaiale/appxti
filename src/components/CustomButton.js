import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Componente reutilizable para botones interactivos con iconos en React Native.
 * @param {string} title - Texto del botón.
 * @param {function} onPress - Función a ejecutar al presionar el botón.
 * @param {string} color - Color base del botón.
 * @param {string} textColor - Color del texto.
 * @param {object} style - Estilos personalizados adicionales.
 * @param {string} icon - Nombre del icono de Ionicons.
 * @param {string} iconPosition - Posición del icono ("left" o "right").
 * @param {number} iconSize - Tamaño del icono (por defecto 20).
 * @param {boolean} loading - Indica si el botón debe mostrar un spinner de carga.
 */

const CustomButton = ({
  title,
  onPress,
  color = "transparent", // Fondo transparente si no se asigna color
  textColor = "#000", // Texto negro por defecto
  style,
  icon,
  iconPosition = "left",
  iconSize = 20,
  loading = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: color === "transparent" ? "#FFF" : color,
          borderColor: color === "transparent" ? "#000" : color,
          borderWidth: 2,
          opacity: loading ? 0.7 : 1,
        },
        isPressed && { backgroundColor: "#F5F5F5" }, // Efecto al presionar
        style,
      ]}
      activeOpacity={0.8}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={!loading ? onPress : null} // Deshabilitar si está cargando
      disabled={loading} // Evita múltiples clics
    >
      <View style={styles.content}>
        {icon && iconPosition === "left" && !loading && (
          <Ionicons name={icon} size={iconSize} color={textColor} style={styles.icon} />
        )}
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        )}
        {icon && iconPosition === "right" && !loading && (
          <Ionicons name={icon} size={iconSize} color={textColor} style={styles.icon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginHorizontal: 5,
    fontSize: 25,
    marginLeft: -5,
  },
});

export default CustomButton;
