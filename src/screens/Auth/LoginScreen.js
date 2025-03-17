import React, { useState, useContext } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { decodeToken } from "react-jwt";
import CustomModal from "../../components/CommentsModal";
import { baseURL } from "../../services/url";
import Colors from "../../config/global_colors";
import NetInfo from "@react-native-community/netinfo";
import { validateTelefono } from "../../utils/validations";

const LoginScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const buttons = [
    {
      label: "Número telefono",
      onPress: () => {
        setModalVisible(false);
        navigation.navigate("ForgotPassword", { option: 1 });
      },
      color: Colors.textColorSeundario,
      textColor: "#FFF",
    },
    {
      label: "Correo electronico",
      onPress: () => {
        setModalVisible(false);
        navigation.navigate("ForgotPassword", { option: 2 });
      },
      color: "#FFF",
      textColor: "black",
    },
  ];

  const handleLogin = async () => {
    if (!telefono || !password) {
      Alert.alert(
        "Error",
        "Por favor ingrese su número de teléfono y contraseña"
      );
      return;
    }

    setLoading(true); // Mostrar el indicador de carga

    try {
      const state = await NetInfo.fetch();
      if(!state.isConnected){
        Alert.alert("Error", "No hay conexión a internet");
        return;
      }
      // Autenticación del usuario
      const response = await fetch(`${baseURL}/userspartido/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono, password }),
      });
      console.log("Login response res:", response); // Para depuración
      const data = await response.json();
      console.log("Login response:", data); // Para depuración

      if (!response.ok) {
        Alert.alert(
          "Error de autenticación",
          data.message || "Error desconocido"
        );
        return;
      }

      if (!data.token) {
        throw new Error("Token faltante en la respuesta");
      }

      // Decodificar el token JWT
      const decodedToken = decodeToken(data.token);
      console.log("Decoded token:", decodedToken); // Para depuración

      login(decodedToken); // Guardar el usuario en el contexto de autenticación

      navigation.navigate("Drawer"); // Navegar después del inicio de sesión exitoso
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      Alert.alert(
        "Error",
        `Hubo un problema al iniciar sesión: ${error.message}`
      );
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  return (
    <View style={styles.container}>
      {/* parte superior de la appp */}
      <View style={styles.topSection}>
        <CustomText variant="screenTitle" style={styles.title}>
          Iniciar sesión
        </CustomText>
      </View>

      <View style={styles.bottomSection}>
        <CustomText variant="subtitle" style={styles.registerText}>
          {" "}
          Telefono:
        </CustomText>
        <CustomTextInput
          placeholder="Telefono"
          value={telefono}
          onChangeText={setTelefono}
          type="number"
        />
        {!validateTelefono(telefono) && telefono !== "" && (
          <CustomText style={styles.errorText}>
            El teléfono debe tener exactamente 10 dígitos.
          </CustomText>
        )}
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
        <CustomText
          style={styles.forgotPassword}
          onPress={() => setModalVisible(true)}
          variant="link"
        >
          ¿Olvidaste tu contraseña?
        </CustomText>
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          showComments={false}
          buttons={buttons}
        />
        <CustomButton
          title="Iniciar sesión"
          color={Colors.colorSplash}
          textColor="#FFF"
          onPress={handleLogin}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorSplash,
  },
  topSection: {
    flex: 1,
    backgroundColor: Colors.colorSplash,
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
  title: {
    marginTop: 70, // Agrega espacio debajo del primer `View` (topRow)
    // fontSize: 24,
    fontWeight: "bold",
    color: "white",
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 5,
  },
});

export default LoginScreen;
