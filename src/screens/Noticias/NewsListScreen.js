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

const { width: screenWidth } = Dimensions.get("window");

const NewsListScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1); // Página actual
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [postID, setPostID] = useState("");
  const { user } = useContext(AuthContext);

  const fetchNews = async (currentPage = 1, limit = 10) => {
    if (isLoading && !refreshing) return;

    if (currentPage === 1) {
      setNews([]);
      setHasMore(true);
    }

    setIsLoading(true);

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log("⚠️ Sin conexión, cargando posts desde AsyncStorage...");
      const storedPosts = await AsyncStorage.getItem("news");
      if (storedPosts) {
        setNews(JSON.parse(storedPosts));
      }
      setIsLoading(false);
      return;
    }

    try {
      const url = `${baseURL}/noticias/usuario/${user.id}?page=${currentPage}&limit=${limit}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    
      if (!response.ok) {
        console.log(`Error en la solicitud: ${response.statusText}`);
      }
    
      const data = await response.json();
      console.log(data);
    
      // Validar si `noticias` existe antes de intentar acceder a sus propiedades
      if (!data.noticias || !Array.isArray(data.noticias)) {
        console.warn("⚠️ No hay noticias disponibles.");
        setHasMore(false);
        return;
      }
    
      if (data.noticias.length < limit) {
        setHasMore(false);
      }
    
      setNews((prevPosts) => {
        const mergedPosts = [...prevPosts, ...data.noticias];
        const uniquePosts = mergedPosts.filter(
          (news, index, self) =>
            index === self.findIndex((p) => p.NoticiaID === news.NoticiaID)
        );
        return uniquePosts;
      });
    
      await AsyncStorage.setItem("news", JSON.stringify(data.noticias.slice(0, 50)));
    
      setPage(currentPage + 1);
    } catch (error) {
      console.error("❌ Error al obtener publicaciones:", error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }    
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!isConnected && state.isConnected) {
        console.log("✅ Conexión restablecida, sincronizando posts...");
        setPage(1);
        setHasMore(true);
        fetchNews(1);
      }
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, [isConnected]);

  const handleReaction = async (postId, newReaction) => {
    try {
      const response = await fetch(`${baseURL}/noticias/reaccion/${postId}/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_reaccion: newReaction
        }),
      });

      if (!response.ok) throw new Error("Error en la reacción");

      const updatedReaction = await response.json();
      console.log("Reacción actualizada:", updatedReaction.totalReacciones);

      setNews((prevPosts) =>
        prevPosts.map((news) =>
          news.NoticiaID === postId
            ? { ...news, ReaccionUsuario: newReaction, TotalReacciones: updatedReaction.totalReacciones }
            : news
        )
      );
    } catch (error) {
      console.error("Error al reaccionar:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchNews(1);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNews(1);
    socket.on("nuevoPost", (newPost) => {
      console.log("Nuevo news recibido:", newPost);
      setNews((prevPosts) => [newPost, ...prevPosts]);
    });

    return () => {
      socket.off("nuevoPost");
    };
  }, [isConnected]);

  const handleShowComments = async (postId) => {
    if (!postId) {
      console.warn("⚠️ No se proporcionó un ID de publicación válido.");
      return;
    }
    console.log("📢 Intentando unirse al news:", postId);

    socket.emit("joinNews", postId);
    console.log(`✅ Usuario unido al news ${postId} con socket ID: ${socket.id}`);
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
      {!loading && news.length === 0 && (
        <View style={styles.noPostsContainer}>
          <Icon name="newspaper-outline" size={80} color="#ccc" />
          <Text style={styles.noPostsText}>Aún no hay publicaciones</Text>
          <Text style={styles.noPostsSubText}>Cuando alguien publique algo, aparecerá aquí.</Text>
        </View>
      )}

      {!loading && news.length > 0 && (
        <FlatList
          data={news}
          keyExtractor={(item) => item.NoticiaID.toString()} 
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.userInfo}>
                <View style={styles.userDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.textnoticia}>{item.TipoNoticia}</Text>
                    <Text style={styles.userName}>{formatDate(item.Fecha)}</Text>
                  </View>                 
                </View>
              </View>

              {item.ImagenesAsociadas && item.ImagenesAsociadas.length > 0 && (
                <Image
                  source={{ uri: item.ImagenesAsociadas[0] }}
                  style={styles.image}
                />
              )}

              <Text style={styles.description}>{item.Titulo}</Text>
              <Text style={styles.description}>{item.Descripcion}</Text>

              <View style={styles.actionsContainer}>
                <View style={styles.reactions}>
                  <ReactionButton
                    type="love"
                    active={item.ReaccionUsuario === "meencanta"}
                    onPress={() => handleReaction(item.NoticiaID, "meencanta")}
                  />
                  <ReactionButton
                    type="like"
                    active={item.ReaccionUsuario === "megusta"}
                    onPress={() => handleReaction(item.NoticiaID, "megusta")}
                  />
                  <ReactionButton
                    type="dislike"
                    active={item.ReaccionUsuario === "nomegusta"}
                    onPress={() => handleReaction(item.NoticiaID, "nomegusta")}
                  />
                  <Text style={styles.reaccionesText}>{item.TotalReacciones}</Text>
                </View>

                <TouchableOpacity
                  style={styles.commentButton}
                  onPress={() => handleShowComments(item.NoticiaID)}
                >
                  <Icon name="chatbubble-outline" size={25} color="#007BFF" />
                  <Text style={styles.commentText}>{item.TotalComentarios}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            hasMore && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Cargando más publicaciones...</Text>
              </View>
            )
          }
          onEndReached={() => {
            if (!isLoading && hasMore) {
              fetchNews(page);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}

      <ModalComponent
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setPostID("");
          console.log(`🚪 Usuario saliendo del news ${postID}`);
          socket.emit("leaveNews", postID);
        }}
        postId={postID}
      />
    </View>
  );
}; 

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
  // image: {
  //   width: "100%",
  //   // height: width * 1,
  //   height: imageHeight,
  //   borderRadius: 5,
  //   resizeMode: "cover",
  // },
  image: {
    width: screenWidth - 40,
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
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
  reaccionesText: {
    fontSize: 17,
    color: "#007BFF",
    marginTop: 8,
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
    justifyContent: "space-between",  // Asegura que los elementos estén en los extremos
    alignItems: "center",
    marginBottom: 5,
  },
  userDetails: {
    flexDirection: "row",  // Mantiene la dirección horizontal
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",  // Esto separa los dos elementos a los extremos
    width: "100%",  // Esto asegura que el contenedor ocupe todo el espacio disponible
  },
  textnoticia: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
  noConnectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffdddd",
  },
  noConnectionText: { color: "red", fontSize: 16 },
});

export default NewsListScreen;
