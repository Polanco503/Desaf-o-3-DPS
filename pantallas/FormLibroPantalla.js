// pantallas/FormLibroPantalla.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, RadioButton } from "react-native-paper";
import { auth, firestore } from "../firebase"; // API modular

export default function FormLibroPantalla({ navigation, route }) {
  const libro    = route.params?.libro;
  const esEditar = !!libro;

  const [titulo,      setTitulo]      = useState(libro?.titulo      || "");
  const [autor,       setAutor]       = useState(libro?.autor       || "");
  const [estado,      setEstado]      = useState(libro?.estado      || "por leer");
  const [fechaInicio, setFechaInicio] = useState(libro?.fechaInicio || "");
  const [fechaFin,    setFechaFin]    = useState(libro?.fechaFin    || "");
  const [comentario,  setComentario]  = useState(libro?.comentario  || "");
  const [error,       setError]       = useState("");
  const [guardando,   setGuardando]   = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: esEditar ? "Editar Libro" : "Agregar Libro",
    });
  }, []);

  const guardarLibro = async () => {
    setError("");
    if (!titulo.trim() || !autor.trim()) {
      setError("El título y autor son obligatorios.");
      return;
    }
    if (!auth.currentUser) {
      setError("No hay usuario autenticado.");
      return;
    }

    setGuardando(true);
    try {
      const coleccion = firestore.collection("libros");
      if (esEditar) {
        await coleccion.doc(libro.id).update({
          titulo,
          autor,
          estado,
          fechaInicio,
          fechaFin,
          comentario,
        });
      } else {
        await coleccion.add({
          uid:     auth.currentUser.uid,
          titulo,
          autor,
          estado,
          fechaInicio,
          fechaFin,
          comentario,
          creado: firestore.FieldValue.serverTimestamp(),
        });
      }
      navigation.goBack();
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar el libro.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 12 }}>
        {esEditar ? "Editar Libro" : "Nuevo Libro"}
      </Text>

      <TextInput
        label="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        disabled={guardando}
      />
      <TextInput
        label="Autor"
        value={autor}
        onChangeText={setAutor}
        style={styles.input}
        disabled={guardando}
      />

      <Text style={{ marginTop: 10 }}>Estado:</Text>
      <RadioButton.Group onValueChange={setEstado} value={estado}>
        <View style={styles.radioRow}>
          <RadioButton value="por leer" /><Text>Por leer</Text>
          <RadioButton value="leyendo"  /><Text>Leyendo</Text>
          <RadioButton value="completado"/><Text>Completado</Text>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Fecha de inicio (opcional)"
        value={fechaInicio}
        onChangeText={setFechaInicio}
        placeholder="YYYY-MM-DD"
        style={styles.input}
        disabled={guardando}
      />
      <TextInput
        label="Fecha de fin (opcional)"
        value={fechaFin}
        onChangeText={setFechaFin}
        placeholder="YYYY-MM-DD"
        style={styles.input}
        disabled={guardando}
      />
      <TextInput
        label="Comentario (opcional)"
        value={comentario}
        onChangeText={setComentario}
        multiline
        numberOfLines={3}
        style={styles.input}
        disabled={guardando}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={guardarLibro}
        loading={guardando}
        disabled={guardando}
        style={styles.boton}
      >
        {esEditar ? "Guardar Cambios" : "Agregar Libro"}
      </Button>
      <Button
        onPress={() => navigation.goBack()}
        disabled={guardando}
        style={styles.boton}
      >
        Cancelar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  input:     { marginBottom: 15 },
  radioRow:  { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  error:     { color: "red", marginBottom: 10 },
  boton:     { marginBottom: 10 },
});
