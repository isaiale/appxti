import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, Text } from "react-native";
import DesignCard from "./DesignCard";
import imgService from "../../../assets/services.png"; // Asegúrate de que la ruta sea correcta
import { baseURL } from "../../services/url";
import NetInfo from "@react-native-community/netinfo";
import SearchBar from "../../components/SearchBar";

const ServicesScreen = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState(data);

  const handleSearch = (results) => {
    setFilteredServices(results);
  };

  const fetchTiposServicios = async () => {
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setError("No hay conexión a internet");
        return;
      }

      const response = await fetch(`${baseURL}/services/`);
      const res = await response.json();
      console.log(res);

      if (!res.success) {
        setData(res); // Asegúrate de que el formato de la respuesta sea correcto
      } else {
        setError("No se encontraron los tipos de servicios");
      }
    } catch (error) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposServicios();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <>
      <SearchBar data={data} onSearch={handleSearch} texto="Buscar un servicio..."/>
      <ScrollView contentContainerStyle={styles.container}>
        {error && <Text style={styles.errorContainer}>{error}</Text>}
        {filteredServices.length > 0
          ? filteredServices.map((service) => (
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
          : !error && (
              <Text style={styles.noData}>No hay servicios disponibles.</Text>
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
  errorContainer: {
    color: "red",
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});

export default ServicesScreen;
