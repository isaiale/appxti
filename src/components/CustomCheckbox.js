import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomCheckbox = ({ label, isChecked, onChange }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onChange}>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Ionicons name="checkmark" size={18} color="white" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",    
    marginEnd: 20,
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "white",
  },
  checkboxChecked: {
    backgroundColor: "#6366F1", // Color cuando está seleccionado
    borderColor: "#6366F1",
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#4B5563",
  },
});

export default CustomCheckbox;