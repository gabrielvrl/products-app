import React, { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Geolocation from 'react-native-geolocation-service';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import useAppStartupChecks from 'hooks/useAppStartupChecks';
import {
  checkLocationPermission,
  getCountryFromCoords,
  requestLocationPermission,
  requestPermissions,
} from 'utils/permissions';
import { PermissionStatus } from 'react-native-permissions';
import {
  ActivityIndicator,
  Button,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useToast } from 'contexts';

const Stack = createNativeStackNavigator();

function LocationRequiredScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.centered}>
      <Text>You can only use the app if you allow location access.</Text>
      <Button title="Try Again" onPress={onRetry} />
    </View>
  );
}

function OnlyUSAScreen() {
  return (
    <View style={styles.centered}>
      <Text>The app is only available in the United States.</Text>
    </View>
  );
}

export default function RootNavigator() {
  useAppStartupChecks();
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const [isInUSA, setIsInUSA] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const { show } = useToast();

  const checkLocation = useCallback(async () => {
    setChecking(true);
    let status = await checkLocationPermission();
    if (status !== 'granted') {
      status = await requestLocationPermission();
    }
    setPermission(status);

    if (status === 'granted') {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const country = await getCountryFromCoords(latitude, longitude);
          setIsInUSA(country === 'US');
          setChecking(false);
        },
        error => {
          console.error('Geolocation error:', error);
          setIsInUSA(false);
          setChecking(false);
        },
        // { enableHighAccuracy: false, timeout: 15000 },
        {
          // enableHighAccuracy: false,
          timeout: 10000,
          // maximumAge: 3600000,
        },
      );
    } else {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkLocation();
  }, [checkLocation]);

  if (checking) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Checking location...</Text>
      </View>
    );
  }

  if (permission !== 'granted') {
    return <LocationRequiredScreen onRetry={checkLocation} />;
  }

  if (isInUSA === false) {
    return <OnlyUSAScreen />;
  }

  if (isInUSA) {
    requestPermissions(show);
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
