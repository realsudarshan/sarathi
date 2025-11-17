import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, StyleSheet, Platform } from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();

  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== null &&
      destinationLongitude !== null &&
      userLatitude !== null &&
      userLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      })
        .then((drivers) => {
          setDrivers(drivers as MarkerData[]);
        })
        .catch((error) => {
          console.error("Failed to calculate driver times:", error);
        });
    }
  }, [
    markers,
    destinationLatitude,
    destinationLongitude,
    userLatitude,
    userLongitude,
    setDrivers,
  ]);

  // Fetch route coordinates when destination is set
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
      if (!directionsAPI) {
        console.warn("Google API key not configured");
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(
          data.routes[0].overview_polyline.points
        );
        setRouteCoordinates(points);
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
    }
  };
//fix it
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

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  if (loading || (!userLatitude && !userLongitude))
    return (
      <View className="flex justify-center items-center w-full h-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-center items-center w-full h-full">
        <Text>Error: {error}</Text>
      </View>
    );

  // Prepare markers for the map
  const mapMarkers = [
    ...markers.map((marker) => ({
      
      coordinates: {
        latitude: marker.latitude,
        longitude: marker.longitude,
      },
      title: marker.title,
      icon: selectedDriver === +marker.id ? icons.selectedMarker : icons.marker,
    })),
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



  // Prepare polylines
  const polylines =
    routeCoordinates.length > 0
      ? [
          {
            id: "route",
            coordinates: routeCoordinates,
            color: "#0286FF",
            width: 3,
          },
        ]
      : [];

  const cameraPosition = {
    coordinates: {
      latitude: region.latitude,
      longitude: region.longitude,
    },
    zoom: 14,
  };

  // Render for iOS (Apple Maps)
  if (Platform.OS === "ios") {
    return (
      <AppleMaps.View
        style={styles.map}
     
        markers={mapMarkers}
        polylines={polylines}
        
        uiSettings={{
          compassEnabled: false,
          myLocationButtonEnabled: true,
        }}
      />
    );
  }

  // Render for Android (Google Maps)
  return (
    <GoogleMaps.View
      style={styles.map}
     
      markers={mapMarkers}
      polylines={polylines}
      properties={{
      
        isMyLocationEnabled: true,
      }}
      uiSettings={{
        compassEnabled: false,
        myLocationButtonEnabled: true,
        zoomControlsEnabled: false,
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
