import { TouchableOpacity,Text } from "react-native";
import {ButtonProps} from "@/types/type"
//It creates a type-safe object where:
//The keys are all valid, non-null, non-undefined values of ButtonProps["bgVariant"]
//The values are string (your Tailwind classes)
 const bgVariantStyles: Record<NonNullable<ButtonProps["bgVariant"]>, string> = {
  primary:"bg-gray-600",
  secondary: "bg-gray-500",
  danger: "bg-red-500",
  success: "bg-green-500",
  outline: "bg-transparent border-neutral-300 border-[0.5px]",
  // add more variants here...
};
const getBgVariantStyle = (variant?: ButtonProps["bgVariant"]) => {
  return bgVariantStyles[variant!] ?? "bg-[#0286FF]";
};
const textVariantStyles: Record<NonNullable<ButtonProps["textVariant"]>, string> = {
  default:"text-white",
    primary: "text-black",
  secondary: "text-gray-100",
  danger: "text-red-100",
  success: "text-green-100",
};

const getTextVariantStyle = (variant?: ButtonProps["textVariant"]) => {
  return textVariantStyles[variant!] ?? "text-white";
};


export const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps)=>{
    return(
        <TouchableOpacity
        onPress={onPress}
        className={'w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}'}
        {...props}>
            {IconLeft && <IconLeft/>}
            <Text className={'text-lg font-bold ${getTextVariantStyle{textVariant)}'}>{title}</Text>
      {IconRight&&<IconRight/>}
        </TouchableOpacity>
    )
}
