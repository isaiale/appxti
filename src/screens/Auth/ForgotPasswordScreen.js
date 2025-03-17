import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { View, TextInput, StyleSheet, Alert } from "react-native";
import Colors from "../../config/global_colors";
import { useNavigation } from "@react-navigation/native";
import { baseURL } from "../../services/url";
import NetInfo from "@react-native-community/netinfo";

const PasswordRecovery = ({ route }) => {
  const [step, setStep] = useState(1); // 1: Recovery, 2: Code Verification, 3: Reset Password
  const [input, setInput] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { option } = route.params; // 1: Phone, 2: Email
  const navigation = useNavigation();

  const handleNextStep = () => {
    if (step === 1) {
      if (!input) {
        Alert.alert(
          "Error",
          `Por favor ingresa tu ${
            option === 1 ? "número de teléfono" : "correo electrónico"
          }`
        );
        return;
      }

      setLoading(true); // Activar el estado de carga

      const state = NetInfo.fetch();
      if (!state.isConnected) {
        setLoading(false);
        Alert.alert("Error", "No hay conexión a internet.");
        return;
      }

      // Construcción del cuerpo de la solicitud
      const requestBody =
        option === 1
          ? { telefono: input, method: 1 } // Envío por mensaje
          : { email: input, method: 2 }; // Envío por correo

      // Realizar la solicitud POST
      fetch(`${baseURL}/userspartido/recover-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            Alert.alert("Éxito", "Código de verificación enviado.");
            setStep(2); // Avanzar al siguiente paso
          } else {
            Alert.alert(
              "Error",
              data.message || "Ocurrió un error al enviar el código."
            );
          }
        })
        .catch((error) => {
          console.error("Error en la recuperación de contraseña:", error);
          Alert.alert(
            "Error",
            "No se pudo procesar la solicitud. Intenta de nuevo."
          );
        })
        .finally(() => {
          setLoading(false); // Desactivar el estado de carga
        });
    } else if (step === 2) {
      if (code.some((digit) => digit === "")) {
        Alert.alert("Error", "Por favor ingresa el código.");
        return;
      }

      setLoading(true); // Activar el estado de carga

      const state = NetInfo.fetch();
      if (!state.isConnected) {
        setLoading(false);
        Alert.alert("Error", "No hay conexión a internet.");
        return;
      }

      // Construcción del cuerpo de la solicitud
      const requestBody =
        option === 1
          ? { telefono: input, token: code.join("") } // Validar por teléfono
          : { email: input, token: code.join("") }; // Validar por correo

      // Realizar la solicitud POST a /validate-token
      fetch(`${baseURL}/userspartido/validate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            Alert.alert(
              "Éxito",
              "Código verificado. Procede a cambiar tu contraseña."
            );
            setStep(3); // Avanzar al siguiente paso
          } else {
            Alert.alert("Error", data.message || "Código inválido o expirado.");
          }
        })
        .catch((error) => {
          console.error("Error al validar el token:", requestBody, error);
          Alert.alert(
            "Error",
            "No se pudo procesar la validación token. Intenta de nuevo."
          );
        })
        .finally(() => {
          setLoading(false); // Desactivar el estado de carga
        });
    } else if (step === 3) {
      if (!password || !confirmPassword) {
        Alert.alert("Error", "Llena los campos.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden o son inválidas.");
        return;
      }

      setLoading(true); // Activar el estado de carga

      const state = NetInfo.fetch();
      if (!state.isConnected) {
        setLoading(false);
        Alert.alert("Error", "No hay conexión a internet.");
        return;
      }

      // Construcción del cuerpo de la solicitud
      const requestBody =
        option === 1
          ? { telefono: input, nueva_contraseña: password } // Cambio por teléfono
          : { email: input, nueva_contraseña: password }; // Cambio por correo

      // Realizar la solicitud POST a /change-password
      fetch(`${baseURL}/userspartido/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            Alert.alert(
              "Éxito",
              "La contraseña ha sido restablecida correctamente."
            );
            navigation.navigate("Login"); // Avanzar a la pantalla de éxito o login
          } else {
            Alert.alert(
              "Error",
              data.message || "Ocurrió un error al restablecer la contraseña."
            );
          }
        })
        .catch((error) => {
          console.error("Error al cambiar la contraseña:", error);
          Alert.alert(
            "Error",
            "No se pudo procesar la solicitud. Intenta de nuevo."
          );
        })
        .finally(() => {
          setLoading(false); // Desactivar el estado de carga
        });
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <View>
          <CustomText variant="title">Recuperación de Contraseña</CustomText>
          <CustomText variant="subtitle">
            Ingresa tu{" "}
            {option === 1 ? "número de teléfono" : "correo electrónico"} para
            recuperar tu contraseña.
          </CustomText>
          {option === 1 ? (
            <CustomTextInput
              placeholder={
                option === 1 ? "Número de teléfono" : "Correo electrónico"
              }
              value={input}
              onChangeText={setInput}
              type="number"
            />
          ) : (
            <CustomTextInput
              placeholder={
                option === 1 ? "Número de teléfono" : "Correo electrónico"
              }
              value={input}
              onChangeText={setInput}
              type="email"
            />
          )}
          <CustomButton
            title="Recuperar contraseña"
            onPress={handleNextStep}
            color={Colors.textColorSeundario}
            textColor={Colors.textColor}
            loading={loading}
          />
        </View>
      );
    } else if (step === 2) {
      return (
        <View>
          <CustomText variant="title">
            Revisa tu {option === 1 ? "teléfono" : "correo electrónico"}
          </CustomText>
          <CustomText variant="subtitle">
            Hemos enviado un código de 6 dígitos a tu{" "}
            {option === 1 ? "teléfono" : "correo electrónico"}.
          </CustomText>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(text) => {
                  const newCode = [...code];
                  newCode[index] = text;
                  setCode(newCode);
                }}
              />
            ))}
          </View>
          <CustomButton
            title="Verificar"
            /* icon="create-outline" */
            onPress={handleNextStep}
            color={Colors.textColorSeundario}
            textColor={Colors.textColor}
            loading={loading}
          />
        </View>
      );
    } else if (step === 3) {
      return (
        <View>
          <CustomText variant="title">Restablecer tu contraseña</CustomText>
          <CustomText variant="subtitle">
            Por favor, ingresa tu nueva contraseña.
          </CustomText>
          <CustomTextInput
            placeholder="Nueva contraseña"
            value={password}
            onChangeText={setPassword}
            type="password"
          />
          <CustomTextInput
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            type="password"
          />
          <CustomButton
            title="Hecho"
            onPress={handleNextStep}
            color={Colors.textColorSeundario}
            textColor={Colors.textColor}
            loading={loading}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}></View>
      <View style={styles.bottomSection}>{renderStep()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FOFOFO",
  },
  topSection: {
    flex: 1,
    justifyContent: "flex-start", // Asegura que los elementos comiencen desde arriba
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    width: 60,
    height: 60,
    textAlign: "center",
    fontSize: 20,
  },
  bottomSection: {
    flex: 3,
    // backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingTop: 50,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // marginTop: 60,
  },
});

export default PasswordRecovery;
