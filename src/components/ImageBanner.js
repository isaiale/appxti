import React, { useState, useRef, useEffect, useContext } from "react";
import { View, FlatList, Image, Dimensions, StyleSheet, ActivityIndicator, Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { baseURL } from "../services/url";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");
const sliderHeight = 150;
const DEFAULT_IMAGE = "https://likephone.mx/public/iconos/fondo1.png";

const ImageSlider = () => {
  const { user } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const id_partido = user?.id_partido ?? null;

  const fetchImages = async () => {
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setError("No hay conexión a internet");
        setImages([DEFAULT_IMAGE]);
        return;
      }
      
      const response = await fetch(`${baseURL}/imagenes_banner/partido/${id_partido}`); 
      const data = await response.json();
      if (data.success && data.imagenes && Array.isArray(data.imagenes) && data.imagenes.length > 0) {
        const imageUrls = data.imagenes.map(img => img.ruta_imagen);
        setImages(imageUrls);
      } else {
        setError("No se encontraron imágenes");
        setImages([DEFAULT_IMAGE]);
      }
    } catch (err) {
      setError("Error al cargar imágenes");
      setImages([DEFAULT_IMAGE]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      fetchImages();
    }
  }, [images]);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % images.length;
        setActiveIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activeIndex, images]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: width - 54,
    height: sliderHeight,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  }
});

export default ImageSlider;
