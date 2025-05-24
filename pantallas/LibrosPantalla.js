// pantallas/LibrosPantalla.js
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { IconButton } from 'react-native-paper';
import { Text, FAB, Appbar, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { auth, firestore } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot
} from "@react-native-firebase/firestore";

export default function LibrosPantalla() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const usuario = auth.currentUser;
    if (!usuario) return;

    // Construye la query modular
    const q = query(
      collection(firestore, "libros"),
      where("uid", "==", usuario.uid)
    );

    // Realtime listener modular
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLibros(data);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await auth.signOut();
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <Text>Cargando libros...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <IconButton icon="door-closed" onPress={cerrarSesion}/>
        <Appbar.Content title="Mis libros" />
      </Appbar.Header>

      {libros.length === 0 ? (
        <View style={styles.cargando}>
          <Text>No hay libros agregados.</Text>
        </View>
      ) : (
        <FlatList
          data={libros}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onPress={() =>
                navigation.navigate("Detalle", { libro: item })
              }
            >
              <Card.Title title={item.titulo} subtitle={item.autor} />
              <Card.Content>
                <Text>Estado: {item.estado}</Text>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("EditarLibro")}
        label="Agregar libro"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
});
