import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import { baseURL } from "../../services/url";

const CreatePost = ({ navigation }) => {
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Función para elegir si el usuario quiere tomar una foto o seleccionar de la galería
  const handleMediaUpload = async () => {
    Alert.alert("Seleccionar imagen", "Elige una opción:", [
      { text: "Tomar foto", onPress: openCamera },
      { text: "Elegir de galería", onPress: openGallery },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  // 📸 Tomar una foto con la cámara
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tu cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  // 📂 Seleccionar una imagen de la galería
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  // 🚀 Enviar la publicación al servidor
  const handlePost = async () => {
    if (!description || !selectedImage) {
      Alert.alert("Error", "Debes agregar una descripción y una imagen.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("descripcion", description);
    formData.append("id_usuario", user?.id || ""); // ID del usuario
    formData.append("imagen", {
      uri: selectedImage.uri,
      name: "upload.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(`${baseURL}/post/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Éxito", "¡Publicación creada con éxito!");
        setDescription("");
        setSelectedImage(null);
        navigation.navigate("Drawer", { screen: "Posts" });
      } else {
        Alert.alert("Mensaje", data.message || "Ocurrió un error.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo subir la publicación.");
      console.error("Error al subir el post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Encabezado con Usuario y Botón Publicar */}
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: user?.foto_perfil || "https://via.placeholder.com/150",
            }}
            style={styles.profilePic}
          />
          <Text style={styles.userName}>
            {user?.nombre || "Usuario"} {user?.a_paterno || ""}
          </Text>
          <Icon
            name="checkmark-circle"
            size={18}
            color="#007BFF"
            style={styles.verifiedIcon}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.postButton,
            !(description || selectedImage) && styles.disabledPostButton,
          ]}
          onPress={handlePost}
          disabled={!(description || selectedImage)}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.postButtonText}>Publicar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Descripción */}
      <View style={styles.descriptionContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="¿Qué quieres compartir?"
          placeholderTextColor="#999"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Vista Previa de Imagen */}
      {selectedImage && (
        <Image
          source={{ uri: selectedImage.uri }}
          style={styles.mediaPreview}
          resizeMode="contain"
        />
      )}

      {/* Botón para Subir Imagen */}
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleMediaUpload}
        >
          <Icon name="camera-outline" size={24} color="#FFF" />
          <Text style={styles.uploadButtonText}>Subir Imagen</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  postButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  disabledPostButton: {
    backgroundColor: "#aaa",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    height: 100,
  },
  mediaPreview: {
    width: "100%",
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
  },
  uploadContainer: {
    alignItems: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
  },
  uploadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default CreatePost;
