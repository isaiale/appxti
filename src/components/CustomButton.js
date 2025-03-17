import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomButton = ({
  title,
  onPress,
  color = "transparent",
  textColor = "#000",
  style,
  icon,
  iconPosition = "left",
  iconSize = 20,
  loading = false,
  disabled = false, // Agregamos la propiedad disabled con un valor por defecto de false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const buttonColor = disabled ? 'lightgray' : (color === "transparent" ? "#FFF" : color); //Cambio de color si esta desabilitado
  const buttonBorderColor = disabled ? 'gray' : (color === "transparent" ? "#000" : color); //Cambio de borde si esta desabilitado
  const buttonOpacity = loading || disabled ? 0.7 : 1; //Opacidad si esta cargando o desabilitado

  const handlePress = () => {
    if (!loading && !disabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColor,
          borderColor: buttonBorderColor,
          borderWidth: 2,
          opacity: buttonOpacity,
        },
        isPressed && !disabled && { backgroundColor: "#F5F5F5" }, // Efecto al presionar (no si disabled)
        style,
      ]}
      activeOpacity={0.8}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={handlePress}
      disabled={loading || disabled} // Deshabilita si loading o disabled son true
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