import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const DesignCard = ({ title, color = "#F0F0F0", imageSource, navigationTarget }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(navigationTarget.screen, navigationTarget.params)}>
      <View style={[styles.card, { backgroundColor: color }]}>
        {imageSource && <Image source={imageSource} style={styles.image} />}
        <View>
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 11,
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: "center",
    elevation: 4, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default DesignCard;
