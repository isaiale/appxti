import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { baseURL } from "../../services/url";
import { useFocusEffect } from "@react-navigation/native"; // Importa useFocusEffect

const screenWidth = Dimensions.get("window").width;
const imageHeight = (screenWidth * 5) / 4;

export default function ReportesScreen() {
  const { user } = useContext(AuthContext);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState(null);

  // 🔹 Obtener datos de la API
  const fetchData = async () => {
    if (!user?.id_partido) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/reportes/partido/${user.id_partido}`
      );
      const data = await response.json();
      setReportes(data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar datos al montar el componente y cuando la pantalla está en foco
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user?.id_partido])
  );

  // 🔹 Refrescar datos
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // 🔹 Filtrar reportes por estatus
  const filtrarReportes = () => {
    if (!Array.isArray(reportes)) return []; // Si reportes no es un array, retornar un array vacío
    if (!filtroActivo) return reportes;

    return reportes.filter(
      (reporte) => (reporte.estatus || "").toLowerCase() === filtroActivo
    );
  };

  // 🔹 Obtener color por estatus
  const getStatusColor = (status) => {
    if (!status) return "#9CA3AF";
    switch (status.toLowerCase()) {
      case "pendiente":
        return "#F59E0B";
      case "en trámite":
        return "#3B82F6";
      case "solucionado":
        return "#10B981";
      case "sin solución":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  // 🔹 Renderizar cada reporte
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.estatus) },
            ]}
          />
          <Text style={styles.statusText}>{capitalize(item.estatus)}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.fecha_reporte)}</Text>
      </View>

      <View style={styles.cardImg}>
        <Image
          source={{ uri: item.foto }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.dependenciaContainer}>
            <FontAwesome5 name="building" size={14} color="#6B7280" />
            <Text style={styles.dependenciaText}>{item.dependencia}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { label: "Todos", value: null },
            { label: "Pendientes", value: "pendiente" },
            { label: "En Trámite", value: "en trámite" },
            { label: "Solucionados", value: "solucionado" },
            { label: "Sin Solución", value: "sin solución" },
          ]}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                filtroActivo === item.value && {
                  backgroundColor: getStatusColor(item.value),
                },
              ]}
              onPress={() =>
                setFiltroActivo(filtroActivo === item.value ? null : item.value)
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  filtroActivo === item.value && { color: "white" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filtersScrollContent}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6366F1"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filtrarReportes()}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6366F1"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="document-text-outline"
                size={80}
                color="#ccc"
              />
              <Text style={styles.emptyText}>No hay reportes disponibles</Text>
              <Text style={styles.noCouponsSubText}>
                Cuando haya reportes disponibles, aparecerán aquí.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// 🔹 Funciones utilitarias
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  filtersContainer: {
    marginTop: 10,
    marginBottom: 8,
  },
  filtersScrollContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  listContainer: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
    marginRight: 11,
  },
  cardImg: {
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  cardImage: {
    width: "100%",
    // height: width * 1,
    // width: screenWidth,
    height: imageHeight,
    resizeMode: "cover", // o 'contain' según lo que prefieras
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    marginTop: -18,
  },
  cardDescription: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 1,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  dependenciaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dependenciaText: {
    fontSize: 12,
    color: "#4B5563",
    marginLeft: 6,
    fontWeight: "500",
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
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
  emptyButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
