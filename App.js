import React, { useEffect, useRef, useState } from "react";
import { AuthProvider } from "./src/context/AuthContext";
import MainNavigator from "./src/navigation/MainNavigator";
import * as Notifications from "expo-notifications";
import NetInfo from "@react-native-community/netinfo";
import NoInternetBanner from "./src/components/NoInternetBanner";

// Configurar cómo se manejan las notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [isConnected, setIsConnected] = useState(true);
  const [noInternetMessage, setNoInternetMessage] = useState(null); // Estado para el mensaje
  // const Mensage = "hola este es mensaje";

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setNoInternetMessage(state.isConnected ? null : 'No tienes conexión a internet'); // Actualiza el mensaje
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Listener para recibir notificaciones en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("🔔 Notificación recibida:", notification);
    });

    // Listener para detectar cuando el usuario toca la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("📩 Notificación tocada:", response);
      // Aquí puedes manejar la navegación a una pantalla específica si es necesario
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <AuthProvider>
      <MainNavigator />
      <NoInternetBanner message={noInternetMessage} />
    </AuthProvider>
  );
}
