// pantallas/DetallePantalla.js
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, Button, Card } from "react-native-paper";
// se importa firestore desde la configuración
import { firestore } from "../firebase";

export default function DetallePantalla({ route, navigation }) {
  const { libro } = route.params; // se recibe el libro desde la navegación
  const [eliminando, setEliminando] = useState(false); // estado de carga al eliminar

  // función para eliminar el libro con confirmación
  const eliminarLibro = () => {
    Alert.alert(
      "Eliminar libro",
      "¿Estás seguro de que deseas eliminar este libro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setEliminando(true);
              await firestore.collection("libros").doc(libro.id).delete();
              navigation.goBack(); // vuelve a la pantalla anterior
            } catch {
              Alert.alert("Error", "No se pudo eliminar el libro.");
            } finally {
              setEliminando(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={libro.titulo} subtitle={libro.autor} />
        <Card.Content>
          {/* muestra los datos solo si existen */}
          <Text>Estado: {libro.estado}</Text>
          {libro.fechaInicio && <Text>Fecha de inicio: {libro.fechaInicio}</Text>}
          {libro.fechaFin   && <Text>Fecha de fin:    {libro.fechaFin}</Text>}
          {libro.comentario && <Text>Comentario:      {libro.comentario}</Text>}
        </Card.Content>
        <Card.Actions>
          {/* botón para editar el libro */}
          <Button onPress={() => navigation.navigate("EditarLibro", { libro })}>
            Editar
          </Button>
          {/* botón para eliminar el libro */}
          <Button
            onPress={eliminarLibro}
            textColor="red"
            loading={eliminando}
            disabled={eliminando}
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
      {/* botón para volver atrás */}
      <Button style={styles.btnVolver} onPress={() => navigation.goBack()}>
        Volver
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  btnVolver:  { marginTop: 16 },
});
