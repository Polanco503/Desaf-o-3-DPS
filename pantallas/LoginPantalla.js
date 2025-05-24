// pantallas/LoginPantalla.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { auth } from "../firebase"; // RNFirebase

export default function LoginPantalla({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const login = async () => {
    setError("");
    setCargando(true);
    try {
      await auth.signInWithEmailAndPassword(correo, clave);
      // La navegación la maneja onAuthStateChanged en NavegacionPrincipal
    } catch (e) {
      // Manejo de errores específicos de Firebase Auth
      switch (e.code) {
        case "auth/user-not-found":
          setError("El correo no está registrado.");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta.");
          break;
        case "auth/invalid-email":
          setError("Correo inválido.");
          break;
        case "auth/network-request-failed":
          setError("Error de red. Revisa tu conexión.");
          break;
        default:
          setError("Error al iniciar sesión.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Iniciar Sesión</Text>
      <TextInput
        label="Correo"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        disabled={cargando}
      />
      <TextInput
        label="Contraseña"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
        style={styles.input}
        disabled={cargando}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={login}
        loading={cargando}
        disabled={cargando || !correo.trim() || !clave}
        style={styles.boton}
      >
        Ingresar
      </Button>
      <Button
        onPress={() => navigation.navigate("Registro")}
        disabled={cargando}
      >
        ¿No tienes cuenta? Regístrate
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { marginBottom: 15 },
  boton: { marginBottom: 10 },
  error: { color: "red", marginBottom: 10 },
});
