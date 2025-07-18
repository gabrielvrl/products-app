import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import useAppStartupChecks from 'hooks/useAppStartupChecks';
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  useAppStartupChecks();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
