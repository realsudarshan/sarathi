import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import ActiveRide from '@/components/ActiveRide'

const ActiveRideScreen = () => {
  const router = useRouter()

  const handleRideComplete = () => {
    console.log('Ride completed, navigating to home')
    // Navigate back to home with replace to clear navigation stack
    router.replace('/(root)/(tabs)/home')
  }

  return (
    <View className="flex-1">
      <ActiveRide onRideComplete={handleRideComplete} />
    </View>
  )
}

export default ActiveRideScreen
