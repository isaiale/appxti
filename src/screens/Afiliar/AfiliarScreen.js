import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import logo from "../../../assets/logoxti.jpg";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { baseURL } from "../../services/url";
import NetInfo from "@react-native-community/netinfo";
import CustomButton from "../../components/CustomButton";

const FormularioInvitacion = () => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comunidad_colonia, setComunidadColonia] = useState("");
  const { user } = useContext(AuthContext);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const codigo_color = user?.codigo_color ?? "#007BFF";

  // Función para enviar los datos a la API
  const handleEnviar = async () => {
    const id_agregador = user.id;
    if (!telefono || !comunidad_colonia || !nombre) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }
    const data = {
      id_agregador,
      nombre,
      comunidad_colonia,
      telefono,
    };

    setLoading(true);

    // Usando fetch
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        Alert.alert("Error", "No hay conexión a internet");
        return;
      }

      const response = await fetch(`${baseURL}/afiliar/agregar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result); // Procesa la respuesta de la API
      if (response.ok) {
        alert("Datos enviados correctamente");
        setNombre("");
        setTelefono("");
        setComunidadColonia("");
        setAgree(false);
        // navigation.goBack();
      } else {
        alert("Hubo un error al enviar los datos");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      alert("Error en la conexión");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.bordeContainer}>
          <Image
            source={user?.logo_partido ? { uri: user.logo_partido } : logo}
            style={styles.imagen}
          />
        </View>
        <View style={styles.contenidotex}> 
          <Text style={styles.secondLine}>
            <Text style={styles.firstLine}>¡Invita</Text> a tus familiares
          </Text>
          <Text style={styles.secondLine}>
            y amigos a formar parte!
          </Text>
        </View>

        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingresa tu nombre completo"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Ingresa tu teléfono"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Colonia / municipio</Text>
        <TextInput
          style={styles.input}
          value={comunidad_colonia}
          onChangeText={setComunidadColonia}
          placeholder="Ingresa colonia o municipio"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAgree(!agree)}
        >
          <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
            {agree && <Ionicons name="checkmark" size={18} color="white" />}
          </View>
          <Text style={styles.checkboxLabel}>
            Acepto enviar la información del contacto
          </Text>
        </TouchableOpacity>

        <CustomButton
        style={styles.button}
          title="ENVIAR"
          color={!agree ? "gray" : codigo_color}
          textColor="#FFF"
          onPress={handleEnviar}
          loading={loading}
          disabled={!agree}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bordeContainer: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    alignSelf: "center",
    margin: 30,
  },
  imagen: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  // title: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   color: "#333",
  //   marginBottom: 20,
  //   textAlign: "center",
  // },
  contenidotex:{
    marginBottom: 40,
  },
  firstLine: {
    fontSize: 24, // Tamaño más grande para "¡Invita"    
    fontWeight: "bold", // Negrita para resaltar
    textAlign: "center", // Alineación centrada
    color: "#000", // Color del texto
  },
  secondLine: {
    fontSize: 24, // Tamaño del texto para la segunda línea
    fontWeight: "300",
    textAlign: "center", // Alineación centrada
    color: "#000", // Color del texto
    marginTop: 5, // Espacio entre las dos líneas
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "white",
  },
  checkboxChecked: {
    backgroundColor: "green", //6366F1
    borderColor: "green",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#4B5563",
  },
  button: {
    // backgroundColor: "#007bff",
    // borderRadius: 8,
    // paddingVertical: 15,
    // alignItems: "center",
    // marginTop: 10,
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FormularioInvitacion;
