import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { AuthContext } from "../../context/AuthContext";
import { baseURL } from "../../services/url";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../../config/global_colors";
import CustomButton from "../../components/CustomButton";

const SolicitudServicio = () => {
  const { user } = useContext(AuthContext);
  const [idServicio, setIdServicio] = useState("");
  const [otroServicio, setOtroServicio] = useState("");
  const [direccionUsuario, setDireccionUsuario] = useState("");
  const [dependencies, setDependencies] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [mostrarNuevoServicio, setMostrarNuevoServicio] = useState(false);
  const codigo_color = user?.codigo_color ?? "#007BFF";

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const response = await fetch(`${baseURL}/services/`);
        const data = await response.json();
        setDependencies(data);
      } catch (error) {
        console.error("Error al obtener dependencias:", error);
        Alert.alert("Error", "No se pudieron cargar los servicios.");
      }
    };
    fetchDependencies();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/services/solicitud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: user.id,
          id_servicio: idServicio,
          otro_servicio: otroServicio,
          direccion_usuario: direccionUsuario,
        }),
      });

      console.log("Solicitud:", response)
      if (response.ok) {
        Alert.alert("Éxito", "Solicitud enviada correctamente.");
        setIdServicio("");
        setOtroServicio("");
        setDireccionUsuario("");
        setDefaultValue(null);
        setMostrarNuevoServicio(false);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "No se pudo enviar la solicitud.");
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = () => {
    if (!direccionUsuario) {
      return true;
    }

    return false;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Servicio:</Text>
      <SelectDropdown
        data={dependencies}
        onSelect={(item) => {
          console.log("ID de la dependencia seleccionada:", item.id);
          setIdServicio(item.id);
        }}
        defaultValue={defaultValue}
        renderButton={(selectedItem) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {selectedItem ? selectedItem.nombre : "Selecciona un servicio"}
            </Text>
          </View>
        )}
        renderItem={(item, isSelected) => (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <Text style={styles.dropdownItemTxtStyle}>{item.nombre}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />

      <TouchableOpacity
        style={styles.nuevoServicioButton}
        onPress={() => setMostrarNuevoServicio(!mostrarNuevoServicio)}
      >
        <Text style={styles.nuevoServicioButtonText}>
          {mostrarNuevoServicio ? "Ocultar Nuevo Servicio" : "Agregar Nuevo Servicio"}
        </Text>
      </TouchableOpacity>

      {mostrarNuevoServicio && (
        <>
          <Text style={styles.label}>Nuevo Servicio:</Text>
          <TextInput
            style={styles.input}
            value={otroServicio}
            onChangeText={setOtroServicio}
            placeholder="Ej. Servicio que brinda"
          />
        </>
      )}

      <Text style={styles.label}>Dirección:</Text>
      <TextInput
        style={styles.input}
        value={direccionUsuario}
        onChangeText={setDireccionUsuario}
        placeholder="Col, Municipio, Estado."
      />

      <CustomButton
        style={styles.button}
        title="Enviar Solicitud"
        color={isButtonDisabled() ? "gray" : codigo_color}
        textColor="#FFF"
        onPress={handleSubmit}
        loading={loading}
        disabled={isButtonDisabled()}
      />

      <View style={styles.infoContainer}>
        <Icon name="information-circle-outline" size={20} color="#007BFF" />
        <Text style={styles.infoText}>
          La información proporcionada será validada para darte de alta como proveedor de servicios.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  button: {
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownButtonStyle: {
    width: "100%",
    backgroundColor: "#EFEFEF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
    padding: 10,
  },
  dropdownButtonTxtStyle: {
    textAlign: "left",
    fontSize: 16,
  },
  dropdownItemStyle: {
    padding: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
  },
  dropdownMenuStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 5,
    marginTop: 5,
  },
  nuevoServicioButton: {
    backgroundColor: Colors.success,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  nuevoServicioButtonText: {
    fontSize: 16,
    color: "white",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
  },
});

export default SolicitudServicio;