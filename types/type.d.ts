import { TextInputProps, TouchableOpacityProps } from "react-native";
declare interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
}
declare type Sarathi = Driver;

declare interface MarkerData {
  latitude: number;
  longitude: number;
  id: number;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  first_name: string;
  last_name: string;
  time?: number;
  price?: string;
}
//mapprops
declare interface Ride {
    id?: number;
    origin_address: string;
    destination_address: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_latitude: number;
    destination_longitude: number;
    ride_time: number;
    fare_price: number;
    payment_status: string;
    driver_id: number;
    user_id: string;
    created_at?: string;
    ride_status?: "in_progress" | "completed" | "cancelled";
    current_latitude?: number;
    current_longitude?: number;
    driver?: {
      first_name: string;
      last_name: string;
      car_seats: number;
    };
  }
  
declare interface ButtonProps extends TouchableOpacityProps{
    title:string;
    bgVariant?:"primary"|"secondary"|"danger"|"outline"|"success";
    textVariant?:"primary"|"default"|"secondary"|"danger"|"success";
    IconLeft?:React.ComponentType<any>;
    IconRight?:React.ComponentType<any>;
    className?:string;
}declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}
declare interface InputFieldProps extends TextInputProps{
    label:string;
    icon?:any;
    secureTextEntry?:boolean;
    labelStyle?:string;
    containerStyle?:string;
    inputStyle?:string;
    iconStyle?:string;
    className?:string;
}
declare interface PaymentProps{
    fullName:string;
    email:string;
    amount:string;
    driverId:number;
    rideTime:number;
}
declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}
declare interface DriverCardProps {
  item: MarkerData;
  selected: number;
  setSelected: () => void;
}