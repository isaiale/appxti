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
import Icon from "react-native-vector-icons/Ionicons";

const DesignDetails = () => {
  const route = useRoute();
  const { id_servicio } = route.params;
  const { user } = useContext(AuthContext);
  const [datos, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState([]);

  const handleSearch = (results) => {
    setFilteredServices(results);
  };

  const fetchUserServicios = async () => {
    setError(null);
    setLoading(true);

    try {
      const id_partido = user?.id_partido;
      if (!id_partido || !id_servicio) {
        setError("Datos insuficientes para la consulta");
        setLoading(false);
        return;
      }

      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setError("No hay conexión a internet");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${baseURL}/services/directorio/${id_partido}/${id_servicio}`
      );
      const res = await response.json();

      if (!response.ok || !Array.isArray(res.message)) {
        setError(res.message || "Error al cargar datos");
        setLoading(false);
        return;
      }

      setData(res.message);
      setFilteredServices(res.message);
    } catch (error) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timeoutId;

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        timeoutId = setTimeout(() => {
          fetchUserServicios();
        }, 3000);
      }
    });

    fetchUserServicios();

    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const abrirWhatsApp = (numero, mensaje) => {
    let url = `whatsapp://send?phone=+52${numero}`;
    if (mensaje) {
      url += `&text=${encodeURIComponent(mensaje)}`;
    }

    Linking.openURL(url).catch(() => {
      alert("Asegúrate de tener WhatsApp instalado");
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />;
  }

  return (
    <>
      {/* Mostrar el buscador solo si hay datos disponibles */}
      {datos.length > 0 && <SearchBar data={datos} onSearch={handleSearch} texto="Buscar por teléfono..." />}
      
      <ScrollView contentContainerStyle={styles.container}>
        {error ? (
          <View style={styles.noDataContainer}>
            <Icon name="alert-circle" size={60} color="#ccc" />
            <Text style={styles.noDataTitle}>¡Ups!</Text>
            <Text style={styles.noDataMessage}>{error}</Text>
          </View>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
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
        ) : (
          <View style={styles.noDataContainer}>
            <Icon name="search" size={60} color="#ccc" />
            <Text style={styles.noDataTitle}>No hay usuarios con esa información</Text>
            <Text style={styles.noDataMessage}>
              Por favor, intenta con otro término de búsqueda.
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  noDataMessage: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
  },
});

export default DesignDetails;
