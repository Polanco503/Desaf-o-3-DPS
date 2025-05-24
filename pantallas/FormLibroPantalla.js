// pantallas/FormLibroPantalla.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// firebase para auth y base de datos
import { auth, firestore } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp
} from '@react-native-firebase/firestore';

export default function FormLibroPantalla({ navigation, route }) {
  const libro = route.params?.libro; // se recibe el libro si se va a editar
  const esEditar = !!libro;

  // estados para los campos del formulario
  const [titulo, setTitulo] = useState(libro?.titulo || '');
  const [autor, setAutor] = useState(libro?.autor || '');
  const [estado, setEstado] = useState(libro?.estado || 'por leer');
  const [fechaInicio, setFechaInicio] = useState(libro?.fechaInicio || '');
  const [fechaFin, setFechaFin] = useState(libro?.fechaFin || '');
  const [comentario, setComentario] = useState(libro?.comentario || '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // cambia el título de la pantalla según el modo
  useEffect(() => {
    navigation.setOptions({
      title: esEditar ? 'Editar Libro' : 'Agregar Libro',
    });
  }, []);

  // guarda o actualiza el libro en firestore
  const guardarLibro = async () => {
    setError('');
    if (!titulo.trim() || !autor.trim()) {
      setError('El título y autor son obligatorios.');
      return;
    }
    if (!auth.currentUser) {
      setError('No hay usuario autenticado.');
      return;
    }

    setGuardando(true);
    try {
      if (esEditar) {
        const refLibro = doc(firestore, 'libros', libro.id);
        await updateDoc(refLibro, { titulo, autor, estado, fechaInicio, fechaFin, comentario });
      } else {
        const col = collection(firestore, 'libros');
        await addDoc(col, {
          uid: auth.currentUser.uid,
          titulo,
          autor,
          estado,
          fechaInicio,
          fechaFin,
          comentario,
          creado: serverTimestamp(),
        });
      }

      setGuardando(false);
      navigation.goBack(); // vuelve a la pantalla anterior

    } catch (e) {
      console.error(e);
      setError('No se pudo guardar el libro.');
      setGuardando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* título de la pantalla */}
      <Text variant="headlineMedium" style={{ marginBottom: 12 }}>
        {esEditar ? 'Editar Libro' : 'Nuevo Libro'}
      </Text>

      {/* campos del formulario */}
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

      {/* selector de estado */}
      <Text style={{ marginTop: 10 }}>Estado:</Text>
      <RadioButton.Group onValueChange={setEstado} value={estado}>
        <View style={styles.radioRow}>
          <RadioButton value="por leer" /><Text>Por leer</Text>
          <RadioButton value="leyendo" /><Text>Leyendo</Text>
          <RadioButton value="completado" /><Text>Completado</Text>
        </View>
      </RadioButton.Group>

      {/* campos opcionales */}
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

      {/* error si existe */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* botones de acción */}
      <Button
        mode="contained"
        onPress={guardarLibro}
        loading={guardando}
        disabled={guardando}
        style={styles.boton}
      >
        {esEditar ? 'Guardar Cambios' : 'Agregar Libro'}
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
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 15 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  error: { color: 'red', marginBottom: 10 },
  boton: { marginBottom: 10 },
});
