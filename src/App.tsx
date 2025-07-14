import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './routes/RootNavigator';

import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Colors } from './styles';

const queryClient = new QueryClient();

export default function App() {
  if (__DEV__) {
    require('../ReactotronConfig');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
