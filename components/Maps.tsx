import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, StyleSheet, Platform } from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useImage } from "expo-image";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { generateMarkersFromData } from "@/lib/map";
import { useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";



const Map = () => {
  const { userLongitude, userLatitude } = useLocationStore();

  const { data: drivers, loading, error } = useFetch<Driver[]>(`${process.env.EXPO_PUBLIC_SERVER_URL}/(api)/driver`);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // Create shared image refs for markers using expo-image's useImage hook
  // Using local bike icon
  const driverIcon = useImage(icons.bike, {
    maxWidth: 48,
    maxHeight: 48,
  });

  // Fetch drivers and create markers
  useEffect(() => {
    if (Array.isArray(drivers) && userLatitude && userLongitude) {
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
      console.log("Markers created:", newMarkers.length);
    }
  }, [drivers, userLatitude, userLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-center items-center w-full h-full">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2">Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-center items-center w-full h-full">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  // Prepare map markers: current location + driver markers
  const mapMarkers = [
    {
      coordinates: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      title: "Your Location",
    },
    ...markers.map((marker) => ({
      coordinates: {
        latitude: marker.latitude,
        longitude: marker.longitude,
      },
      title: marker.title,
      icon: driverIcon ?? undefined,
    })),
  ];
  console.log("THe mapmarkers are", mapMarkers);

  const cameraPosition = {
    coordinates: {
      latitude: userLatitude,
      longitude: userLongitude,
    },
    zoom: 14,
  };

  // Render for iOS
  if (Platform.OS === "ios") {
    return (
      <AppleMaps.View
        style={styles.map}
        cameraPosition={cameraPosition}
        markers={mapMarkers}
        uiSettings={{
          compassEnabled: true,
          myLocationButtonEnabled: true,
        }}
      />
    );
  }

  // Render for Android
  return (
    <GoogleMaps.View
      style={styles.map}
      cameraPosition={cameraPosition}
      markers={mapMarkers}
      properties={{
        isMyLocationEnabled: true,
      }}
      uiSettings={{
        compassEnabled: true,
        myLocationButtonEnabled: true,
        zoomControlsEnabled: true,
      }}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});

export default Map;