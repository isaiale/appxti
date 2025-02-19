// Archivo global para definir colores en React Native
// Disponible en toda la app sin necesidad de importarlo manualmente

import { Appearance } from "react-native";

const lightTheme = {
  primary: "#007BFF",  // color azul
  colorPrincipal: "#007BFF", //color azul para botones o fondos principal de app
  textColor: "#FFF",   //color blanco
  primaryDark: "#0056b3",
  secondary: "#FFC107",
  secondaryDark: "#E0A800", 
  textPrimary: "#000000",   //color negro
  textSecondary: "#666666",
  backgroundLight: "#FFFFFF", //color blanco
  backgroundDark: "#F5F5F5",  //color un gris bajo
  textColorSeundario: "#FFA500",  //color naranja
  error: "#DC3545",
  success: "#28A745",
};

const darkTheme = {
  primary: "#1E90FF",
  colorPrincipal: "#007BFF", //color azul
  textColor: "#FFF",   //color azul
  primaryDark: "#104E8B",
  secondary: "#FFD700",
  secondaryDark: "#DAA520",
  textPrimary: "#FFFFFF",
  textSecondary: "#AAAAAA",
  backgroundLight: "#121212",
  backgroundDark: "#1E1E1E",
  error: "#FF6B6B",
  success: "#3CB371",
};

const colorScheme = Appearance.getColorScheme(); // Detecta el tema del sistema

// Asignamos los colores globalmente
global.Colors = colorScheme === "dark" ? darkTheme : lightTheme;

export default global.Colors;
