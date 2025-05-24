// pantallas/RegistroPantalla.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
// ✅ Imports de la API modular:
import { getAuth, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";

export default function RegistroPantalla({ navigation }) {
  const [correo, setCorreo]   = useState("");
  const [clave,  setClave]    = useState("");
  const [error,  setError]    = useState("");
  const [cargando, setCargando] = useState(false);

  // Obtén la instancia de Auth de la app por defecto
  const auth = getAuth(getApp());

  const registrar = async () => {
    setError("");
    if (!correo.trim() || !clave.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    if (clave.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      // 🚀 Esta es la llamada correcta a la API modular:
      const userCred = await createUserWithEmailAndPassword(
        auth,
        correo.trim(),
        clave
      );
      console.log("Usuario registrado:", userCred.user.uid);
      // onAuthStateChanged en NavegacionPrincipal se encargará de navegar
    } catch (e) {
      console.error("Error registrando usuario:", e);
      // Maneja códigos de error específicos:
      switch (e.code) {
        case "auth/email-already-in-use":
          setError("El correo ya está registrado.");
          break;
        case "auth/invalid-email":
          setError("Correo inválido.");
          break;
        case "auth/weak-password":
          setError("Contraseña muy débil (mínimo 6 caracteres).");
          break;
        case "auth/network-request-failed":
          setError("Error de red. Revisa tu conexión.");
          break;
        default:
          setError("No se pudo registrar el usuario.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Registro</Text>
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
        onPress={registrar}
        loading={cargando}
        disabled={cargando || !correo.trim() || !clave.trim()}
        style={styles.boton}
      >
        Registrarse
      </Button>
      <Button
        onPress={() => navigation.navigate("Login")}
        disabled={cargando}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input:     { marginBottom: 15 },
  boton:     { marginBottom: 10 },
  error:     { color: "red", marginBottom: 10 },
});
