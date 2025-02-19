import React, { useState } from "react";
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
import CustomButton from "./CustomButton";
import CommentInput from "./CommentInput";

const CustomModal = ({
  visible,
  onClose,
  comments = [],
  onAddComment,
  showComments = true,
  buttons = [],
}) => {  
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "El comentario no puede estar vacío.");
      return;
    }

    if (onAddComment) {
      onAddComment(newComment.trim());
    }
    setNewComment(""); // Limpiar el campo de entrada
    Alert.alert("Comentario agregado", "Tu comentario ha sido publicado.");
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Encabezado */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {showComments ? "Comentarios" : "Opciones"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {showComments ? (
            <>
            {/* Verifica si hay comentarios */}
            {comments.length === 0 ? (
              <View style={styles.noCommentsContainer}>                
                <Text style={styles.noCommentsText}>No hay comentarios aún. ¡Sé el primero en comentar!</Text>
              </View>
            ) : (
              <FlatList
                data={comments}
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
                        <Text style={styles.commentTime}>{item.tiempo_transcurrido}</Text>
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
          </>          
          ) : (
            <View>
              {buttons.map((button, index) => (
                <CustomButton
                key={index}
                title={button.label}
                onPress={button.onPress}
                color={button.color || ""}
                textColor={button.textColor || ""}
                icon={button.icon}
                iconPosition={button.iconPosition || "left"}
                style={styles.botoncomponente}
                  // style={button.style}
                />
              ))}
            </View>
          )}
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
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    color: "#FFF",
    paddingHorizontal: 10,
  },
  botoncomponente: {
    margin: 10,
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

export default CustomModal;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Modal,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// const CommentsModal = ({ visible, onClose, comments, onAddComment }) => {
//   const [newComment, setNewComment] = useState("");

//   const handleAddComment = () => {
//     if (!newComment.trim()) {
//       Alert.alert("Error", "El comentario no puede estar vacío.");
//       return;
//     }

//     onAddComment(newComment.trim());
//     setNewComment(""); // Limpiar el campo de entrada
//     Alert.alert("Comentario agregado", "Tu comentario ha sido publicado.");
//   };

//   return (
//     <Modal
//       transparent
//       visible={visible}
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           {/* Encabezado */}
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Comentarios</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Icon name="close" size={24} color="#FFF" />
//             </TouchableOpacity>
//           </View>

//           {/* Lista de comentarios */}
//           <FlatList
//             data={comments}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.comment}>
//                 <Image source={{ uri: item.avatar }} style={styles.avatar} />
//                 <View style={styles.commentContent}>
//                   <Text style={styles.commentUser}>{item.user}</Text>
//                   <Text style={styles.commentText}>{item.text}</Text>
//                   <View style={styles.commentFooter}>
//                     <Text style={styles.commentTime}>{item.time}</Text>
//                     <TouchableOpacity style={styles.likeButton}>
//                       <Icon name="heart-outline" size={16} color="#FFF" />
//                       <Text style={styles.likeText}> {item.likes}</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             )}
//           />

//           {/* Caja de texto para agregar comentarios */}
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Escribe un comentario..."
//               placeholderTextColor="#999"
//               value={newComment}
//               onChangeText={setNewComment}
//             />
//             <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
//               <Icon name="send-outline" size={25} color="#FFF" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(122, 118, 118, 0.7)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: "#333",
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//     padding: 10,
//     maxHeight: "80%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FFF",
//   },
//   comment: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   commentContent: {
//     flex: 1,
//   },
//   commentUser: {
//     fontWeight: "bold",
//     color: "#FFF",
//   },
//   commentText: {
//     color: "#FFF",
//   },
//   commentFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 5,
//   },
//   commentTime: {
//     color: "#AAA",
//     fontSize: 12,
//   },
//   likeButton: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   likeText: {
//     color: "#FFF",
//     marginLeft: 5,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#444",
//     borderRadius: 10,
//     marginTop: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   input: {
//     flex: 1,
//     color: "#FFF",
//     paddingHorizontal: 10,
//   },
//   sendButton: {
//     // backgroundColor: "#007BFF",
//     padding: 10,
//     borderRadius: 20,
//   },
// });

// export default CommentsModal;
