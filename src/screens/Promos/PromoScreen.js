import React, { useContext, useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import PromoCard from "../../components/PromoCard";
import CouponCard from "./Cupon";
import Icon from "react-native-vector-icons/Ionicons";
import { baseURL } from "../../services/url";
import { AuthContext } from "../../context/AuthContext";

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
            onPressButton={() => onCouponPress(item)} // "nombreNegocio Llama a la acción personalizada
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
  const {user} = useContext(AuthContext);  

  const fetchCupones = async () => {
    let idPartido = user.id_partido;
    try {
      const response = await fetch(`${baseURL}/promociones/${idPartido}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },        
      });
      if(!response.ok){
        console.error("Error en la solicitud");      
      }
      const data = await response.json();
      console.log("Respuesta de la api:", data.promociones);
      setCupones(data.promociones);
    } catch (error) {
      console.error("Error en la solicitud: ", error);            
    }
  };

  useEffect(()=>{
    fetchCupones();
  },[]);

  const handleCouponPress = (item) => {
    setSelectedCoupon(item); // Almacenar el cupón seleccionado en el estado
  };

  const handleBackPress = () => {
    setSelectedCoupon(null); // Regresar a la lista de cupones
  };

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
            // details={[
            //   "Detalles del cupón seleccionados",
            //   "Detalles del cupón seleccionados",
            // ]}
            // barcode="NO.1234567890"
            expiryDate={selectedCoupon.description}
            // onShare={() => alert("Compartiendo el cupón")}
            onInfo={() => Alert.alert("Informacion","Al usuar el cupon se activa y solo es valido cuando esta activo")}
          />
        </View>
      ) : (
        <CouponListScreen coupons={cupones} onCouponPress={handleCouponPress} />
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
});

export default PromoScreen;
