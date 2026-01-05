import { View, Text, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import RideMap from '@/components/RideMap'
import { useLocationStore, useRideStore } from '@/store'
import { useFetch } from '@/lib/fetch'
import { Driver, Ride } from '@/types/type'
import { CustomButton } from '@/components/CustomButton'
import { icons } from '@/constants'

interface BookrideProps {
  onBackPress: () => void
}

const Bookride = ({ onBackPress }: BookrideProps) => {
  const { user } = useClerk()
  const router = useRouter()
  const { data: drivers, loading: driversLoading } = useFetch<Driver[]>(`${process.env.EXPO_PUBLIC_SERVER_URL}/(api)/driver`)
  const { userLatitude, userLongitude, userAddress, destinationLatitude, destinationLongitude, destinationAddress } = useLocationStore()
  const { setActiveRide } = useRideStore()
  const [isBooking, setIsBooking] = useState(false)

  const handleBookRide = async (driver: Driver) => {
    try {
      if (!user?.id || !userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude || !userAddress || !destinationAddress) {
        Alert.alert('Error', 'Missing required information for booking')
        return
      }

      setIsBooking(true)

      // Create ride in database
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/(api)/ride/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_address: userAddress,
          destination_address: destinationAddress,
          origin_latitude: userLatitude,
          origin_longitude: userLongitude,
          destination_latitude: destinationLatitude,
          destination_longitude: destinationLongitude,
          ride_time: 30, // Calculate based on route
          fare_price: 250, // Calculate based on distance
          payment_status: 'pending',
          driver_id: driver.id,
          user_id: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create ride')
      }

      const rideData = await response.json()
      const ride = rideData.data as Ride

      console.log('Ride created:', ride)

      // Set active ride in store
      setActiveRide({
        ...ride,
        driver: {
          first_name: driver.first_name,
          last_name: driver.last_name,
          car_seats: driver.car_seats,
        },
      })

      console.log('Active ride set in store')

      // Navigate to active ride screen
      router.push('/(root)/active_ride')
    } catch (error) {
      console.error('Error booking ride:', error)
      Alert.alert('Error', 'Failed to book ride. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Back Button */}
      <View className="px-4 py-3 bg-white border-b border-neutral-200">
        <CustomButton title="← Back to Map" onPress={onBackPress} bgVariant="outline" />
      </View>

      {/* Drivers List Container */}
      <View className="flex-1">
        {driversLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
            <Text className="mt-2 text-gray-500">Loading drivers...</Text>
          </View>
        ) : drivers && drivers.length > 0 ? (
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            {drivers.map((driver) => (
              <View key={driver.id} className="px-4 py-3 border-b border-neutral-100">
                <View className="flex flex-row items-center justify-between bg-gray-50 rounded-lg p-4 gap-3">
                  <View className="flex-1">
                    <Text className="text-lg font-JakartaBold">
                      {driver.first_name} {driver.last_name}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      ⭐ {driver.rating} • {driver.car_seats} seats
                    </Text>
                  </View>
                  <View className="w-24">
                    <CustomButton
                      title={isBooking ? "Booking..." : "Book"}
                      onPress={() => handleBookRide(driver)}
                      bgVariant="success"
                      disabled={isBooking}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">No drivers available</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default Bookride