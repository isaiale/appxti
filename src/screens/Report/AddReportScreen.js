import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import DependencySelect from "../../components/DependencySelect";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { AuthContext } from "../../context/AuthContext";
import { obtenerFechaHoraMexico } from "../../utils/Funciones";
import { baseURL } from "../../services/url";

const AddReportScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [idDependency, setIdDependency] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const url = `${baseURL}/reportes/crear`;
  const lugar =
    user.aplica_nacional == 1
      ? "Todo México"
      : [user.nombre_estado, user.nombre_municipio].filter(Boolean).join(", ");

  console.log(user);

  useEffect(() => {
    getLocation();
  }, []);

  // 📍 Obtener ubicación actual
  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita permiso de ubicación.");
      navigation.goBack();
      return false;
    }
    return true;
  };

  const fetchLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setLatitud(latitude);
    setLongitud(longitude);

    setLocationMessage("Ubicación obtenida con éxito.");
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      const isGpsEnabled = await Location.hasServicesEnabledAsync();
      if (!isGpsEnabled) {
        Alert.alert(
          "GPS desactivado",
          "¿Deseas activar el GPS para obtener tu ubicación?",
          [
            {
              text: "Activar GPS",
              onPress: async () => {
                try {
                  // Intentar activar el GPS
                  await Location.enableNetworkProviderAsync();
                  // Verificar si el GPS se activó correctamente
                  const isGpsEnabledNow =
                    await Location.hasServicesEnabledAsync();
                  if (isGpsEnabledNow) {
                    await fetchLocation(); // Obtener la ubicación después de activar el GPS
                  } else {
                    Alert.alert("Error", "No se pudo activar el GPS.");
                  }
                } catch (error) {
                  console.error("Error al activar el GPS:", error);
                  Alert.alert("Error", "No se pudo activar el GPS.");
                }
              },
            },
            { text: "Cancelar", style: "cancel" },
          ]
        );
        return;
      }
      await fetchLocation();
    }
  };

  const pickImageFromCamera = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    };

    let result = await ImagePicker.launchCameraAsync(options);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    };

    let result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const fecha = obtenerFechaHoraMexico();
    const userId = user.id;

    console.log(fecha);

    if (!title || !description || !image || !idDependency || !userId) {
      Alert.alert("Campos incompletos", "Completa todos los campos.");
      return;
    }

    if (!latitud || !longitud) {
      Alert.alert(
        "Ubicación",
        "Se necesita la ubicación para levantar el reporte."
      );
      return;
    }

    const formData = new FormData();
    formData.append("id_usuario", userId);
    formData.append("titulo", title);
    formData.append("descripcion", description);
    formData.append("id_dependencia", idDependency);
    formData.append("fecha_reporte", fecha);
    formData.append("latitud", latitud);
    formData.append("longitud", longitud);

    // Convertir la imagen en un archivo antes de enviarla
    if (image) {
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("imagen", {
        uri: image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Reporte enviado", "Tu reporte ha sido enviado con éxito.");
        navigation.goBack();
      } else {
        Alert.alert(
          "Mensaje",
          result.message || "No se pudo enviar el reporte."
        );
      }
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      Alert.alert("Error", "Ocurrió un error al enviar el reporte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.infoContainer}>
        <Icon
          name="info-circle"
          size={24}
          color="#007BFF"
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>
          Esta pantalla permite registrar reportes con ubicación exacta. Solo
          aplica para <Text style={styles.highlight}>{lugar}</Text>
          .
        </Text>
      </View>
      <CustomText style={styles.descriptionLabel}>Título</CustomText>
      <CustomTextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <CustomText style={styles.descriptionLabel}>Descripción</CustomText>
      <TextInput
        style={styles.inputMultiline}
        placeholder="Escribe la descripción del reporte..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <CustomText style={styles.descriptionLabel}>Dependencia</CustomText>
      <DependencySelect
        onPress={(value) => {
          setIdDependency(value);
          console.log("Dependencia seleccionada:", value);
        }}
      />
      <CustomButton
        title="Obtener Ubicación"
        color="#007BFF"
        textColor="#FFF"
        onPress={getLocation}
      />

      {locationMessage !== "" && (
        <Text style={styles.locationMessage}>{locationMessage}</Text>
      )}
      {/* Botones para seleccionar imagen */}
      <CustomText style={styles.descriptionLabel}>Imagen</CustomText>

      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImageFromCamera}
        >
          <Icon name="camera" size={20} color="#FFF" />
          <Text style={styles.imageButtonText}>Cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImageFromGallery}
        >
          <Icon name="photo" size={20} color="#FFF" />
          <Text style={styles.imageButtonText}>Galería</Text>
        </TouchableOpacity>
      </View>
      {/* Área para mostrar la imagen */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <CustomText style={styles.imagePlaceholder}>
            Selecciona una imagen para el reporte
          </CustomText>
        )}
      </View>

      <CustomButton
        title="Enviar Reporte"
        onPress={handleSubmit}
        color="#28a745"
        textColor="#FFF"
        loading={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#007BFF",
    flex: 1,
  },
  highlight: {
    fontWeight: "bold",
    color: "#0056b3",
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 1,
    color: "#333",
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: "#999",
    textAlign: "center",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: "#FFF",
    marginLeft: 10,
    fontSize: 16,
  },
  locationMessage: {
    marginTop: 10,
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddReportScreen;
