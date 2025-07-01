import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { WatchlistProvider } from './src/context/WatchlistContext';

export default function App() {
  return (
    <WatchlistProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </WatchlistProvider>
  );
}
