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
import NetInfo from "@react-native-community/netinfo";
import socket from "../../services/Socket";

const ModalComponent = ({ visible, onClose, postId }) => {
  const { user } = useContext(AuthContext);
  const [newComment, setNewComment] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [page, setPage] = useState(1); // Página actual para la paginación
  const [hasMore, setHasMore] = useState(true); // Indica si hay más comentarios para cargar
  const [isConnected, setIsConnected] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        setErrorMessage("No hay conexión a internet.");
      } else {
        setErrorMessage(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleShowComments = async (currentPage = 1, limit = 10) => {
    if (!isConnected) return;
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
        setHasMore(false);
        return;
      }

      // Si es la primera página, reemplaza los comentarios. Si es una página adicional, los agrega.
      setComentarios((prev) =>
        currentPage === 1 ? data.comentarios : [...prev, ...data.comentarios]
      );

      console.log("✅ Comentarios cargados:", data.comentarios);
    } catch (error) {
      console.error("❌ Error al mostrar comentarios:", error);
      setComentarios([]);
    }
  };

  useEffect(() => {
    if (postId) {
      handleShowComments(page);
    }
  }, [postId, isConnected, page]);

  useEffect(() => {
    if (!postId) return;

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
  }, [postId]);

  const handleClose = () => {
    setNewComment("");
    setComentarios([]);
    setPage(1); // Reinicia la página cuando se cierra el modal
    setHasMore(true);
    onClose();
  };

  const handleAddComment = async () => {
    if (!isConnected) {
      return;
    }
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
        setNewComment("");
        setPage(1); // Reinicia la página cuando se agrega un nuevo comentario
        handleShowComments(1); // Recarga los comentarios para incluir el nuevo
      } else {
        Alert.alert("Error", data.message || "Ocurrió un error.");
      }
    } catch (error) {
      console.error("❌ Error al agregar comentario:", error);
      Alert.alert("Error", "No se pudo agregar el comentario.");
    }
  };

  // Maneja la carga de más comentarios al llegar al final de la lista
  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comentarios</Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

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
                  <Image source={{ uri: item.fotoPerfil }} style={styles.avatar} />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUser}>{item.usuario}</Text>
                    <Text style={styles.commentText}>{item.comentario}</Text>
                    <View style={styles.commentFooter}>
                      <Text style={styles.commentTime}>{item.tiempo_transcurrido}</Text>
                    </View>
                  </View>
                </View>
              )}
              onEndReached={handleLoadMore} // Carga más comentarios al llegar al final
              onEndReachedThreshold={0.1} // Umbral de 10% para activar la carga de más comentarios
            />
          )}

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
  errorContainer: {
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "white",
  },
});

export default ModalComponent;
