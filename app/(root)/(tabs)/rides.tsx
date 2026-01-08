import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Bookride from '../book_ride'
import GoogleTextInput from '@/components/GoogleTextInput'
import { icons } from '@/constants'
import { useLocationStore } from '@/store'
import RideMap from '@/components/RideMap'
import { CustomButton } from '@/components/CustomButton'

const Rides = () => {
  const {
    userLatitude,
    userLongitude,
    userAddress,
    destinationAddress,
    destinationLatitude,
    destinationLongitude,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore()

  const [showBookRide, setShowBookRide] = useState(false)

  // Initialize user location on component mount
  useEffect(() => {
    if (userLatitude && userLongitude && !userAddress) {
      setUserLocation({
        latitude: userLatitude,
        longitude: userLongitude,
        address: 'Current Location',
      })
    }
  }, [userLatitude, userLongitude])

  // Check if both locations are filled
  const isBothLocationsFilled =
    userAddress &&
    destinationAddress &&
    userLatitude &&
    userLongitude &&
    destinationLatitude &&
    destinationLongitude

  const handleFindRide = () => {
    setShowBookRide(true)
  }

  return (
    <View className="flex-1 bg-white">
      {/* Input Fields Container */}
      <View className="px-4 py-4 gap-3 bg-white border-b border-neutral-200">
        {/* User Address Input */}
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress || 'Current Location'}
          containerStyle="bg-white shadow-md shadow-neutral-300 rounded-lg"
          textInputBackgroundColor="white"
          handlePress={(location) => {
            setUserLocation({
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address,
            })
          }}
        />

        {/* Destination Address Input */}
        <GoogleTextInput
          icon={icons.pin}
          initialLocation={destinationAddress || 'Where to?'}
          containerStyle="bg-white shadow-md shadow-neutral-300 rounded-lg"
          textInputBackgroundColor="white"
          handlePress={(location) => {
            setDestinationLocation({
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address,
            })
          }}
        />
      </View>

      {!showBookRide ? (
        /* Map and Button Container */
        <View className="flex-1 bg-white">
          {userLatitude && userLongitude ? (
            <>
              {/* Find Ride Button - Above Map */}
              {isBothLocationsFilled && (
                <View className="px-4 py-3 bg-white border-b border-neutral-200">
                  <CustomButton title="Find Ride" onPress={handleFindRide} bgVariant="success" />
                </View>
              )}

              {/* Map Container - takes remaining space */}
              <View className="flex-1">
                <RideMap />
              </View>
            </>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500">Loading map...</Text>
            </View>
          )}
        </View>
      ) : (
        <Bookride onBackPress={() => setShowBookRide(false)} />
      )}

      {/*  if(destination&& startingadress){ fill map} and show find ride button
        find ride button on Click->driver fetch and display and book ride button
        On book ride Message Ride booked successfully
        Confirm ride when reach destination by user
        */}
    </View>
  )
}

export default Rides