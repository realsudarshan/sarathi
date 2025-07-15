import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" ></Stack.Screen>
    <Stack.Screen name="(auth)" options={{headerShown:false}}></Stack.Screen>
    <Stack.Screen name="(root)" options={{headerShown:false}}></Stack.Screen>
    <Stack.Screen name="+not-found"></Stack.Screen>
    </Stack>; //take whatever .tsx files are inside the app/ folder and make them screens
}
