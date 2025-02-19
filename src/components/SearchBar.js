import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { debounce } from "lodash";
import Icon from "react-native-vector-icons/Ionicons";

const SearchBar = ({ data, onSearch, texto = "Buscar..." }) => {  
  
  const [searchTerm, setSearchTerm] = useState("");

  // Función para normalizar el número de teléfono (eliminar espacios y caracteres no numéricos)
  const normalizePhoneNumber = (telefono) => (telefono ? telefono.replace(/\D/g, "") : ""); 

  // Usamos debounce para optimizar la búsqueda
  const debouncedSearch = debounce((term) => {
    const normalizedTerm = term.toLowerCase().trim(); // Normaliza el texto ingresado
    const normalizedPhoneTerm = normalizePhoneNumber(term); // Normaliza en caso de número

    const results = data.filter((item) => {
      const normalizedName = item.nombre ? item.nombre.toLowerCase() : "";
      const normalizedPhone = item.telefono ? normalizePhoneNumber(item.telefono) : ""; // Verifica si hay teléfono

      // Filtrar por nombre o por número de teléfono si está disponible
      return (
        normalizedName.includes(normalizedTerm) || 
        (normalizedPhone && normalizedPhone.includes(normalizedPhoneTerm))
      );
    });

    onSearch(results);
  }, 500); // Espera 500ms antes de ejecutar la búsqueda

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, data, debouncedSearch]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={texto}
        keyboardType="default"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Icon
        name="search"
        size={24}
        color="gray"
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Alinea el icono y el input en fila
    alignItems: "center", // Centra verticalmente
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1, // Ocupa todo el espacio disponible
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 18,
    borderRadius: 15,
    backgroundColor: "white",
    paddingRight: 40, // Espacio para el icono dentro del input
  },
  icon: {
    position: "absolute", // Posición absoluta para colocar el ícono dentro del input
    right: 30, // Coloca el icono en el lado derecho
    fontSize: 25,
  },
});

export default SearchBar;
