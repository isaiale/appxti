import React, { useContext, useEffect, useState, useCallback } from "react";
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
import Colors from "../../config/global_colors";

const ModalComponent = ({ visible, onClose, postId }) => {
  const { user } = useContext(AuthContext);
  const [newComment, setNewComment] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setErrorMessage(state.isConnected ? null : "No hay conexión a internet.");
    });
    return () => unsubscribe();
  }, []);

  const resetState = () => {
    setComentarios([]);
    setNewComment("");
    setPage(1);
    setHasMore(true);
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      resetState(); 
      if (postId) {
        fetchComments(1);
      }
    }
  }, [postId, visible]);

  const fetchComments = useCallback(
    async (currentPage) => {
      if (!isConnected || loading || !hasMore) return;

      setLoading(true);

      try {
        const response = await fetch(
          `${baseURL}/noticias/comentarios/${postId}?page=${currentPage}&limit=${limit}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          console.warn(`⚠️ Error en la solicitud: ${response.status}`);
          return;
        }

        const data = await response.json();
        if (!data || data.comentarios.length === 0) {
          setHasMore(false);
          return;
        }

        setComentarios((prev) => [...prev, ...data.comentarios]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(data.comentarios.length === limit);
      } catch (error) {
        console.error("❌ Error al cargar comentarios:", error);
      } finally {
        setLoading(false);
      }
    },
    [isConnected, loading, hasMore, postId]
  );

  useEffect(() => {
    if (!postId) return;

    const handleNewComment = (newsComentarios) => {
      if (newsComentarios.idcontenido !== postId) return;
      setComentarios((prev) => [newsComentarios, ...prev]);
    };

    socket.on("newsComentarios", handleNewComment);

    return () => {
      socket.off("newsComentarios", handleNewComment);
    };
  }, [postId]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchComments(page);
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleAddComment = async () => {
    if (!isConnected || !newComment.trim()) {
      Alert.alert("Error", "El comentario no puede estar vacío.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/noticias/comentario/${postId}/${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comentario: newComment }),
        }
      );

      if (response.ok) {
        setNewComment("");
      } else {
        Alert.alert("Error", "No se pudo agregar el comentario.");
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

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {comentarios.length === 0 && !loading ? (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>
                No hay comentarios aún. ¡Sé el primero en comentar!
              </Text>
            </View>
          ) : (
            <>
              <FlatList
                data={comentarios}
                keyExtractor={(item) => String(item.ComentarioID)}
                renderItem={({ item }) => (
                  <View style={styles.comment}>
                    <Image
                      source={{ uri: item.foto_perfil }}
                      style={styles.avatar}
                    />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUser}>
                        {item.NombreUsuario}
                      </Text>
                      <Text style={styles.commentText}>{item.Comentario}</Text>
                    </View>
                  </View>
                )}
              />

              {hasMore && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={handleLoadMore}
                  disabled={loading}
                >
                  <Text style={styles.loadMoreText}>
                    {loading ? "Cargando..." : "Ver más comentarios"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
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
  loadMoreText: {
    fontSize: 18,
    color: Colors.primary,
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
