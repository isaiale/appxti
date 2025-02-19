import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

/**
 * Componente reutilizable para una caja de texto destinada a enviar comentarios.
 * @param {string} placeholder - Texto del marcador de posición dentro del input.
 * @param {string} value - Valor del input controlado.
 * @param {function} onChangeText - Función que se ejecuta cuando se cambia el texto del input.
 * @param {function} onSend - Función que se ejecuta al presionar el botón de enviar.
 */
const CommentInput = ({
  placeholder = "Escribe un comentario...",
  value,
  onChangeText,
  onSend,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="white"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Icon name="send-outline" size={25} color="#007BFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 15, 
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    color: "#FFF",
    paddingHorizontal: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
  },
});

export default CommentInput;
