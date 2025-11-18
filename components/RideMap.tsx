import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, StyleSheet, Platform } from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";

import { icons } from "@/constants";
import { useLocationStore } from "@/store";

const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const RideMap = () => {
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Fetch route when both locations are available
  useEffect(() => {
    if (
      userLatitude &&
      userLongitude &&
      destinationLatitude &&
      destinationLongitude
    ) {
      fetchRouteCoordinates();
    } else {
      setRouteCoordinates([]);
    }
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  const fetchRouteCoordinates = async () => {
    try {
      setLoading(true);
      if (!googleApiKey) {
        console.warn("Google API key not configured");
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${googleApiKey}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(
          data.routes[0].overview_polyline.points
        );
        setRouteCoordinates(points);
        console.log("Route coordinates fetched:", points.length);
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
    } finally {
      setLoading(false);
    }
  };

  // Decode Google's encoded polyline format
  const decodePolyline = (encoded: string) => {
    const poly: { latitude: number; longitude: number }[] = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return poly;
  };

  // Show loading while fetching user location
  if (!userLatitude || !userLongitude) {
    return (
      <View className="flex justify-center items-center w-full h-full bg-gray-100">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-3 text-gray-600">Loading your location...</Text>
      </View>
    );
  }

  // Prepare map markers: user location + destination
  const mapMarkers = [
    {
      coordinates: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      title: "Your Location",
      icon: icons.selectedMarker,
    },
  ];

  // Add destination marker if available
  if (destinationLatitude && destinationLongitude) {
    mapMarkers.push({
      coordinates: {
        latitude: destinationLatitude,
        longitude: destinationLongitude,
      },
      title: "Destination",
      icon: icons.pin,
    });
  }

  // Prepare polylines for route
  const polylines =
    routeCoordinates.length > 0
      ? [
          {
            id: "route",
            coordinates: routeCoordinates,
            color: "green",
            width: 20,
          },
        ]
      : [];

  // Calculate camera position to fit both locations
  let cameraPosition;
  if (destinationLatitude && destinationLongitude) {
    const centerLat = (userLatitude + destinationLatitude) / 2;
    const centerLng = (userLongitude + destinationLongitude) / 2;
    cameraPosition = {
      coordinates: {
        latitude: centerLat,
        longitude: centerLng,
      },
      zoom: 13,
    };
  } else {
    cameraPosition = {
      coordinates: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      zoom: 15,
    };
  }

  // Render for iOS
  if (Platform.OS === "ios") {
    return (
      <AppleMaps.View
        style={styles.map}
        cameraPosition={cameraPosition}
        markers={mapMarkers}
        polylines={polylines}
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
      polylines={polylines}
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

export default RideMap;
