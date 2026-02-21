import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';
import { seedDatabase } from './src/services/firebaseService';

export default function App() {
  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  return (
    <UserProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </UserProvider>
  );
}
