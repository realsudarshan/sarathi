import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="find_ride" options={{ headerShown: false }} />
      <Stack.Screen
        name="confirm_ride"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="book_ride"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;