import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ModalComponent from "./ModalComment";
import ReactionButton from "../../components/ReactionButton";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../../services/Socket"; // Importa el socket
import { AuthContext } from "../../context/AuthContext";
import { baseURL } from "../../services/url";

const screenWidth = Dimensions.get("window").width;
const imageHeight = (screenWidth * 5) / 4;

const PostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1); // Página actual
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [postID, setPostID] = useState("");
  const { user } = useContext(AuthContext);

  // ✅ Obtener publicaciones desde la API
  const fetchPosts = async (currentPage = 1, limit = 10) => {
    if (isLoading && !refreshing) return;

    if (currentPage === 1) {
      setPosts([]);
      setHasMore(true);
    }

    setIsLoading(true);

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log("⚠️ Sin conexión, cargando posts desde AsyncStorage...");
      const storedPosts = await AsyncStorage.getItem("posts");
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      }
      setIsLoading(false);
      return;
    }

    try {
      const url = `${baseURL}/post/usuario/${user.id}?page=${currentPage}&limit=${limit}`;
      console.log("URL de la API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📌 Respuesta del servidor:", data);

      if (data.posts.length < limit) {
        setHasMore(false);
      }

      // 🔥 Mezclar nuevos posts con los anteriores sin duplicados
      setPosts((prevPosts) => {
        const mergedPosts = [...prevPosts, ...data.posts];
        const uniquePosts = mergedPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id_contenido === post.id_contenido)
        );
        return uniquePosts;
      });

      // Guardar en AsyncStorage solo los últimos 50 posts
      await AsyncStorage.setItem(
        "posts",
        JSON.stringify(data.posts.slice(0, 50))
      );

      setPage(currentPage + 1);
    } catch (error) {
      console.error("❌ Error al obtener publicaciones:", error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // 🚀 Detectar reconexión a Internet y recargar posts después de 3 segundos
  useEffect(() => {
    let timeoutId;

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!isConnected && state.isConnected) {
        console.log("✅ Conexión restablecida, sincronizando posts en 3 segundos...");
        timeoutId = setTimeout(() => {
          setPage(1);
          setHasMore(true);
          fetchPosts(1);
        }, 3000); // Retraso de 3 segundos
      }
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe(); // Limpiar el listener
      if (timeoutId) clearTimeout(timeoutId); // Limpiar el timeout
    };
  }, [isConnected]);

  // ✅ Función para manejar reacciones
  const handleReaction = async (postId, newReaction) => {
    try {
      const response = await fetch(`${baseURL}/post/reaccion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_contenido: postId,
          id_usuario: user.id,
          tipo_reaccion: newReaction,
        }),
      });

      if (!response.ok) throw new Error("Error en la reacción");

      const updatedReaction = await response.json();
      console.log("Reacción actualizada:", updatedReaction);

      // ✅ Actualizar estado localmente
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id_contenido === postId
            ? { ...post, tipo_reaccion: newReaction }
            : post
        )
      );
    } catch (error) {
      console.error("Error al reaccionar:", error);
    }
  };

  // ✅ Manejo del Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Reinicia la paginación y limpia las publicaciones para cargar de nuevo
    setPage(1);
    setHasMore(true);
    await fetchPosts(1);
    setRefreshing(false);
  };

  // ✅ Escuchar evento de Socket.IO para actualizaciones en tiempo real
  useEffect(() => {
    fetchPosts(1);
    socket.on("nuevoPost", (newPost) => {
      console.log("Nuevo post recibido:", newPost);
      // Inserta el nuevo post al inicio de la lista
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    // Limpieza del listener al desmontar
    return () => {
      socket.off("nuevoPost");
    };
  }, [isConnected]);

  // // ✅ Mostrar modal de comentarios con mejor manejo de errores
  const handleShowComments = async (postId) => {
    if (!postId) {
      console.warn("⚠️ No se proporcionó un ID de publicación válido.");
      return;
    }
    console.log("📢 Intentando unirse al post:", postId);

    // Unir al usuario al grupo del post para recibir actualizaciones de comentarios
    socket.emit("joinPost", postId);
    console.log(
      `✅ Usuario unido al post ${postId} con socket ID: ${socket.id}`
    );
    setPostID(postId);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando publicaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 📌 Si no hay publicaciones, mostrar mensaje con icono */}
      {!loading && posts.length === 0 && (
        <View style={styles.noPostsContainer}>
          <Icon name="newspaper-outline" size={80} color="#ccc" />
          <Text style={styles.noPostsText}>Aún no hay publicaciones</Text>
          <Text style={styles.noPostsSubText}>
            Cuando alguien publique algo, aparecerá aquí.
          </Text>
        </View>
      )}

      {/* Lista de publicaciones */}
      {!loading && posts.length > 0 && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id_contenido.toString()} // ID único para cada publicación
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Información del usuario */}
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri:
                      item.foto_perfil ||
                      "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png",
                  }}
                  style={styles.profilePic}
                />
                <View style={styles.userDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{item.autor}</Text>
                    <Icon
                      name="checkmark-circle"
                      size={18}
                      color="#007BFF"
                      style={styles.verifiedIcon}
                    />
                  </View>
                </View>
              </View>

              {/* Imagen de la publicación */}
              {item.ruta_imagen && (
                <Image
                  source={{ uri: item.ruta_imagen }}
                  style={styles.image}
                />
              )}

              {/* Descripción */}
              <Text style={styles.description}>{item.descripcion}</Text>

              <View style={styles.actionsContainer}>
                <View style={styles.reactions}>
                  <ReactionButton
                    type="love"
                    active={item.tipo_reaccion === "me_encanta"}
                    onPress={() =>
                      handleReaction(item.id_contenido, "me_encanta")
                    }
                  />
                  <ReactionButton
                    type="like"
                    active={item.tipo_reaccion === "me_gusta"}
                    onPress={() =>
                      handleReaction(item.id_contenido, "me_gusta")
                    }
                  />
                  <ReactionButton
                    type="dislike"
                    active={item.tipo_reaccion === "no_me_gusta"}
                    onPress={() =>
                      handleReaction(item.id_contenido, "no_me_gusta")
                    }
                  />
                  <Text style={styles.reaccionText}> {item.total_reacciones}</Text>
                </View>

                <TouchableOpacity
                  style={styles.commentButton}
                  onPress={() => handleShowComments(item.id_contenido)}
                >
                  <Icon name="chatbubble-outline" size={25} color="#007BFF" />
                  <Text style={styles.commentText}> {item.total_comentarios}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          // Propiedades para el Pull-to-Refresh
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            hasMore && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>
                  Cargando más publicaciones...
                </Text>
              </View>
            )
          }
          onEndReached={() => {
            if (!isLoading && hasMore) {
              fetchPosts(page); // Cargar más publicaciones cuando se alcanza el final
            }
          }}
          onEndReachedThreshold={0.5} // Llama a onEndReached cuando el scroll esté al 50% del final
        />
      )}

      {/* Modal de comentarios */}
      <ModalComponent
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setPostID("");
          console.log(`🚪 Usuario saliendo del post ${postID}`);
          socket.emit("leavePost", postID); // ✅ Limpiar `postId` al cerrar el modal
        }}
        postId={postID} // ✅ Pasar el ID del post
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  noPostsSubText: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  image: {
    width: "100%",
    height: imageHeight,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reactions: {
    flexDirection: "row",
    alignItems: "center",
  },
  reaccionText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 5,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 5,
  },
});

export default PostsScreen; 