import React, { useEffect, useState, useRef } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import RootNavigator from './routes/RootNavigator';
import linking from './linking';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Colors } from './styles';
import { ToastProvider } from 'contexts';
import notifee, { EventType } from '@notifee/react-native';

const queryClient = new QueryClient();

export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [initialProductId, setInitialProductId] = useState<number | null>(null);
  const hasNavigatedInitial = useRef(false);

  if (__DEV__) {
    require('../ReactotronConfig');
  }

  useEffect(() => {
    async function handleInitialNotification() {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification?.notification?.data?.productId) {
        setInitialProductId(
          Number(initialNotification.notification.data.productId),
        );
      }
    }
    handleInitialNotification();
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (
        type === EventType.PRESS &&
        detail.notification?.data?.productId &&
        navigationRef.isReady()
      ) {
        navigationRef.navigate('ProductDetail', {
          productId: Number(detail.notification.data.productId),
        });
      }
    });
  }, [navigationRef]);

  useEffect(() => {
    if (
      initialProductId !== null &&
      navigationRef.isReady() &&
      !hasNavigatedInitial.current
    ) {
      navigationRef.navigate('ProductDetail', { productId: initialProductId });
      hasNavigatedInitial.current = true;
    }
  }, [initialProductId, navigationRef]);

  useEffect(() => {
    notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
  }, []);

  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer linking={linking} ref={navigationRef}>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </ToastProvider>
  );
}
