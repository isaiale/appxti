import React, { useContext } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import CustomText from "./CustomText";
import Icon from "react-native-vector-icons/Ionicons";

const DrawerContent = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    // navigation.navigate("AuthStack");
    navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack" }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Perfil del Usuario */}
      <View style={styles.profile}>
        <Image
          source={{
            uri: user?.foto_perfil || "https://via.placeholder.com/150",
          }}
          style={styles.image}
        />
        <CustomText variant="title" style={styles.username}>
          {`${user?.nombre || "Guest"} ${user?.a_paterno || ""}`}
        </CustomText>
        <CustomText variant="caption" style={styles.email}>
          { "Hola, bienvenido!"}        
        </CustomText>

      </View>

      {/* Línea divisoria */}
      <View style={styles.divider} />

      {/* Menú de Opciones */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="home-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Inicio</CustomText>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("News")}
        >
          <Icon name="newspaper-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Noticias</CustomText>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Posts")}
        >
          <Icon name="create-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Posts</CustomText>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Promociones")}
        >
          <Icon name="pricetags-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Promociones</CustomText>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("PlansDatos")}
        >
          <Icon name="football-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Plans</CustomText>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Training")}
        >
          <Icon name="barbell-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Training</CustomText>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("PlansDatos")}
        >
          <Icon name="grid-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Plans</CustomText>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("DetalleUserService")}
        >
          <Icon name="heart-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>My Favorites</CustomText>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Icon name="person-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Perfil</CustomText>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ReportUser")}
        >
          <Icon name="settings-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Settings</CustomText>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("SolicitudServicio")}
        >
          <Icon name="create-outline" size={20} color="#000" />
          <CustomText style={styles.menuText}>Solicitud de Servicio</CustomText>
        </TouchableOpacity>
      </View>

      {/* Botón de Logout en la parte inferior */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="red" />
          <CustomText style={[styles.menuText, { color: "red" }]}>Logout</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
  },
  profile: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#000",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
  },
  logoutContainer: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default DrawerContent;
