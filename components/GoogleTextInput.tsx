import React, { useEffect, useRef } from 'react';
import { View, Image, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'expo-google-places-autocomplete';
import type { PlaceDetails, PlacesError } from 'expo-google-places-autocomplete';

interface GoogleTextInputProps {
  icon?: any;
  containerStyle?: string;
  initialLocation?: string;
  textInputBackgroundColor?: string;
  handlePress: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export default function GoogleTextInput({
  icon,
  containerStyle,
  initialLocation,
  textInputBackgroundColor,
  handlePress,
}: GoogleTextInputProps) {
  // Make sure to set your API key
  const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'YOUR_API_KEY';
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setNativeProps({ text: initialLocation || '' });
    }
  }, [initialLocation]);

  const onSearchError = React.useCallback((error: PlacesError) => {
    console.error('Places search error:', error);
  }, []);

  const onPlaceSelected = React.useCallback(
    (place: PlaceDetails) => {
     
      // Extract location data from PlaceDetails
  
 const latitude = place.coordinate?.latitude
const longitude = place.coordinate.longitude
      const address = (place as any).formattedAddress || place.name || '';
      

      if (latitude && longitude) {
        handlePress({
          latitude,
          longitude,
          address,
        });
      }
    },
    [handlePress]
  );

  return (
    <View className={containerStyle || "bg-white shadow-md shadow-neutral-300"}>
      {/* Icon Container */}
      {icon && (
        <View 
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: [{ translateY: -12 }],
            zIndex: 100,
            justifyContent: 'center',
            alignItems: 'center',
            width: 24,
            height: 24,
          }}
        >
          <Image
            source={icon}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </View>
      )}
      
      <GooglePlacesAutocomplete
        apiKey={googlePlacesApiKey}
        placeholder={initialLocation || 'Search for your address...'}
        onPlaceSelected={onPlaceSelected}
        onSearchError={onSearchError}
        inputRef={inputRef}
        containerStyle={{
          width: '100%',
        }}
        searchInputStyle={{
          backgroundColor: textInputBackgroundColor || 'white',
          borderRadius: 200,
          paddingLeft: icon ? 45 : 16, // Add padding if icon exists
          height: 50,
        }}
        inputContainerStyle={{
          width: '100%',
        }}
        resultsContainerStyle={{
          backgroundColor: textInputBackgroundColor || 'white',
          width: '100%',
          borderRadius: 10,
          marginTop: 8,
        }}
      />
    </View>
  );
}
