import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { onboarding } from "@/constants";
import { CustomButton } from "@/components/CustomButton";
import { FullWindowOverlay } from "react-native-screens";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between ">
      {/* Skip Button */}
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/signup")}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      {/* Current Slide */}
      <View className="flex items-center justify-center p-5 flex-1">
        <Image
          source={onboarding[activeIndex].image}
          // className="w-20 h-20"
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
        <View className="flex flex-row items-center justify-center w-full mt-10">
          <Text className="text-black text-3xl font-bold mx-10 text-center">
            {onboarding[activeIndex].title}
          </Text>
        </View>
        <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
          {onboarding[activeIndex].description}
        </Text>
      </View>

      {/* Dots */}
      <View className="flex-row justify-center mb-5">
        {onboarding.map((_, index) => (
          <View
            key={index}
            className={`w-[32px] h-[4px] mx-1 rounded-full ${
              index === activeIndex ? "bg-[#0286FF]" : "bg-[#E2E8F0]"
            }`}
          />
        ))}
      </View>

      {/* Button,router.replace prevents back navigation */}
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/signup")
            : setActiveIndex(activeIndex + 1)
        }
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
  
};

export default Home;