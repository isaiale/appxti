import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  // Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../../config/global_colors";
import CustomButton from "../../components/CustomButton";
import { baseURL } from "../../services/url";

const { width } = Dimensions.get("window");

const CouponCard = ({
  logo,
  brandName,
  title = "",
  description = "",
  details = "",
  idPromocion,
  // barcode = "",
  // expiryDate = "",
  // onShare,
  onInfo,
}) => {
  const [isActive, setIsActive] = useState(false);
  let timer = null;
  let minutos = 10;
  const [timeLeft, setTimeLeft] = useState(minutos * 60); // 10 minutos en segundos
  // console.log("id: ",idPromocion);

  useEffect(() => {
    if (isActive) {
      // Asegurar que no haya intervalos previos corriendo
      clearInterval(timer);
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer); // Detiene el temporizador al llegar a 0
            // console.log(timer);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer); // Limpia el intervalo si se detiene
      // console.log(timer);
    }
    // console.log(timer);
    return () => clearInterval(timer); // Limpieza al desmontar
  }, [isActive]);

  const registrarClick = async () => {
    try {
      const response = await fetch(
        `${baseURL}/promociones/click/${idPromocion}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("click agregado correctamente:", data.message);
      } else {
        Alert.alert("Error", data.message || "Ocurrió un error.");
      }
    } catch (error) {
      console.error("❌ Error al agregar comentario:", error);
      Alert.alert("Error", "No se pudo agregar el comentario.");
    }
  };

  // Función para iniciar/detener el temporizador
  const toggleTimer = () => {
    registrarClick();
    setIsActive((prev) => !prev);
    if (!isActive) {
      setTimeLeft(minutos * 60); // Reiniciar a 10 minutos al iniciar
    }
  };

  // Detener y resetear al salir de la pantalla
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsActive(false);
        setTimeLeft(minutos * 60);
        clearInterval(timer);
      };
    }, [])
  );

  // Formatear el tiempo en mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={styles.card}>
      {/* Logo and Brand Name */}
      <View style={styles.header}>
        <Image
          source={{ uri: logo }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title and Description */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.barcodeContainer}>
          <Text numberOfLines={3} ellipsizeMode="tail">
            {brandName.split(/(\$\d+|%\d+|\d+[%$]?)/).map((part, index) => (
              <Text
                key={index}
                style={
                  /\$\d+|%\d+|\d+[%$]?/.test(part)
                    ? styles.barcodeNumber
                    : styles.barcodeText
                }
              >
                {part}
              </Text>
            ))}
          </Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Details */}
      <View style={styles.details}>
        {/* {details.map((detail, index) => (
          <Text key={index} style={styles.detailItem}>
            • {detail}
          </Text>
        ))} */}
        <Text style={styles.detailItem}>• {details.replace(/\. /g, ".\n• ")}</Text>
      </View>
      <View style={styles.content}>
        <Text style={isActive ? styles.statusActivo : styles.statusInactivo}>
          {isActive ? "Activo" : "Inactivo"}
        </Text>
      </View>

      {/* Barcode Section */}
      <View style={styles.barcodeSection}>
        <View style={[styles.circle, styles.circleLeft]} />
        <View style={styles.dashedLine} />
        <View style={[styles.circle, styles.circleRight]} />
      </View>
      {isActive ? (
        <CustomButton title="Cupon Activo" />
      ) : (
        <CustomButton title="Usar cupon" onPress={toggleTimer} />
      )}
      {/* Footer */}
      <View style={styles.footer}>
        {/* <Text style={styles.expiryDate}>{expiryDate}</Text> */}
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onInfo} style={styles.actionButton}>
            <Icon name="information-circle-outline" size={30} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  logo: {
    width: 160,
    height: 160,
    // borderWidth: 2, // Grosor del borde
  },
  content: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginTop: 30,
    color: "#555",
    textAlign: "center",
  },
  details: {
    marginBottom: 20,
  },
  detailItem: {    
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  barcodeSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  dashedLine: {
    width: "100%",
    height: 1,
    borderWidth: 1,
    borderColor: "#666",
    borderStyle: "dashed",
    marginBottom: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    position: "absolute",
  },
  circleLeft: {
    left: -40,
    top: "50%",
    transform: [{ translateY: -25 }],
  },
  circleRight: {
    right: -40,
    top: "50%",
    transform: [{ translateY: -25 }],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  expiryDate: {
    fontSize: 12,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
  },
  barcodeContainer: {
    alignSelf: "stretch", // Ajustar a la card
    alignItems: "center",
  },
  barcodeText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    flexWrap: "wrap", // Ajustar contenido dentro de la card
  },
  barcodeNumber: {
    fontSize: 18, // Tamaño más grande para números y símbolos
    fontWeight: "bold",
    color: "#40dc24",
  },
  statusInactivo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
  },
  statusActivo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
  },
  timer: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    // marginBottom: 20,
  },
});
export default CouponCard;
