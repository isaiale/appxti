import React, { useState } from "react";
import { TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Usa esto si tienes Expo, si no instala react-native-vector-icons

const CustomTextInput = ({ placeholder, value, onChangeText, type = "text" }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case "email":
        return "email-address";
      case "number":
        return "numeric";
      case "password":
        return "default"; // No hay un tipo específico para contraseña, pero se oculta el texto
      default:
        return "default"; // Texto normal
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={getKeyboardType()}
        secureTextEntry={type === "password" && !isPasswordVisible} // Oculta solo si es contraseña y no está visible
      />
      {type === "password" && (
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="gray"
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1, // Permite que el input ocupe todo el espacio disponible
    fontSize: 16,
    borderRadius: 50,
  },
  icon: {
    marginLeft: 10,
  },
});

export default CustomTextInput;
