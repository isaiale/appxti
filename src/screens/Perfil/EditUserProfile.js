import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const EditUserProfile = ({
  visible,
  onClose,
  user,
  onSave,
  showCancelButton,
}) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    a_paterno: user?.a_paterno || "",
    correo: user?.correo || "",
    telefono: user?.telefono || "",
    nombre_estado: user?.nombre_estado || "",
    nombre_municipio: user?.nombre_municipio || "",
    nombre_partido: user?.nombre_partido || "",
  });

  const handleSave = () => {
    if (!formData.nombre.trim() || !formData.correo.trim()) {
      Alert.alert("Error", "Nombre y correo son campos obligatorios.");
      return;
    }
    onSave(formData);
    Alert.alert(
      "Perfil actualizado",
      "Los cambios se han guardado correctamente."
    );
    onClose();
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
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
          {/* Encabezado */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Campos de Edición */}
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
              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={styles.input}
                value={formData.a_paterno}
                onChangeText={(text) => handleChange("a_paterno", text)}
                placeholder="Apellido"
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={formData.telefono}
                onChangeText={(text) => handleChange("telefono", text)}
                placeholder="Teléfono"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Estado</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre_estado}
                onChangeText={(text) => handleChange("nombre_estado", text)}
                placeholder="Estado"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Municipio</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre_municipio}
                onChangeText={(text) => handleChange("nombre_municipio", text)}
                placeholder="Municipio"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Partido</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre_partido}
                onChangeText={(text) => handleChange("nombre_partido", text)}
                placeholder="Partido"
                placeholderTextColor="#999"
              />
            </View>

            {showCancelButton && (
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Icon name="close-circle-outline" size={20} color="#FFF" />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}

            {/* Botón Guardar */}
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
    backgroundColor: "#FF3B30", // Rojo para indicar cancelación
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
