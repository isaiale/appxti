import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CommentInput from "../../components/CommentInput";
import { baseURL } from "../../services/url";
import { AuthContext } from "../../context/AuthContext";
import socket from "../../services/Socket";

const ModalComponent = ({ visible, onClose, postId }) => {  
  const [newComment, setNewComment] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const { user } = useContext(AuthContext);

  // ✅ Obtener comentarios de la API cuando cambia `postId`
  useEffect(() => {
    const handleShowComments = async (currentPage = 1, limit = 10) => {    
      try {
        console.log("🔍 Buscando comentarios para la publicación:", postId);
        const response = await fetch(
          `${baseURL}/post/comentarios/${postId}?page=${currentPage}&limit=${limit}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          console.warn(`⚠️ Error en la solicitud: ${response.status}`);
          return;
        }

        const data = await response.json();        

        if (!data || data.comentarios.length === 0) {
          console.log("ℹ️ No hay comentarios en esta publicación."); 
          setComentarios([]);
          return;
        }

        // ✅ Cargar los comentarios obtenidos
        setComentarios(data.comentarios);
        console.log("✅ Comentarios cargados:", data.comentarios);
      } catch (error) {
        console.error("❌ Error al mostrar comentarios:", error);
        setComentarios([]);
      }    
    };

    if (postId) {
      handleShowComments();
    }
  }, [postId]); // ✅ Se ejecuta cuando `postId` cambia

  // ✅ Manejo de comentarios en tiempo real con Socket.IO
  useEffect(() => {
    if (!postId) return; // 🔴 Evita ejecutar si no hay `postId`

    const handleNewComment = (newComments) => {
      console.log("✅ Nuevo Comentario recibido:", newComments);

      if (newComments.idcontenido !== postId) {
        console.log("🚫 Comentario no pertenece a este post, ignorando...");
        return;
      }

      setComentarios((prevComments) => [newComments, ...prevComments]);
    };

    socket.on("nuevoComentario", handleNewComment);

    return () => {
      console.log("🚪 Eliminando listener de 'nuevoComentario'");
      socket.off("nuevoComentario", handleNewComment);
    };
  }, [postId]); // ✅ Se ejecuta cuando `postId` cambia

  // ✅ Limpiar `postId` cuando el modal se cierre
  const handleClose = () => {
    setNewComment(""); // ✅ Limpia el input
    setComentarios([]); // ✅ Limpia correctamente los comentarios
    onClose(); // ✅ Cierra el modal
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "El comentario no puede estar vacío.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/post/comentar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_contenido: postId,
          id_usuario: user.id, 
          comentario: newComment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Comentario agregado correctamente:", data.message);
        setNewComment(""); // ✅ Limpiar input después de enviar
      } else {
        Alert.alert("Error", data.message || "Ocurrió un error.");
      }
    } catch (error) {
      console.error("❌ Error al agregar comentario:", error);
      Alert.alert("Error", "No se pudo agregar el comentario.");
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comentarios</Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {comentarios.length === 0 ? (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>
                No hay comentarios aún. ¡Sé el primero en comentar!
              </Text>
            </View>
          ) : (
            <FlatList
              data={comentarios}
              keyExtractor={(item) => item.idcomentario.toString()}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Image
                    source={{ uri: item.fotoPerfil }}
                    style={styles.avatar}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUser}>{item.usuario}</Text>
                    <Text style={styles.commentText}>{item.comentario}</Text>
                    <View style={styles.commentFooter}>
                      <Text style={styles.commentTime}>
                        {item.tiempo_transcurrido}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          )}

          {/* Caja de texto para agregar comentarios */}
          <CommentInput
            placeholder="Escribe tu comentario aquí..."
            value={newComment}
            onChangeText={setNewComment}
            onSend={handleAddComment}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(89, 83, 83, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#333",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 10,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    margin: 10,
  },
  comment: {
    flexDirection: "row",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: "bold",
    color: "#FFF",
  },
  commentText: {
    color: "#FFF",
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  commentTime: {
    color: "#AAA",
    fontSize: 12,
  },
  input: {
    flex: 1,
    color: "#FFF",
    paddingHorizontal: 10,
  },
  noCommentsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  noCommentsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default ModalComponent;
