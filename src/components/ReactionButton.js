import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ReactionButton = ({ type, onPress, active }) => {

  // Configuración de iconos y colores según el tipo de reacción
  const reactionConfig = {
    like: { icon: "thumbs-up", color: "blue" },
    dislike: { icon: "thumbs-down", color: "gray" },
    love: { icon: "heart", color: "red" },
  };

  const { icon, color } = reactionConfig[type] || { icon: "help", color: "#ccc" };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: active ? color : "#ccc",
          backgroundColor: active ? `${color}20` : "transparent", // Fondo translúcido si está activo
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={24} color={active ? color : "#ccc"} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReactionButton;
