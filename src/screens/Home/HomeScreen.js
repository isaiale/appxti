import React, { useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import ImageSlider from "../../components/ImageBanner";
import NavigationCard from "../../components/NavigationCard";
import { FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import CustomText from "../../components/CustomText";
import imgpost from "../../../assets/posts.png";
import imgdescuentos from "../../../assets/descuentos.png";
import imgajustes from "../../../assets/ajustes.png";

const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}> 
        <View style={styles.imageContainer}>
          <Image source={{uri: user?.foto_perfil || "https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg"}} style={styles.image}/>
        </View>
        <CustomText /* style={{color: "white"}} */ variant="title">{`${user?.nombre || "Nombre"} ${user?.a_paterno || "Apellido"}`}</CustomText>
        <View style={styles.phoneContainer}>
          <FontAwesome name="phone" size={20} color="black" />
          <CustomText variant="subtitle"> {user?.telefono || "No proporcionado"}</CustomText>
        </View>
      </View>

      {/* Primera fila con 2 elementos */}
      <View style={styles.row}>
        <NavigationCard icon="newspaper-o" text={`Noticias ${user?.nombre_partido || ''}`} route="News" largo={205} ancho={110} iconSize={50} textSize={16}/>
        <NavigationCard icon="exclamation-circle" text="Reportes" route="News" largo={205} ancho={110} iconSize={50}/>
      </View>

      {/* Segunda fila con 3 elementos */}
      <View style={styles.row}>
        <NavigationCard  image={imgdescuentos} text="Promociones" route="Promociones" largo={130} ancho={120} textSize={15}/>
        <NavigationCard image={imgajustes} text="Directorio servicios" route="DirectorioScreen" largo={130} ancho={120} textSize={15}/>
        <NavigationCard image={imgpost} text="Conectate" route="Posts" largo={130} ancho={120} textSize={15}/>
      </View>

      {/* Tercera fila con 3 elementos */}
      <View style={styles.row}>
      <NavigationCard image={user?.logo_partido} icon={!user ? "user-plus" : null} text="Afiliarse" route="AfiliateScreen" largo={130} ancho={120} textSize={15}/>
        <NavigationCard icon="mobile" text="Recargas" route="PlansDatos" largo={130} ancho={120} textSize={15}/>
        <NavigationCard icon="credit-card" text="Consultar saldo" route="DetallePlanActivo" largo={130} ancho={120} textSize={15}/>
      </View>

      <View style={styles.contentSlider}>
        <ImageSlider />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // backgroundColor: "#FF0000",
    paddingTop: 20,
  },
  containerInfo: {
    alignItems: "center",
    marginBottom: 10,
    // backgroundColor: "white",
    padding: 20,
    // borderRadius: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10, // Espacio entre filas
  },
  contentSlider: {
    position: "absolute",
    bottom: 0,
    width: "93%",
    marginBottom: 40,
  },
});

export default HomeScreen;
