import React from "react";
import { View, StyleSheet, Image } from "react-native";
import logoinicio from "../../../assets/logoinicio.png";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Image source={logoinicio} style={styles.logo} />;
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <CustomText variant="screenTitle" style={styles.welcomeText}>
          Bienvenido
        </CustomText>
        <CustomText variant="description" style={styles.description}>
          Inicia sesión o crea una cuenta para comenzar tu experiencia única con
          nosotros.
        </CustomText>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Iniciar sesión"            
            color="#007BFF"
            textColor="#FFF"
            onPress={() => navigation.navigate("Login")}
          />
          <CustomButton
            title="  Registrarse  "            
            onPress={() => navigation.navigate("Register")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
    backgroundColor: "#007BFF",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF",
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 40,
    // marginBottom: 10,
  },
  bottomSection: {
    flex: 1,
    // backgroundColor: '#FFC107',
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    justifyContent: "center",
  },
  welcomeText: {
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
    marginBottom: 60,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default WelcomeScreen;
