import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoInternetBanner = ({ message }) => {
  if (!message) {
    return null; // No mostrar nada si no hay mensaje
  }

  return (
    <View style={styles.noInternet}>
      <Text style={styles.noInternetText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noInternet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
  },
  noInternetText: {
    color: 'white',
  },
});

export default NoInternetBanner;