import React, { useState, useContext } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { registerForPushNotificationsAsync } from "../../utils/notificationsPush";
import { AuthContext } from "../../context/AuthContext";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import { decodeToken } from "react-jwt";
import CustomModal from "../../components/CommentsModal";
import { baseURL } from "../../services/url";

const LoginScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const buttons = [
    {
      label: "Número telefono",
      onPress: () => {
        setModalVisible(false); // Cierra el modal
        navigation.navigate("ForgotPassword", { option: 1 });
      },
      color: "#007BFF",
      textColor: "#FFF",
    },
    {
      label: "Correo electronico",
      onPress: () => {
        setModalVisible(false); // Cierra el modal
        navigation.navigate("ForgotPassword", { option: 2 });
      },
      color: "#FFF",
      textColor: "black",
      // icon: "star-outline", // Icono opcional
    },   
  ];

  const handleLogin = async () => {
    try {
      // Obtener el token de notificaciones push
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        Alert.alert("Error", "No se pudo registrar el token de notificación");
        return;
      }

      // Autenticación del usuario
      const response = await fetch(`${baseURL}/userspartido/login`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono, password }),
      });

      if (!response.ok) {
        const errorText = await response.json();
        Alert.alert("Error de autenticación", `${errorText.message}`);
        return;
      }

      const data = await response.json();
      console.log(data.message);

      // Decodificar el token JWT
      if (data.token) {
        try {
          const decodedToken = decodeToken(data.token);
          console.log("Decoded token:", decodedToken); // Para depuración
          login(decodedToken); // Guardar el usuario en el contexto de autenticación

          // Registrar el token de notificación en el servidor
          const userId = decodedToken.id; // Obtener el ID del usuario del token decodificado
          const registerResponse = await fetch(
            `${baseURL}/notifications/register-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId, token }),
            }
          );

          if (!registerResponse.ok) {
            const errorText = await registerResponse.json();
            console.log("Error de autenticación", `${errorText.message}`);
            return;
          }

          console.log("Token de notificación registrado exitosamente");

          Alert.alert("Éxito", "Inicio de sesión exitoso");
          navigation.navigate("Drawer"); // Navegar a la pantalla principal
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          throw new Error("Token inválido");
        }
      } else {
        throw new Error("Token faltante en la respuesta");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      console.log(data.message);
      Alert.alert(
        "Error",
        `Hubo un problema al iniciar sesión: ${error.message}`
      );
    }
  };

  return (
    <View style={styles.container}>
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
          <CustomText
            style={styles.Textregister}
            variant="label"
            onPress={() => navigation.navigate("Register")}
          >
            Registrar
          </CustomText>
        </View>
        <CustomText variant="screenTitle" style={styles.title}>
          Loguin
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
          // onPress={() => navigation.navigate("ForgotPassword")}
          onPress={() => setModalVisible(true)}
          variant="link"
        >
          Forgot Password?
        </CustomText>
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          showComments={false} // Asegúrate de que solo se muestren los botones
          buttons={buttons}
        />
        <CustomButton
          title="Iniciar sesión"
          color="#007BFF"
          textColor="#FFF"
          onPress={handleLogin}
        />
      </View>
    </View>
  );
};

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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 20,
  },
});

export default LoginScreen;

/* 
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {    
    color: 'white',
  },
  backIcon: {
    marginLeft: -5,
  },
  registerText: {
    color: "#000",
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
  },
  forgotText: {
    color: "#007BFF",
    fontSize: 14,
  },
});

*/
