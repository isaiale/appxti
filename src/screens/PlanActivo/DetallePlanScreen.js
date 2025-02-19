import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import ProgressBar from "../../components/ProgressBar";
import {
  formatDate,
  calcularDiasRestantes,
  convertirAGB,
  restarSinRetorno,
} from "../../utils/Funciones";

const { width } = Dimensions.get("window");

const DetallePlanActivo = () => {
  const { user } = useContext(AuthContext);
  const Url = "https://crm.likephone.mx/public/img/";
  const urlPlan = "https://likephone.mx/api/SaldoUsuario/";
  const getPlanes = "https://likephone.mx/api/getPlanes";
  const [urlImagen, setUrlImagen] = useState(
    "https://likephone.mx/public/iconos/fondo1.png"
  );
  const [datosPlan, setDatosPlan] = useState(null);
  // const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const Telefono = "8124447352";
  // const Telefono = "8124447352";

  const fetchData = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append("numero", Telefono);

      const res = await fetch(urlPlan, {
        method: "POST",
        body: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener los datos del plan");
      }

      const data = await res.json();
      setDatosPlan(data);
    } catch (error) {
      console.error("Error en el servidor:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(getPlanes);
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la lista de planes.");
      console.error("Error al obtener los planes:", error);
    }
  };

  useEffect(() => {
    if (datosPlan && plans.length > 0) {
      const planEncontrado = plans.find(
        (plan) => plan.offeringId === datosPlan.offering_datos
      );
      // setPlanSeleccionado(planEncontrado || null);
      setLoading(false);

      // Actualizar la URL de la imagen basada en el plan encontrado
      if (planEncontrado) {
        setUrlImagen(
          `https://crm.likephone.mx/public/img/${planEncontrado.imagen_movil2}`
        );
      } else {
        setUrlImagen("https://likephone.mx/public/iconos/fondo1.png");
      }
    }
  }, [datosPlan, plans]);

  useEffect(() => {
    fetchData();
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  const datos_iniciales = datosPlan?.datos_iniciales;
  const datos = datosPlan?.datos;
  const fecha = datosPlan?.fecha_datos_final?.date;
  const mensajes_iniciales = datosPlan?.mensajes_iniciales;
  const mensajes = datosPlan?.mensajes;
  const minutos_iniciales = datosPlan?.minutos_iniciales;
  const minutos = datosPlan?.minutos;

  const fechaFormateada = fecha
    ? formatDate(fecha)
    : { day: "--", monthYear: "--" };
  const diasRestantes = fecha ? calcularDiasRestantes(fecha) : 0;
  const gbInicial = convertirAGB(datos_iniciales);
  // const gbgastado = convertirAGB(datos);

  const Internet = restarSinRetorno(datos_iniciales, datos);
  const Totalgb = convertirAGB(Internet);
  const Mensaje = restarSinRetorno(mensajes_iniciales, mensajes);
  const llamdas = restarSinRetorno(minutos_iniciales, minutos);

  return (
    <View style={styles.container}>
      {/* Bienvenida */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola</Text>
          <Text style={styles.nameText}>
            {user.nombre} {user.a_paterno}
          </Text>
        </View>
        <Image
          source={{
            uri: user.foto_perfil,
          }}
          style={styles.profileImage}
        />
      </View>

      {/* Imagen del plan activo */}
      <View style={styles.promoContainer}>
        <Image
          source={{ uri: urlImagen }}
          style={styles.promoImage}
          resizeMode="cover"
        />
      </View>

      {/* para mostrar dias y fecha fin */}
      <View style={styles.card}>
        <Text style={styles.cardDescription}>Fecha que expira el plan</Text>

        {/* Contenido de la tarjeta */}
        <View style={styles.cardContent}>
          {/* Fecha */}
          <View style={styles.leftSection}>
            <Text style={styles.dateText}>{fechaFormateada.day}</Text>
            <Text style={styles.monthText}>{fechaFormateada.monthYear}</Text>
          </View>

          {/* Días restantes */}
          <View style={styles.rightSection}>
            <Text style={styles.timeText}>{diasRestantes}</Text>
            <Text style={styles.countryText}>
              {diasRestantes === 1 ? "Día" : "Días"}
            </Text>
          </View>
        </View>
      </View>

      {/* Barras de progreso */}
      <View style={styles.card}>
        <Text style={styles.cardDescription}>
          Detalle del consumo
        </Text>
        <ProgressBar
          iconName="wifi"
          label="Internet"
          value={Totalgb}
          minValue={Totalgb}
          maxValue={gbInicial}
          tipo={"GB"}
          color="#007BFF"
        />
        <ProgressBar
          iconName="chatbubble-outline"
          label="SMS"
          value={Mensaje}
          minValue={Mensaje}
          maxValue={datosPlan?.mensajes_iniciales}
          tipo={"SMS"}
          color="#d9258e"
        />
        <ProgressBar
          iconName="call"
          label="Llamadas"
          value={llamdas}
          minValue={llamdas}
          maxValue={datosPlan?.minutos_iniciales}
          tipo={"MIN"}
          color="#28a745"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardDescription}>
          Llamadas y SMS con Cobertura Nacional, Estados Unidos y Canada
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  nameText: {
    fontSize: 20,
    color: "#666",
    marginTop: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  promoContainer: {
    marginTop: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promoImage: {
    width: width * 0.9,
    height: width * 0.4,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    alignItems: "center",
  },
  dateText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007BFF",
  },
  monthText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#666",
    textTransform: "uppercase",
  },
  rightSection: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007BFF",
  },
  countryText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#999",
    textTransform: "uppercase",
  },
});

export default DetallePlanActivo;
