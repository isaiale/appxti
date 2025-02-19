import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const NavigationCard = ({ image, icon, text, route, largo = 110, ancho = 110, textSize=14, iconSize=45 }) => {
  const navigation = useNavigation();
  const cardSize = largo;
  const cardlargo = ancho;  

  return (
    <TouchableOpacity style={[styles.card, { width: cardSize, height: cardlargo }]} onPress={() => navigation.navigate(route)}>
      {image ? (
        <Image source={typeof image === "string" ? { uri: image } : image} style={[styles.image, { width: cardSize * 0.5, height: cardlargo * 0.5 }]} resizeMode="contain" />
      ) : (
        <FontAwesome name={icon} size={iconSize} color="#333" />
      )}
      <Text style={[styles.text, { fontSize: textSize }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding:2,
  },
  image: {
    resizeMode: "contain",
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
});

export default NavigationCard;
