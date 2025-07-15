import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './routes/RootNavigator';
import linking from './linking';

import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Colors } from './styles';
import { ToastProvider } from 'contexts';

const queryClient = new QueryClient();

export default function App() {
  if (__DEV__) {
    require('../ReactotronConfig');
  }

  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer linking={linking}>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </ToastProvider>
  );
}
