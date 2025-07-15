import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface Sarathi {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
}
//markerdata
//mapprops
//ride
declare interface ButtonProps extends TouchableOpacityProps{
    title:string;
    bgVariant?:"primary"|"secondary"|"danger"|"outline"|"success";
    textVariant?:"primary"|"default"|"secondary"|"danger"|"success";
    IconLeft?:React.ComponentType<any>;
    IconRight?:React.ComponentType<any>;
    className?:string;
}
//googleinputprops
declare interface InputFieldProps extends TextInputProps{
    label:string;
    icon?:any;
    secureTextEntry?:boolean;
    labelStyle?:string;
    containerStyle?:string;
    inputStyle?:string;
    iconStyle:string;
    className?:string;
}
declare interface PaymentProps{
    fullName:string;
    email:string;
    amount:string;
    driverId:number;
    rideTime:number;
}
//locationstore
//driverstore
//drivercardprops