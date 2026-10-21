import React, { useEffect } from 'react';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { CartProvider } from '@/contexts/CartContext';
import { StatusBar } from 'expo-status-bar';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const pathname = usePathname();
  const isAuthenticationScreen =
    pathname === '/' ||
    pathname === '/auth' ||
    pathname === '/login' ||
    pathname === '/reset-password' ||
    pathname === '/signup';
  const isHomeScreen =
    pathname === '/' ||
    pathname.endsWith('/index') ||
    pathname.endsWith('/(tabs)');
  const isProfileScreen = pathname.endsWith('/profile');
  const isStoreScreen = pathname.endsWith('/store');
  const isProductScreen = pathname.endsWith('/product');
  const isCategoryScreen = pathname.endsWith('/category');
  const isCommerceScreen =
    pathname.endsWith('/cart') || pathname.endsWith('/checkout');

  return (
    <>
      <StatusBar
        hidden={
          !(
            isAuthenticationScreen ||
            isHomeScreen ||
            isProfileScreen ||
            isStoreScreen ||
            isProductScreen ||
            isCategoryScreen ||
            isCommerceScreen
          )
        }
        style={isProfileScreen || isStoreScreen || isProductScreen ? 'light' : 'dark'}
      />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerBackTitle: 'Back',
          contentStyle: { backgroundColor: colors.light.brandDeepGreen },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="location" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="store" options={{ headerShown: false }} />
        <Stack.Screen name="category" options={{ headerShown: false }} />
        <Stack.Screen name="product" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useFonts({
    ...Feather.font,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      SplashScreen.hideAsync();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <GestureHandlerRootView
              style={{ flex: 1, backgroundColor: colors.light.brandDeepGreen }}
            >
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </CartProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
