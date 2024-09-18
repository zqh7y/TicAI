import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';

import Home from './screens/Home';
import Config from './screens/Config';

import { registerRootComponent } from 'expo';

const Stack = createStackNavigator();

function App({ navigation, route }) {
  const [loaded] = useFonts({
    "Play": require('./fonts/Play.ttf'),
    "Outfit": require('./fonts/Outfit.ttf'),
    "Sign": require('./fonts/Sign.ttf'),
    "Write": require('./fonts/Write.ttf'),
    "Sans": require('./fonts/Sans.ttf'),
  });

  if (!loaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} navigation={navigation} />
        <Stack.Screen name="Config" component={Config} navigation={navigation} route={route} />
      </Stack.Navigator>
      <StatusBar style="auto" />
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

export default App;

// Registering the main component
registerRootComponent(App);
