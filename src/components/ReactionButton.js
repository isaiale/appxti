import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ReactionButton = ({ type, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  // Configuración de iconos y colores según el tipo
  const reactionConfig = {
    like: { icon: "thumbs-up", color: "blue" },
    dislike: { icon: "thumbs-down", color: "gray" },
    love: { icon: "heart", color: "red" },
  };

  const { icon, color } = reactionConfig[type] || {
    icon: "help",
    color: "#ccc",
  };

  const handlePress = () => {
    setIsPressed(!isPressed);
    onPress && onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: isPressed ? color : "#ccc",
          backgroundColor: isPressed ? `${color}20` : "transparent", // Fondo translúcido al presionar
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={24} color={isPressed ? color : "#ccc"} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
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
