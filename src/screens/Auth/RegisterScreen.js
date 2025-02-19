import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [apellido_paterno, setApellido_paterno] = useState("");
  const [apellido_materno, setApellido_materno] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log("Registrar:", name, email, password);
    // Agregar lógica de registro aquí
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* parte superior de la appp */}
        <View style={styles.topSection}>
          <View style={styles.topRow}>
            <CustomText variant="title" onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backIcon}
              />
            </CustomText>
            {/* <CustomText
                style={styles.Textregister}
                variant="label"
                onPress={() => navigation.navigate("Register")}
              >
                Registrar
              </CustomText> */}
          </View>
          <CustomText variant="screenTitle" style={styles.title}>
            Registrar
          </CustomText>
        </View>

        <View style={styles.bottomSection}>
          <CustomText variant="subtitle" style={styles.registerText}>
            {" "}
            Nombre:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu nombre..."
            value={name}
            onChangeText={setName}
            type="default"
          />
          <CustomText variant="subtitle" style={styles.registerText}>
            {" "}
            Contraseña:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu apellido paterno"
            value={apellido_paterno}
            onChangeText={setApellido_paterno}
            type="default"
          />
          <CustomText variant="subtitle" style={styles.registerText}>
            {" "}
            Telefono:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu apellido materno"
            value={apellido_materno}
            onChangeText={setApellido_materno}
            type="default"
          />
          <CustomText variant="subtitle" style={styles.registerText}>
            {" "}
            Contraseña:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu telefono"
            value={telefono}
            onChangeText={setTelefono}
            type="number"
          />
          <CustomText variant="subtitle" style={styles.registerText}>
            {" "}
            Contraseña:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu correo"
            value={email}
            onChangeText={setEmail}
            type="email"
          />
          <CustomText variant="subtitle" style={styles.registerText}>
            {" "}
            Contraseña:
          </CustomText>
          <CustomTextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            type="password"
          />

          <CustomButton
            style={styles.buttonregister}
            title="Registrar"
            color="#007BFF"
            textColor="#FFF"
            onPress={handleRegister}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007BFF",
  },
  topSection: {
    flex: 1,
    backgroundColor: "#007BFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: "flex-start", // Asegura que los elementos comiencen desde arriba
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    marginTop: 70, // Agrega espacio debajo del primer `View` (topRow)
    // fontSize: 24,
    fontWeight: "bold",
    // color: "white",
    textAlign: "center",
  },
  backIcon: {
    marginLeft: -5,
  },
  registerText: {
    // color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  Textregister: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  bottomSection: {
    flex: 2,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 60,
  },
  buttonregister: {
    marginBottom: 20,
    marginTop: 20,
  },
});
