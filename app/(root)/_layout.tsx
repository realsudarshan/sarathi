import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name='book_ride' options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name='confirm_ride' options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name='find_ride' options={{headerShown:false}}></Stack.Screen>
    </Stack>
  )
}

export default Layout