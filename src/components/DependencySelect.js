import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { baseURL } from "../services/url";

const DependencySelect = ({ onPress, defaultValue }) => {
    const [dependencies, setDependencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const response = await fetch(`${baseURL}/reportes/dependencias`);
                const data = await response.json();
                setDependencies(data);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar las dependencias.");
            } finally {
                setLoading(false);
            }
        };

        fetchDependencies();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" />;
    }

    return (
        <View>
            <SelectDropdown
                data={dependencies}
                onSelect={(item) => {
                    console.log("ID de la dependencia seleccionada:", item.id_dependencia);
                    onPress(item.id_dependencia); // Llama onPress con el ID
                }}
                defaultValue={defaultValue}
                renderButton={(selectedItem) => (
                    <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                            {selectedItem ? selectedItem.nombre : "Selecciona una dependencia"}
                        </Text>
                    </View>
                )}
                renderItem={(item, isSelected) => (
                    <View
                        style={{
                            ...styles.dropdownItemStyle,
                            ...(isSelected && { backgroundColor: "#D2D9DF" }),
                        }}
                    >
                        <Text style={styles.dropdownItemTxtStyle}>{item.nombre}</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#151E26",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 15,
    marginTop: -180,
  },
  dropdownItemStyle: {
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 9,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#151E26",
  },
});

export default DependencySelect;
