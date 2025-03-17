import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import CustomCheckbox from "../../components/CustomCheckbox";
import Colors from "../../config/global_colors";
import { baseURL } from "../../services/url";
import NetInfo from "@react-native-community/netinfo";
import {
  validateName,
  validateApellidoPaterno,
  validateApellidoMaterno,
  validateFechaNacimiento,
  validateSexo,
  validateTelefono,
  validateEmail,
  validatePassword,
} from "../../utils/validations"; // Importa las validaciones

const API_URL = `${baseURL}/userspartido/register`;

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [apellido_paterno, setApellido_paterno] = useState("");
  const [apellido_materno, setApellido_materno] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificar si todos los campos son válidos
  const isFormValid = () => {
    return (
      validateName(name) &&
      validateApellidoPaterno(apellido_paterno) &&
      validateApellidoMaterno(apellido_materno) &&
      validateFechaNacimiento(fechaNacimiento) &&
      validateSexo(sexo) &&
      validateTelefono(telefono) &&
      validateEmail(email) &&
      validatePassword(password)
    );
  };

  // Función para registrar usuario
  const handleRegister = async () => {
    if (!isFormValid()) {
      Alert.alert("Error", "Por favor, completa todos los campos correctamente.");
      return;
    }

    setLoading(true);

    const userData = {
      nombre: name,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento: fechaNacimiento,
      sexo: parseInt(sexo),
      correo: email,
      telefono,
      contraseña: password,
    };

    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        Alert.alert("Error", "No hay conexión a internet");
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("data: ", data);

      if (response.ok) {
        Alert.alert("Registro exitoso", "El usuario ha sido registrado correctamente.");
        navigation.navigate("Login"); // Redirige a la pantalla de login
      } else {        
        Alert.alert("Error", data?.message ?? "No se pudo completar el registro.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          <CustomText variant="screenTitle" style={styles.title}>
            Registrar
          </CustomText>
        </View>

        <View style={styles.bottomSection}>
          {/* Campos del formulario con validaciones */}
          <CustomText variant="subtitle" style={styles.registerText}>
            Nombre:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu nombre..."
            value={name}
            onChangeText={setName}
          />
          {!validateName(name) && name.trim() !== "" && (
            <CustomText style={styles.errorText}>
              El nombre debe contener solo letras y al menos dos palabras.
            </CustomText>
          )}

          <CustomText variant="subtitle" style={styles.registerText}>
            Apellido paterno:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu apellido paterno"
            value={apellido_paterno}
            onChangeText={setApellido_paterno}
          />
          {!validateApellidoPaterno(apellido_paterno) && apellido_paterno.trim() !== "" && (
            <CustomText style={styles.errorText}>
              El apellido debe contener solo letras y al menos dos palabras.
            </CustomText>
          )}

          <CustomText variant="subtitle" style={styles.registerText}>
            Apellido materno:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu apellido materno"
            value={apellido_materno}
            onChangeText={setApellido_materno}
          />
          {!validateApellidoMaterno(apellido_materno) && apellido_materno.trim() !== "" && (
            <CustomText style={styles.errorText}>
              El apellido debe contener solo letras y al menos dos palabras.
            </CustomText>
          )}

          <CustomText variant="subtitle" style={styles.registerText}>
            Fecha de nacimiento (YYYY-MM-DD):
          </CustomText>
          <CustomTextInput
            placeholder="2001-10-15"
            value={fechaNacimiento}
            onChangeText={setFechaNacimiento}
            type="number"
          />
          {!validateFechaNacimiento(fechaNacimiento) && fechaNacimiento !== "" && (
            <CustomText style={styles.errorText}>
              Formato inválido o debes ser mayor de 18 años.
            </CustomText>
          )}

          <CustomText variant="subtitle" style={styles.registerText}>
            Selecciona tu sexo:
          </CustomText>
          <View style={styles.sexoContainer}>
            <CustomCheckbox
              label="Hombre"
              isChecked={sexo === "1"}
              onChange={() => setSexo("1")}
            />
            <CustomCheckbox
              label="Mujer"
              isChecked={sexo === "0"}
              onChange={() => setSexo("0")}
            />
          </View>
          {!validateSexo(sexo) && (
            <CustomText style={styles.errorText}>Selecciona un sexo.</CustomText>
          )}

          <CustomText variant="subtitle" style={styles.registerText}>
            Teléfono:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu teléfono"
            value={telefono}
            onChangeText={setTelefono}
            type="number"
          />
          {!validateTelefono(telefono) && telefono !== "" && (
            <CustomText style={styles.errorText}>El teléfono debe tener 10 dígitos.</CustomText>
          )}

          <CustomText variant="subtitle" style={styles.registerText}>
            Correo:
          </CustomText>
          <CustomTextInput
            placeholder="Ingresa tu correo"
            value={email}
            onChangeText={setEmail}
            type="email"
          />
          {!validateEmail(email) && email !== "" && (
            <CustomText style={styles.errorText}>Correo inválido.</CustomText>
          )}

          <CustomText variant="subtitle" style={styles.registerText}>
            Contraseña:
          </CustomText>
          <CustomTextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            type="password"
          />
          {!validatePassword(password) && password !== "" && (
            <CustomText style={styles.errorText}>
              La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
            </CustomText>
          )}

          <CustomButton
            style={styles.buttonregister}
            title="Registrar"
            color={Colors.colorSplash}
            textColor="#FFF"
            onPress={handleRegister}
            loading={loading}
            disabled={!isFormValid()} // Deshabilitar si hay errores
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
    // paddingTop: 10,
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
    marginTop: 5, // Agrega espacio debajo del primer `View` (topRow)
    // fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
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
  sexoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 15,    
  },
  bottomSection: {
    flex: 2,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
  },
  buttonregister: {
    marginBottom: 15,
    marginTop: 10,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 5,
  },
});
