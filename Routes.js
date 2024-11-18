// Routes.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Inicio from './Inicio'; // Importando a tela de início
import Login from './Login';
import Cadastro from './Cadastro';
import TelaInicial from './TelaInicial';
import PerfilScreen from './PerfilScreen';
import MessagesScreen from './MessagesScreen';
import UsuariosConversas from './UsuariosConversas';
import PesquisarScreen from './PesquisarScreen';


const Stack = createStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
        <Stack.Screen name="PerfilScreen" component={PerfilScreen} />
        <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
        <Stack.Screen name="PesquisarScreen" component={PesquisarScreen} />
        <Stack.Screen name="UsuariosConversas" component={UsuariosConversas} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
