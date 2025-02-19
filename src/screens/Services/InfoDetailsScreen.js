import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import user from "../../../assets/user.png";

const InfoDetailsScreen = () => {

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Imagen principal */}
        <Image source={user} style={styles.image} resizeMode="contain" />

        {/* Información del servicio */}
        <View style={styles.userInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>Electricista</Text>
            {/* <Text style={styles.rating}>
              <Icon name="star" size={20} color="gold" /> 4.5
            </Text> */}
          </View>
          <Text style={styles.detailsText}>Juan Manuel Hernandez</Text>
          <Text style={styles.description}>
            Electricista confiable para tu hogar o negocio. Instalaciones,
            reparaciones y emergencias.
          </Text>

          <View style={styles.detailsContainer}>
            <Icon name="map-marker" size={25} color="#007AFF" style={styles.icon} />
            <Text style={styles.detailsText}>Av. Principal, Monterrey</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botones en la parte inferior */}
      <View style={styles.buttonsContainer}>
        {/* <TouchableOpacity style={styles.addRatingButton} onPress={handleAddRating}>
          <Text style={styles.buttonText}>Agregar Calificación</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.enviarMensaje}
          onPress={() => Alert.alert("Enviar mensaje")}
        >
          <Icon name="whatsapp" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 400,    
  },
  userInfo: {
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 18,
    color: "black",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  detailsText: {
    fontSize: 25,
    marginLeft: 5,
  },
  description: {
    fontSize: 18,
    lineHeight: 25,
    marginVertical: 10,
  },
  buttonsContainer: {
    flex: 1,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  addRatingButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    // flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  enviarMensaje: {
    backgroundColor: "#25D366",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    // width: 60,
  },
});

export default InfoDetailsScreen;
