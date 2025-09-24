import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
//displays ride details and handles the payment process
const Bookride = () => {
  const { signOut } = useClerk()
  const router = useRouter()
  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      router.replace('/(auth)/signin')
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }
  return (
    <SafeAreaView>
      <Text>Bookride</Text>
      <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Bookride