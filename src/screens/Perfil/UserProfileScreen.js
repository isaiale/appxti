import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../context/AuthContext";
import EditUserProfile from "./EditUserProfile"; // Importa el componente de edición

const UserProfile = () => {
  const { user } = React.useContext(AuthContext); // Obtén los datos del usuario desde el contexto
  const [isEditModalVisible, setEditModalVisible] = useState(false); // Estado para controlar el modal de edición

  const handleEditSave = (updatedUser) => {
    console.log("Datos actualizados:", updatedUser);
    // Aquí puedes enviar los datos actualizados al backend o actualizar el estado global
    setEditModalVisible(false);
  };

  return (
    <>
      {/* Vista del Perfil */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={{
              uri: user?.foto_perfil || "https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>
            {`${user?.nombre || "Nombre"} ${user?.a_paterno || "Apellido"}`}
          </Text>
          <Text style={styles.userEmail}>
            {user?.correo || "correo@ejemplo.com"}
          </Text>
        </View>

        {/* Información del Usuario */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Teléfono:</Text>
          <Text style={styles.infoText}>
            {user?.telefono || "No proporcionado"}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Estado y municipio:</Text>
          <Text style={styles.infoText}>
            {user?.nombre_estado && user?.nombre_municipio
              ? `${user.nombre_estado}, ${user.nombre_municipio}` // Muestra Estado y Municipio si ambos tienen información
              : user?.nombre_estado && !user?.nombre_municipio
              ? `${user.nombre_estado}` // Muestra solo el Estado si Municipio es nulo
              : user?.aplica_nacional
              ? "México" // Muestra "México" si aplica_nacional es verdadero
              : "No proporcionada"}{" "}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Partido:</Text>
          <Text style={styles.infoText}>
            {user?.nombre_partido || "No proporcionada"}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Estatus:</Text>
          <Text
            style={[
              styles.infoText,
              {
                color:
                  user?.estatus === 1
                    ? "green"
                    : user?.estatus === 0
                    ? "red"
                    : "black",
              },
            ]}
          >
            {user?.estatus === 1
              ? "Activo"
              : user?.estatus === 0
              ? "Inactivo"
              : "No proporcionado"}
          </Text>
        </View>

        {/* Botón de Editar */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditModalVisible(true)}
        >
          <Icon name="pencil-outline" size={20} color="#FFF" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Edición */}      
      <EditUserProfile
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        user={user}
        onSave={handleEditSave}
        showCancelButton={true} // Propiedad para mostrar el botón de cancelar
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#007BFF",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Sombra para Android
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  infoBox: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Sombra para Android
  },
  infoLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3, // Sombra para Android
  },
  editButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default UserProfile;
