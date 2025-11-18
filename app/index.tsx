
import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

const index = () => {
  const { isLoaded, isSignedIn } = useAuth()

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  // Redirect based on authentication state
  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />
  } else {
    return <Redirect href="/(auth)/welcome" />
  }
}

export default index