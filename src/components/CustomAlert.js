import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

let alertInstance = null;

const Alert = ({ type, title, actionText, onClose, onAction }) => {
  // Define colors and icons based on the type of alert
  const getAlertStyle = () => {
    const stylesMap = {
      error: { borderColor: "#f87171", icon: "error" },
      success: { borderColor: "#34d399", icon: "check-circle" },
      info: { borderColor: "#60a5fa", icon: "info" },
    };
    return stylesMap[type] || { borderColor: "#d1d5db", icon: "info" };
  };

  const alertStyle = getAlertStyle();

  return (
    <View style={[styles.container, { borderColor: alertStyle.borderColor }]}>  
      <MaterialIcons
        name={alertStyle.icon}
        size={24}
        color={alertStyle.borderColor}
        style={styles.icon}
      />
      <View style={styles.captionField}>
        <Text style={styles.title}>{title}</Text>
        {actionText && (
          <TouchableOpacity onPress={onAction}>
            <Text style={styles.actionText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <MaterialIcons name="close" size={20} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
};

export const AlertService = {
  alert: (type, title, actionText, onAction) => {
    if (alertInstance) {
      alertInstance.showAlert(type, title, actionText, onAction);
    }
  },
};

const AlertContainer = () => {
  const [visible, setVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    title: "",
    actionText: "",
    onAction: null,
  });

  alertInstance = {
    showAlert: (type, title, actionText, onAction) => {
      setAlertConfig({ type, title, actionText, onAction });
      setVisible(true);
    },
    hideAlert: () => {
      setVisible(false);
    },
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          actionText={alertConfig.actionText}
          onClose={() => setVisible(false)}
          onAction={() => {
            alertConfig.onAction && alertConfig.onAction();
            setVisible(false);
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  captionField: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  actionText: {
    fontSize: 14,
    color: "#3b82f6",
    marginTop: 4,
  },
  closeButton: {
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default AlertContainer;



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   Animated,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons"; // Usa este paquete para los iconos

// const { width } = Dimensions.get("window"); // Para hacerlo adaptable

// /**
//  * Componente reutilizable de alerta en React Native.
//  *
//  * @param {boolean} visible - Controla la visibilidad de la alerta.
//  * @param {function} onClose - Función para cerrar la alerta.
//  * @param {string} title - Título de la alerta.
//  * @param {string} message - Mensaje de la alerta.
//  * @param {string} type - Tipo de alerta ("success", "error", "warning", "info").
//  * @param {array} buttons - Array de botones [{ text: "Aceptar", onPress: () => {} }].
//  */

// const CustomAlert = ({ visible, onClose, title, message, type = "info", buttons = [] }) => {
//   const [fadeAnim] = useState(new Animated.Value(0));

//   useEffect(() => {
//     if (visible) {
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   if (!visible) return null;

//   // Definir colores y iconos según el tipo de alerta
//   const alertStyles = {
//     success: { backgroundColor: "#4CAF50", icon: "checkmark-circle-outline" },
//     error: { backgroundColor: "#F44336", icon: "close-circle-outline" },
//     warning: { backgroundColor: "#FFC107", icon: "alert-circle-outline" },
//     info: { backgroundColor: "#2196F3", icon: "information-circle-outline" },
//   };

//   const { backgroundColor, icon } = alertStyles[type] || alertStyles.info;

//   return (
//     <Modal transparent visible={visible} animationType="fade">
//       <View style={styles.overlay}>
//         <Animated.View style={[styles.alertBox, { opacity: fadeAnim }]}>
//           {/* Icono y Título */}
//           <View style={[styles.header, { backgroundColor }]}>
//             <Icon name={icon} size={40} color="#FFF" />
//             <Text style={styles.title}>{title}</Text>
//           </View>

//           {/* Mensaje */}
//           <Text style={styles.message}>{message}</Text>

//           {/* Botones */}
//           <View style={styles.buttonContainer}>
//             {buttons.length > 0 ? (
//               buttons.map((btn, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.button}
//                   onPress={() => {
//                     btn.onPress && btn.onPress();
//                     onClose();
//                   }}
//                 >
//                   <Text style={styles.buttonText}>{btn.text}</Text>
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <TouchableOpacity style={styles.button} onPress={onClose}>
//                 <Text style={styles.buttonText}>Cerrar</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   alertBox: {
//     width: width * 0.8,
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     paddingVertical: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   header: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 5,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FFF",
//     marginLeft: 10,
//   },
//   message: {
//     fontSize: 16,
//     color: "#333",
//     textAlign: "center",
//     marginVertical: 15,
//     paddingHorizontal: 15,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     width: "100%",
//     paddingHorizontal: 15,
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     marginHorizontal: 5,
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default CustomAlert;
