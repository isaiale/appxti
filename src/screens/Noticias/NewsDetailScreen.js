import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewsDetailScreen({ route }) {
    const { id } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalle de Noticia</Text>
            <Text style={styles.content}>Mostrando el contenido de la noticia con ID: {id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    content: {
        fontSize: 16,
    },
});
