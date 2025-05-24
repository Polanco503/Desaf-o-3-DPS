// App.js
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import NavegacionPrincipal from './navegacion/NavegacionPrincipal';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <NavegacionPrincipal />
      </NavigationContainer>
    </PaperProvider>
  );
}
