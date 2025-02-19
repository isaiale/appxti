import React, { useEffect } from "react";
import { AuthProvider } from "./src/context/AuthContext";
import MainNavigator from "./src/navigation/MainNavigator";
import * as Notifications from "expo-notifications";

export default function App() {
  useEffect(() => {
    // Listener para notificaciones recibidas
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificación Recibida:", notification.request.content.body);
      }
    );

    // Cleanup al desmontar
    return () => {
      subscription.remove();        
    };
  }, []);

  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
