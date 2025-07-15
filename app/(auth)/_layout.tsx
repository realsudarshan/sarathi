import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name='signin' options={{headerShown:false}} ></Stack.Screen>
        <Stack.Screen name='signup' options={{headerShown:false}} ></Stack.Screen>
        <Stack.Screen name='welcome' options={{headerShown:false}} ></Stack.Screen>
    </Stack>
  )
}

export default Layout