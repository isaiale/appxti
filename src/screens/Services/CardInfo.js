import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import whatsappIcon from "../../../assets/whatsapp.png";
import user from "../../../assets/user.png";
const { width } = Dimensions.get("window");

const CardInfo = ({ nombre, ubicacion, imagenSrc, rating='0.0', onPress }) => {       

  return (
    <View style={styles.card}>
      <Image source={imagenSrc ? { uri: imagenSrc }: user } style={styles.imagen} />
      <View style={styles.leftContent}>
        <View style={styles.textContainer}>
          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.ubicacion}>
            <Icon name="map-marker" size={14} color="#007AFF" /> {ubicacion}
          </Text>
          <View style={styles.rating}>
            {/* <Icon name="star" size={16} color="gold" />
            <Text style={styles.ratingText}>{rating}</Text> */}
          </View>
        </View>
      </View>
      <View style={styles.rightContent}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          {/* <Icon name="info-circle" size={20} color="#007AFF" /> */}
          <Image source={whatsappIcon} style={styles.imagenwhatss} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 8,
    alignItems: "center",
    justifyContent: "space-between",
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
  leftContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ubicacion: {
    fontSize: 14,
    color: "#888888",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 15,
  },
  imagenwhatss: {
    width: 50,
    height: 50,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 4,
  },
  button: {
    padding: 1,
  },
});

export default CardInfo;
