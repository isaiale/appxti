import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import PromoCard from "../../components/PromoCard";
import CouponCard from "./Cupon";
import Icon from "react-native-vector-icons/Ionicons";
import { baseURL } from "../../services/url";
import { AuthContext } from "../../context/AuthContext";
import SearchBar from "../../components/SearchBar";
import NetInfo from "@react-native-community/netinfo";

const CouponListScreen = ({ coupons, onCouponPress }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={coupons}
        renderItem={({ item }) => (
          <PromoCard
            logo={item.logo}
            title={item.nombreNegocio}
            subtitle={item.tituloPromocion}
            expiryDate={item.descripcionPromocion}
            description={item.detalles}
            onPressButton={() => onCouponPress(item)} // Llama a la acción personalizada
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const PromoScreen = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [cupones, setCupones] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]); // Estado para cupones filtrados
  const [cuponesVacios, setCuponesVacios] = useState(false); // Estado para manejar cupones vacíos
  const [error, setError] = useState(null); // Estado para manejar errores
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const { user } = useContext(AuthContext);

  const fetchCupones = async () => {
    setError(null); // Limpiar el error antes de hacer la solicitud
    setLoading(true); // Activar el estado de carga

    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setError("No hay conexión a internet");
        setLoading(false);
        return;
      }

      const idPartido = user.id_partido;
      const telefono = user.telefono;
      const response = await fetch(`${baseURL}/promociones/${idPartido}/${telefono}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Respuesta de la api:", data);

      if (data.success === false) {
        setError(data.message);
        setCuponesVacios(true);
      } else {
        setCupones(data.promociones);
        setFilteredCoupons(data.promociones); // Inicializar los cupones filtrados
      }
    } catch (error) {
      console.error("Error en la solicitud msg: ", error);
      setError("Error al cargar los cupones");
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  useEffect(() => {
    let timeoutId;

    // Escuchar cambios en la conexión a internet
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        // Esperar 3 segundos antes de hacer la petición
        timeoutId = setTimeout(() => {
          fetchCupones();
        }, 3000); // 3000 milisegundos = 3 segundos
      }
    });

    // Hacer la primera carga al montar el componente
    fetchCupones();

    return () => {
      unsubscribe(); // Limpiar el listener al desmontar
      if (timeoutId) clearTimeout(timeoutId); // Limpiar el timeout
    };
  }, []);

  const handleCouponPress = (item) => {
    setSelectedCoupon(item); // Almacenar el cupón seleccionado en el estado
  };

  const handleBackPress = () => {
    setSelectedCoupon(null); // Regresar a la lista de cupones
  };

  // Función de filtrado personalizada para buscar por nombreNegocio
  const filterByNombreNegocio = (data, searchTerm) => {
    return data.filter((item) =>
      item.nombreNegocio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedCoupon ? (
        <View style={styles.couponContainer}>
          {/* Botón de regresar */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <View style={styles.backButtonContent}>
              <Icon name="arrow-back" size={24} color="#333" />
              <Text style={styles.backButtonText}>Regresar</Text>
            </View>
          </TouchableOpacity>
          <CouponCard
            idPromocion={selectedCoupon.idPromocion}
            logo={selectedCoupon.logo}
            brandName={selectedCoupon.tituloPromocion}
            title={selectedCoupon.nombreNegocio}
            description={selectedCoupon.descripcionPromocion}
            details={selectedCoupon.detalles}
            expiryDate={selectedCoupon.description}
            onInfo={() => Alert.alert("Información", "Al usar el cupón se activa y solo es válido cuando está activo")}
          />
        </View>
      ) : (
        <>
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="ticket-outline" size={80} color="#ccc" />
              <Text style={styles.errorTitle}>¡Ups!</Text>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          ) : cuponesVacios ? (
            <View style={styles.noCouponsContainer}>
              <Icon name="ticket-outline" size={80} color="#ccc" />
              <Text style={styles.noCouponsText}>No hay cupones disponibles</Text>
              <Text style={styles.noCouponsSubText}>
                Cuando haya cupones disponibles, aparecerán aquí.
              </Text>
            </View>
          ) : (
            <>
              <SearchBar
                data={cupones}
                onSearch={setFilteredCoupons}
                texto="Buscar por nombre del negocio..."
                filterFunction={filterByNombreNegocio} // Función de filtrado personalizada
              />
              <CouponListScreen coupons={filteredCoupons} onCouponPress={handleCouponPress} />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  couponContainer: {
    flex: 1,
    padding: 10,
  },
  backButton: {
    marginBottom: 10,
    padding: 5,
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5, // Espaciado entre el ícono y el texto
  },
  noCouponsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCouponsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  noCouponsSubText: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PromoScreen;