// NavegacionPrincipal.js
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "../firebase";
import LoginPantalla from "../pantallas/LoginPantalla";
import RegistroPantalla from "../pantallas/RegistroPantalla";
import LibrosPantalla from "../pantallas/LibrosPantalla";
import DetallePantalla from "../pantallas/DetallePantalla";
import FormLibroPantalla from "../pantallas/FormLibroPantalla";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

export default function NavegacionPrincipal() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const suscripcion = auth.onAuthStateChanged(user => {
      setUsuario(user);
      setCargando(false);
    });
    return suscripcion;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {usuario ? (
        <>
          <Stack.Screen name="Libros" component={LibrosPantalla} />
          <Stack.Screen name="Detalle" component={DetallePantalla} />
          <Stack.Screen name="EditarLibro" component={FormLibroPantalla} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginPantalla} />
          <Stack.Screen name="Registro" component={RegistroPantalla} />
        </>
      )}
    </Stack.Navigator>
  );
}
