import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const noticias = [
    { id: '1', title: 'Noticia 1' },
    { id: '2', title: 'Noticia 2' },
    { id: '3', title: 'Noticia 3' },
];

export default function NewsListScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <FlatList
                data={noticias}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Detalle', { id: item.id })}>
                        <Text style={styles.item}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
    },
});

