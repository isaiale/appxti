import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CardInfo from "./CardInfo";
import { AuthContext } from "../../context/AuthContext";
import { baseURL } from "../../services/url";
import NetInfo from "@react-native-community/netinfo";
import SearchBar from "../../components/SearchBar";

const DesignDetails = () => {
  const route = useRoute();
  const { id_servicio } = route.params;
  const { user } = useContext(AuthContext);
  const [datos, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState(datos);

  const handleSearch = (results) => {
    setFilteredServices(results);
  };

  const fetchUserServicios = async () => {
    try {
      const id_partido = user?.id_partido; // Verifica que user exista
      if (!id_partido || !id_servicio) {
        setError("Datos insuficientes para la consulta");
        return;
      }

      // Verificar conexión a internet
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setError("No hay conexión a internet");
        return;
      }

      // Realizar la petición
      const response = await fetch(
        `${baseURL}/services/directorio/${id_partido}/${id_servicio}`
      );

      // Convertir la respuesta en JSON
      const res = await response.json();

      if (!response.ok) {
        setError(res.message || "Error al cargar datos");
        return;
      }

      setData(res.message); // Guardar datos en el estado
      console.log(res.message);
    } catch (error) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserServicios();
  }, []);

  const abrirWhatsApp = (numero, mensaje) => {
    let url = `whatsapp://send?phone=+52${numero}`;
    if (mensaje) {
      url += `&text=${encodeURIComponent(mensaje)}`;
    }

    Linking.openURL(url)
      .then((data) => {
        console.log("WhatsApp abierto:", data);
      })
      .catch(() => {
        alert("Asegúrate de tener WhatsApp instalado");
      });
  };

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
      <SearchBar
        data={datos}
        onSearch={handleSearch}
        texto="Buscar por telefono..."
      />
      <ScrollView contentContainerStyle={styles.container}>
        {error && <Text style={styles.errorContainer}>{error}</Text>}
        {filteredServices.length > 0
          ? filteredServices.map((service) => (
              <CardInfo
                key={service.id}
                nombre={service.nombre}
                ubicacion={service.direccion_usuario}
                imagenSrc={service.foto_perfil}
                rating={parseFloat(service.calificacion_promedio).toFixed(1)}
                onPress={() =>
                  abrirWhatsApp(
                    service.telefono,
                    `Hola, tengo una consulta sobre el servicio de ${service.nombre_servicio}. ¿Podrías darme más información sobre tu servicio?`
                  )
                }
              />
            ))
          : !error && (
              <Text style={styles.noData}>
                No hay usuarios con esa informacion.
              </Text>
            )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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

export default DesignDetails;
