import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import RideMap from './RideMap'
import { useLocationStore, useRideStore } from '@/store'
import { CustomButton } from './CustomButton'
import * as Location from 'expo-location'

interface ActiveRideProps {
  onRideComplete: () => void
}

const ActiveRide = ({ onRideComplete }: ActiveRideProps) => {
  const { activeRide, updateRideLocation, clearActiveRide } = useRideStore()
  const { userLatitude, userLongitude, setUserLocation } = useLocationStore()
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('ActiveRide component mounted')
    console.log('Current activeRide:', activeRide)
  }, [activeRide])

  // Start tracking location updates
  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.error('Permission to access location was denied')
          return
        }

        // Start watching location with high accuracy
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000, // Update every 1 second
            distanceInterval: 5, // Or every 5 meters
          },
          (location) => {
            const { latitude, longitude } = location.coords
            setUserLocation({
              latitude,
              longitude,
              address: '',
            })
            updateRideLocation(latitude, longitude)
            
            // Also update ride in database periodically
            updateRideLocationInDB(latitude, longitude)
          }
        )

        setLocationSubscription(subscription)
      } catch (error) {
        console.error('Error starting location tracking:', error)
      }
    }

    startLocationTracking()

    return () => {
      if (locationSubscription) {
        locationSubscription.remove()
      }
    }
  }, [])

  const updateRideLocationInDB = async (latitude: number, longitude: number) => {
    try {
      if (!activeRide?.id) return

      await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/(api)/ride/update-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ride_id: activeRide.id,
          current_latitude: latitude,
          current_longitude: longitude,
        }),
      })
    } catch (error) {
      console.error('Error updating ride location:', error)
    }
  }

  const handleCompleteRide = async () => {
    try {
      setIsCompleting(true)
      
      if (!activeRide?.id || !userLatitude || !userLongitude) {
        console.error('Missing required data for completing ride')
        return
      }

      console.log('Completing ride:', activeRide.id)

      // Update ride status to completed
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/(api)/ride/complete-ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ride_id: activeRide.id,
          final_latitude: userLatitude,
          final_longitude: userLongitude,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Ride completed successfully:', data)
        
        // Stop location tracking
        if (locationSubscription) {
          locationSubscription.remove()
        }
        
        clearActiveRide()
        
        // Add a small delay to ensure state updates before navigation
        setTimeout(() => {
          onRideComplete()
        }, 500)
      } else {
        console.error('Failed to complete ride:', response.status)
      }
    } catch (error) {
      console.error('Error completing ride:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  if (!activeRide) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-gray-500">No active ride</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Complete Button */}
      <View className="px-4 py-3 bg-white border-b border-neutral-200 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-JakartaBold">Ride in Progress</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Driver: {activeRide.driver?.first_name} {activeRide.driver?.last_name}
          </Text>
        </View>
        <View className="w-32 ml-2">
          <CustomButton
            title={isCompleting ? "Completing..." : "Complete Ride"}
            onPress={handleCompleteRide}
            bgVariant="danger"
            disabled={isCompleting}
          />
        </View>
      </View>

      {/* Map with Real-time Location */}
      <View className="flex-1">
        <RideMap />
      </View>

      {/* Ride Details */}
      <View className="px-4 py-4 bg-gray-50 border-t border-neutral-200">
        <View className="mb-3">
          <Text className="text-sm text-gray-600 mb-1">From</Text>
          <Text className="text-base font-JakartaSemiBold">{activeRide.origin_address}</Text>
        </View>
        
        <View className="mb-3">
          <Text className="text-sm text-gray-600 mb-1">To</Text>
          <Text className="text-base font-JakartaSemiBold">{activeRide.destination_address}</Text>
        </View>

        <View className="flex-row justify-between">
          <View>
            <Text className="text-sm text-gray-600 mb-1">Estimated Time</Text>
            <Text className="text-base font-JakartaSemiBold">{activeRide.ride_time} min</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-600 mb-1">Fare</Text>
            <Text className="text-base font-JakartaSemiBold">₹{activeRide.fare_price}</Text>
          </View>
        </View>

        {userLatitude && userLongitude && (
          <View className="mt-3 p-3 bg-blue-50 rounded-lg">
            <Text className="text-xs text-gray-600">Current Location</Text>
            <Text className="text-sm font-JakartaSemiBold">
              {userLatitude.toFixed(6)}, {userLongitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default ActiveRide
