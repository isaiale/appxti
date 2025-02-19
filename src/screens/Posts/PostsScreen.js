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
// import CommentsModal from "../../components/CommentsModal";
import ModalComponent from "./ModalComment";
import ReactionButton from "../../components/ReactionButton";
import socket from "../../services/Socket"; // Importa el socket
import { AuthContext } from "../../context/AuthContext";
import { baseURL } from "../../services/url";

const { width } = Dimensions.get("window");

const PostsScreen = () => {
  const [posts, setPosts] = useState([]); // Almacena publicaciones desde la API
  // const [ComentPosts, setComentPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Indicador de carga inicial (opcional)
  // const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1); // Página actual
  const [hasMore, setHasMore] = useState(true); // Indica si hay más datos
  const [isLoading, setIsLoading] = useState(false); // Controla la consulta en curso
  const [refreshing, setRefreshing] = useState(false); // Controla el pull-to-refresh
  const [postID, setPostID] = useState("");

  const { user } = useContext(AuthContext);

  // ✅ Obtener publicaciones desde la API
  const fetchPosts = async (currentPage = 1, limit = 10) => {
    // Evita hacer consultas si ya se está cargando o si no hay más datos (excepto en el refresh)    
    if (isLoading && !refreshing) return;

    // Si es la primera página en un refresh, limpia la lista
    if (currentPage === 1) {
      setPosts([]);
      setHasMore(true);
    }

    setIsLoading(true);

    let id_usuario = user.id; // Obtener el ID del partido del usuario
    console.log("ID Partido:", id_usuario);

    try {
      const url = `${baseURL}/post/${id_usuario}?page=${currentPage}&limit=${limit}`;
      console.log("URL de la API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json(); // Convertir respuesta a JSON
      console.log("Respuesta del servidor:", data);

      if (data.posts.length < limit) {
        setHasMore(false); // No hay más datos
      }

      setPosts((prevPosts) => [...prevPosts, ...data.posts]); // Agrega las nuevas publicaciones
      setPage(currentPage + 1); // Incrementa la página
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
    } finally {
      setIsLoading(false);
      setLoading(false);
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
    fetchPosts(); // Obtener publicaciones al cargar la pantalla
    socket.on("nuevoPost", (newPost) => {
      console.log("Nuevo post recibido:", newPost);
      // Inserta el nuevo post al inicio de la lista
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    // Limpieza del listener al desmontar
    return () => {
      socket.off("nuevoPost");
    };
  }, []);

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
                    onPress={() => console.log("Me encanta presionado")}
                  />
                  <ReactionButton
                    type="like"
                    onPress={() => console.log("Me gusta presionado")}
                  />
                  <ReactionButton
                    type="dislike"
                    onPress={() => console.log("No me gusta presionado")}
                  />
                </View>
                <TouchableOpacity
                  style={styles.commentButton}
                  onPress={() => handleShowComments(item.id_contenido)}
                >
                  <Icon name="chatbubble-outline" size={25} color="#007BFF" />
                  <Text style={styles.commentText}> Ver Comentarios</Text>
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
        // comments={ComentPosts || []}
        postId={postID} // ✅ Pasar el ID del post
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F0F0F0",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: width * 0.9,
    borderRadius: 8,
    resizeMode: "cover",
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  reactions: {
    flexDirection: "row",
  },
  reactionText: {
    fontSize: 16,
    marginRight: 10,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    fontSize: 17,
    color: "#007BFF",
    marginLeft: 5,
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#EEE",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  sendButton: {
    // backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 20,
    marginLeft: 5,
  },

  /* para la parte de nombre usuario  */
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userDetails: {
    flex: 1,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 50,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  verifiedIcon: {
    marginLeft: 5,
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
    color: "#777",
    textAlign: "center",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostsScreen;
