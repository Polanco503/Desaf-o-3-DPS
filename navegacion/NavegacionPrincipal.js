// NavegacionPrincipal.js
import React, { useState, useEffect } from "react";
// stack para navegación entre pantallas
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// firebase para autenticación
import { auth } from "../firebase";

// pantallas de la app
import LoginPantalla from "../pantallas/LoginPantalla";
import RegistroPantalla from "../pantallas/RegistroPantalla";
import LibrosPantalla from "../pantallas/LibrosPantalla";
import DetallePantalla from "../pantallas/DetallePantalla";
import FormLibroPantalla from "../pantallas/FormLibroPantalla";

// indicador de carga
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

export default function NavegacionPrincipal() {
  const [usuario, setUsuario] = useState(null); // usuario actual
  const [cargando, setCargando] = useState(true); // estado de carga

  useEffect(() => {
    // escucha cambios en la sesión del usuario
    const suscripcion = auth.onAuthStateChanged(user => {
      setUsuario(user);
      setCargando(false);
    });
    return suscripcion; // cancela la suscripción al desmontar
  }, []);

  if (cargando) {
    // muestra indicador mientras se verifica sesión
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {usuario ? (
        // si hay sesión, muestra las pantallas principales
        <>
          <Stack.Screen name="Libros" component={LibrosPantalla} />
          <Stack.Screen name="Detalle" component={DetallePantalla} />
          <Stack.Screen name="EditarLibro" component={FormLibroPantalla} />
        </>
      ) : (
        // si no hay sesión, muestra login y registro
        <>
          <Stack.Screen name="Login" component={LoginPantalla} />
          <Stack.Screen name="Registro" component={RegistroPantalla} />
        </>
      )}
    </Stack.Navigator>
  );
}
