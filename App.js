import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'; // Importando componentes para a tela de carregamento
import { useFonts } from 'expo-font';
import Routes from './Routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Raleway-Regular': require('./assets/fonts/Raleway-Regular.ttf'),
    'Raleway-Bold': require('./assets/fonts/Raleway-Bold.ttf'),
    'Raleway-SemiBold': require('./assets/fonts/Raleway-SemiBold.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter_18pt-Regular.ttf'),
  });

  // Se as fontes ainda não foram carregadas, exibe a tela de carregamento
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando fontes...</Text>
      </View>
    );
  }

  // Quando as fontes estiverem carregadas, renderiza as rotas
  return <Routes />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adicionando um fundo branco para a tela de carregamento
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Raleway-SemiBold', // Usando uma fonte carregada
    color: '#333', // Cor de texto mais suave
  },
});
