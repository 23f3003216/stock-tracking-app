// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import ViewAllScreen from '../screens/ViewAllScreen';
import ProductScreen from '../screens/ProductScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator>
    {/* This is the entry screen, with Explore + Watchlist tabs */}
    <Stack.Screen
      name="HomeTabs"
      component={BottomTabs}
      options={{ headerShown: false }}
    />

    {/* Other screens navigated to from tabs */}
    <Stack.Screen name="ViewAll" component={ViewAllScreen} />
    <Stack.Screen name="ProductScreen" component={ProductScreen} />
  </Stack.Navigator>
);

export default StackNavigator;
