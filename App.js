import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';

import Home from './screens/Home';

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    "Play": require('./fonts/Play.ttf'),
    "Outfit": require('./fonts/Outfit.ttf'),
    "Sign": require('./fonts/Sign.ttf'),
  })

  if (!loaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
