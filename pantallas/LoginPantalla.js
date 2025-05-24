// pantallas/LoginPantalla.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
// firebase auth
import { auth } from "../firebase";

export default function LoginPantalla({ navigation }) {
  // estados para los campos y el control del formulario
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // función para iniciar sesión con firebase
  const login = async () => {
    setError("");
    setCargando(true);
    try {
      await auth.signInWithEmailAndPassword(correo, clave);
      // la redirección se hace desde NavegacionPrincipal con onAuthStateChanged
    } catch (e) {
      // manejo de errores comunes
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
      {/* título */}
      <Text variant="headlineMedium">Iniciar Sesión</Text>

      {/* campo de correo */}
      <TextInput
        label="Correo"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        disabled={cargando}
      />

      {/* campo de contraseña */}
      <TextInput
        label="Contraseña"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
        style={styles.input}
        disabled={cargando}
      />

      {/* error si hay */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* botón de login */}
      <Button
        mode="contained"
        onPress={login}
        loading={cargando}
        disabled={cargando || !correo.trim() || !clave}
        style={styles.boton}
      >
        Ingresar
      </Button>

      {/* enlace a pantalla de registro */}
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
