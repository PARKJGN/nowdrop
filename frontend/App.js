import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './src/pages/Index';
import Routes from './src/pages/Routes';
import MapPage from './src/pages/Map';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Index"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Index" component={Index} />
          <Stack.Screen name="Routes" component={Routes} />
          <Stack.Screen name="Map" component={MapPage} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
