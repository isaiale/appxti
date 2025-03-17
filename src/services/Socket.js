import io from "socket.io-client";
import { socketURL } from "./url"; // Asegúrate de que sea HTTPS

const socket = io(socketURL, {
  transports: ["websocket"], // Usar solo WebSocket
  reconnection: true, // Habilitar reintentos de conexión
  reconnectionAttempts: 10, // Intentar reconectar 10 veces
  reconnectionDelay: 3000, // Esperar 3 segundos entre intentos
  path: "/socket.io/", // Ruta del socket en el servidor
  secure: true, // Importante si usas HTTPS
  rejectUnauthorized: false, // Evita problemas con certificados SSL autofirmados
}); 

socket.on("connect", () => {
  console.log(`✅ Conectado a Socket.IO con ID: ${socket.id}`);
});

socket.on("connect_error", (err) => {
  console.log("❌ Error de conexión con Socket.IO:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Desconectado del servidor:", reason);
});

export default socket;
