import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, Text, View } from "react-native";
import DesignCard from "./DesignCard";
import imgService from "../../../assets/services.png"; // Asegúrate de que la ruta sea correcta
import { baseURL } from "../../services/url";
import NetInfo from "@react-native-community/netinfo";
import SearchBar from "../../components/SearchBar";
import Icon from "react-native-vector-icons/Ionicons";

const ServicesScreen = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (results) => {
    setFilteredServices(results);
  };

  const fetchTiposServicios = async () => {
    setError(null); // Limpiar el error antes de hacer la solicitud
    setLoading(true); // Activar el estado de carga

    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setError("No hay conexión a internet.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${baseURL}/services/`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }

      const res = await response.json();
      console.log(res);

      if (Array.isArray(res) && res.length > 0) {
        setFilteredServices(res);
        setData(res);
      } else {
        setError("No se encontraron servicios disponibles.");
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error.message);
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  useEffect(() => {
    // Escuchar cambios en la conexión a internet
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        // Esperar 3 segundos antes de hacer la petición
        setTimeout(() => {
          fetchTiposServicios();
        }, 3000); // 3000 milisegundos = 3 segundos
      }
    });

    // Hacer la primera carga al montar el componente
    fetchTiposServicios();

    return () => unsubscribe(); // Limpiar el listener al desmontar
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      {/* Mostrar el buscador solo si hay servicios */}
      {filteredServices.length > 0 && <SearchBar data={data} onSearch={handleSearch} texto="Buscar un servicio..." />}

      <ScrollView contentContainerStyle={styles.container}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <DesignCard
              key={service.id}
              title={service.nombre}
              imageSource={imgService}
              navigationTarget={{
                screen: "ServiciosUser",
                params: { id_servicio: service.id },
              }}
            />
          ))
        ) : (
          <View style={styles.noServicesContainer}>
            <Icon name="build" size={80} color="#ccc" />
            <Text style={styles.noServicesText}>Directorio de servicios</Text>
            <Text style={styles.noServicesSubText}>{error || "No hay servicios disponibles en este momento."}</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  noServicesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noServicesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  noServicesSubText: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ServicesScreen;