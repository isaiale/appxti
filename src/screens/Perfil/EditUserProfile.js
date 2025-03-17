import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { baseURL } from "../../services/url";
import { AuthContext } from "../../context/AuthContext";

const EditUserProfile = ({
  visible,
  onClose,
  user,
  onSave,
  showCancelButton,
}) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido_paterno: user?.a_paterno || "",
    apellido_materno: user?.a_materno || "",
    correo: user?.correo || "",
    foto_perfil: user?.foto_perfil || null,
  });
  const [camposModificados, setCamposModificados] = useState({
    nombre: false,
    apellido_paterno: false,
    apellido_materno: false,
    correo: false,
    foto_perfil: false,
  });
  const { refreshUser } = useContext(AuthContext);
  const [cambios, setCambios] = useState({}); // Objeto para rastrear cambios

  const selectImage = async () => {
    console.log("cambiar img");
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    Alert.alert(
      "Seleccionar imagen",
      "¿Quieres tomar una foto o elegir de la galería?",
      [
        {
          text: "Cámara",
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync(options);
            if (!result.canceled) {
              setFormData({ ...formData, foto_perfil: result.assets[0].uri });
              setCamposModificados({ ...camposModificados, foto_perfil: true });
            }
          },
        },
        {
          text: "Galería",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.canceled) {
              setFormData({ ...formData, foto_perfil: result.assets[0].uri });
              setCamposModificados({ ...camposModificados, foto_perfil: true });
            }
          },
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("id", user.id);
      form.append("nombre", formData.nombre);
      form.append("apellido_paterno", formData.apellido_paterno);
      form.append("apellido_materno", formData.apellido_materno);
      form.append("correo", formData.correo);

      if (camposModificados.foto_perfil) {
        form.append("foto_perfil", {
          uri: formData.foto_perfil,
          name: formData.foto_perfil.split("/").pop(),
          type: "image/jpeg",
        });
      } else{
        form.append("foto_perfil", formData.foto_perfil);
      }

      console.log("infouser", form);
      
      const state = await NetInfo.fetch();
      if(!state.isConnected){
        Alert.alert("Error", "No hay conexión a internet");
        return;
      }

      const response = await fetch(`${baseURL}/userspartido/update`, {
        method: "PUT",
        headers: { "Content-Type": "multipart/form-data" },
        body: form,
      });

      const result = await response.json();
      console.log("result: ", result);

      if (response.ok) {
        const updatedUser = { ...user, ...formData };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        refreshUser();
        Alert.alert("Éxito", "Perfil actualizado correctamente.");
        onSave(updatedUser);
        onClose();
      } else {
        Alert.alert(
          "Error",
          result.message || "No se pudo actualizar el perfil."
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
      console.error(error);
    }
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setCambios({ ...cambios, [key]: value }); // Registrar cambio
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: formData.foto_perfil
                  ? formData.foto_perfil
                  : user?.foto_perfil,
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
              <Text style={styles.imageButtonText}>Cambiar perfil</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre}
                onChangeText={(text) => handleChange("nombre", text)}
                placeholder="Nombre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Apellido Paterno</Text>
              <TextInput
                style={styles.input}
                value={formData.apellido_paterno}
                onChangeText={(text) => handleChange("apellido_paterno", text)}
                placeholder="Apellido Paterno"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Apellido Materno</Text>
              <TextInput
                style={styles.input}
                value={formData.apellido_materno}
                onChangeText={(text) => handleChange("apellido_materno", text)}
                placeholder="Apellido Materno"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                value={formData.correo}
                onChangeText={(text) => handleChange("correo", text)}
                placeholder="Correo Electrónico"
                placeholderTextColor="#999"
                keyboardType="email-address"
              />
            </View>

            {showCancelButton && (
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Icon name="close-circle-outline" size={20} color="#FFF" />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Icon name="save-outline" size={20} color="#FFF" />
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#CCC",
  },
  imageButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  imageButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#F9F9F9",
    color: "#333",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default EditUserProfile;
