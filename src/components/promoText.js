import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FancyText = ({ phrase, styles: customStyles }) => {
    const parts = phrase.split(/(\$\d+|%\d+|\d+[%$]?)/);
  
    const combinedParts = [];
    for (let i = 0; i < parts.length; i++) {
      if (/\$\d+|%\d+|\d+[%$]?/.test(parts[i])) {
        const prevPart = parts[i - 1] || '';
        const nextPart = parts[i + 1] || '';
  
        if (prevPart && !/\$\d+|%\d+|\d+[%$]?/.test(prevPart) && !/\s/.test(prevPart)) {
          combinedParts.push(prevPart + ' ' + parts[i]); // Une primera palabra con número
          parts[i - 1] = ''; // Evita duplicación
        } else if (nextPart && !/\$\d+|%\d+|\d+[%$]?/.test(nextPart) && !/\s/.test(nextPart)) {
          combinedParts.push(parts[i] + ' ' + nextPart); // Une número con siguiente palabra
          parts[i + 1] = ''; // Evita duplicación
        } else {
          combinedParts.push(parts[i]); // Solo el número
        }
      } else if (parts[i] !== '') {
        combinedParts.push(parts[i]);
      }
    }
  
    // Agrupar correctamente las líneas
    const lines = [];
    let tempLine = [];
    combinedParts.forEach((part, index) => {
      if (index === 0 || /\$\d+|%\d+|\d+[%$]?/.test(part)) {
        if (tempLine.length > 0) lines.push(tempLine);
        tempLine = [part]; // Nueva línea con número o primera palabra
      } else {
        tempLine.push(part);
      }
    });
    if (tempLine.length > 0) lines.push(tempLine);
  
    return (
      <View style={[styles.container, customStyles?.container]}>
        {lines.map((line, index) => (
          <View key={index} style={styles.line}>
            {line.map((part, idx) => (
              <Text
                key={idx}
                style={[
                  /\$\d+|%\d+|\d+[%$]?/.test(part) ? styles.numberText : styles.normalText,
                  customStyles?.text
                ]}
              >
                {part}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupará el espacio disponible
        width: '50%', // Se ajusta al ancho del padre
        // flexDirection: 'column',
        // alignItems: 'flex-start',
        textAlign: "center",
        // alignItems: "center",
        // borderWidth: 2,
        // borderColor: 'black',
        // padding: 1, // Espaciado intern
        marginLeft: 60,
      },      
    line: {
      flexDirection: 'row',
      flexWrap: 'nowrap', // Para que las palabras no se rompan incorrectamente
    //   borderWidth: 2, // Grosor del borde
    },
    normalText: {
      fontSize: 20,
    },
    numberText: {
      fontSize: 30,
      fontWeight: 'bold',
    },
  });
  
  export default FancyText;
  