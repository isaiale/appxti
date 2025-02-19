import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CardPlan from "./CardPlans";

export default function ProductListScreen() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState([
    { label: "Para Mi - 8126225958", value: "8126225958" },
    { label: "Mamá - 8123456789", value: "8123456789" },
  ]);
  const [selectedRecipient, setSelectedRecipient] = useState("8126225958");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("https://likephone.mx/api/getPlanes");
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la lista de planes.");
      console.error("Error al obtener los planes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipient = () => {
    Alert.prompt(
      "Nuevo destinatario",
      "Introduce el nombre y número del destinatario:",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Agregar",
          onPress: (input) => {
            const [name, phone] = input.split("-");
            if (name && phone) {
              setRecipients([...recipients, { label: `${name.trim()} - ${phone.trim()}`, value: phone.trim() }]);
              Alert.alert("Éxito", "Destinatario agregado correctamente.");
            } else {
              Alert.alert("Error", "Formato incorrecto. Usa 'Nombre - Número'.");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleViewDetails = (plan) => {
    Alert.alert("Detalles del Plan", plan.ticket);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Selector de destinatarios */}
      <View style={styles.rechargeContainer}>
        <Text style={styles.rechargeText}>¿A quién le harás recarga?</Text>
        <View style={styles.selectorRow}>
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={toggleModal}
          >
            <Text style={styles.pickerText}>
              {recipients.find((r) => r.value === selectedRecipient)?.label ||
                "Seleccionar destinatario"}
            </Text>
            <Icon name="chevron-down-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddRecipient}
          >
            <Icon name="add-circle-outline" size={24} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para seleccionar destinatario */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {recipients.map((recipient, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedRecipient(recipient.value);
                    toggleModal();
                  }}
                >
                  <Text style={styles.modalItemText}>{recipient.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Lista de planes */}
      <FlatList
        data={plans}
        keyExtractor={(item) => item.cv_plan.toString()}
        renderItem={({ item }) => (
          <CardPlan plan={item} onViewDetails={handleViewDetails} />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  rechargeContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rechargeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#FFF",
  },
  pickerText: {
    fontSize: 14,
    color: "#333",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    width: "80%",
    maxHeight: "60%",
    padding: 15,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
});
