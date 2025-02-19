import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

/**
 * Componente reutilizable para manejar diferentes tipos de texto en la app.
 * @param {string} children - Contenido del texto.
 * @param {string} variant - Define el estilo del texto (title, screenTitle, subtitle, description, caption, label, link, error).
 * @param {object} style - Estilos personalizados adicionales.
 * @param {function} onPress - Función opcional para hacer el texto interactivo.
 */

const CustomText = ({ children, variant = "body", style, onPress }) => {
  const textStyle = [styles[variant], style];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text style={textStyle}>{children}</Text>
      </TouchableOpacity>
    );
  }

  return <Text style={textStyle}>{children}</Text>;
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "justify",
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    color: "#888",
    textAlign: "left",
    fontStyle: "italic",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    textTransform: "uppercase",
  },
  body: {
    fontSize: 16,
    color: "#000",
    textAlign: "left",
  },
  link: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  error: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },
});

export default CustomText;
