import { Stack } from "expo-router";
import "../global.css";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
export default function RootLayout() {

  return (
  <ClerkProvider tokenCache={tokenCache}>
    <Stack>
    <Stack.Screen name="index" ></Stack.Screen>
    <Stack.Screen name="(auth)" options={{headerShown:false}}></Stack.Screen>
    <Stack.Screen name="(root)" options={{headerShown:false}}></Stack.Screen>
    <Stack.Screen name="+not-found"></Stack.Screen>
   
    </Stack>
    </ClerkProvider>) //take whatever .tsx files are inside the app/ folder and make them screens
}
