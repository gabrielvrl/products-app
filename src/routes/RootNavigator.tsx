import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductListScreen from '../screens/ProductListScreen';
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProductList" component={ProductListScreen} />
    </Stack.Navigator>
  );
}
