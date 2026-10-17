import React, { useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import colors from '@/constants/colors';
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
const MIN_SPLASH_DURATION_MS = 1000;
const SPLASH_LOGO_ASPECT_RATIO = 1247 / 201;

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

  return (
    <>
      <StatusBar
        hidden={!(isAuthenticationScreen || isHomeScreen || isProfileScreen)}
        style={isProfileScreen ? 'light' : 'dark'}
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
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [appReady, setAppReady] = useState(false);
  const splashStartedAt = useRef(Date.now());

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      SplashScreen.hideAsync();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    const remainingDuration = Math.max(
      0,
      MIN_SPLASH_DURATION_MS - (Date.now() - splashStartedAt.current),
    );
    const timeout = setTimeout(() => setAppReady(true), remainingDuration);
    return () => clearTimeout(timeout);
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#05462B',
        }}
      >
        <Image
          source={require('@/assets/images/fudway_logo_white_transparent.png')}
          resizeMode="contain"
          style={{
            width: '56%',
            maxWidth: 280,
            aspectRatio: SPLASH_LOGO_ASPECT_RATIO,
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: colors.light.brandDeepGreen }}
          >
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
