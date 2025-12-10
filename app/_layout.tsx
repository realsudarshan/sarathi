import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide the splash screen once the app is ready
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    // Delay to show splash screen for 3 seconds
    const timer = setTimeout(hideSplash, 1000);
    return () => clearTimeout(timer);
  }, []);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen name="index" ></Stack.Screen>
        <Stack.Screen name="(auth)" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="(root)" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="+not-found"></Stack.Screen>

      </Stack>
    </ClerkProvider>) //take whatever .tsx files are inside the app/ folder and make them screens
}
