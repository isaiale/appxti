import React, { useState } from "react";
import Colors from "../config/global_colors";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

/**
 * Componente reutilizable para mostrar una tarjeta promocional interactiva.
 * @param {string} title - Título del encabezado (Ej. "Envío gratis").
 * @param {string} subtitle - Subtítulo (Ej. "Free Delivery").
 * @param {string} expiryDate - Fecha de vencimiento (Ej. "Vence: 14/02/2025").
 * @param {string} description - Descripción detallada.
 * @param {function} onPressButton - Acción al presionar el botón "Pedir ahora".
 * @param {object} logo - Imagen del logo de la empresa (URI o require).
 */
const PromoCard = ({
  title = "",
  subtitle = "",
  expiryDate = "",
  description = "",
  onPressButton,
  logo,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Función para truncar el texto a 20 caracteres
  const truncateText = (text, maxLength = 24) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <View style={styles.card}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {logo && (
            <Image
              source={{ uri: logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <Text
            style={styles.headerText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {truncateText(title)}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onPressButton}>
          <Text style={styles.buttonText}>Pedir ahora</Text>
        </TouchableOpacity>
      </View>

      {/* Línea punteada con semicírculos */}
      <View style={styles.dashedContainer}>
        <View style={[styles.circle, styles.circleLeft]} />
        <View style={styles.dashedLine} />
        <View style={[styles.circle, styles.circleRight]} />
      </View>

      {/* Contenido expandible */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.expiryDate}>{expiryDate}</Text>
        {isExpanded && <Text style={styles.description}>{description}</Text>}
      </View>

      {/* Botón para expandir/colapsar */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Icon
          name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color="#AAA"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: "center",
    elevation: 4, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1, // Permite que el texto se ajuste sin empujar el botón
  },
  headerText: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginLeft: 10,
    flexShrink: 1, // Permite que el texto se ajuste sin empujar el botón
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  button: {
    borderWidth: 1.5,
    backgroundColor: Colors.textColor,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  dashedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    position: "absolute",
  },
  circleLeft: {
    left: -25,
    top: "50%",
    transform: [{ translateY: -15 }],
  },
  circleRight: {
    right: -25,
    top: "50%",
    transform: [{ translateY: -15 }],
  },
  dashedLine: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#666",
    borderStyle: "dashed",
  },
  content: {
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  expiryDate: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
  toggleButton: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default PromoCard;