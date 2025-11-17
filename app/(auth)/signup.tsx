import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router';
import { fetchAPI } from '@/lib/fetch';
// Zod validation schema
const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const { isLoaded, signUp, setActive } = useSignUp()
  const [code, setCode] = React.useState('')
  const [userData, setUserData] = useState<{ fullName: string; email: string } | null>(null);
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const validateForm = (data:any) => {
    try {
      signupSchema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) => {
          const fieldName = err.path.join("."); // handles nested keys
          setError(fieldName as any, {
            type: "validation",
            message: err.message,
          });
        });
      }
    }
  };

  const onSubmit = async (data:any) => {
    try {
      if (!isLoaded) return
      // Clear previous errors
      clearErrors();

      // Validate with Zod
      if (!validateForm(data)) {
        return;
      }

     
      await signUp.create({
        emailAddress:data.email,
        password:data.password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setUserData({ fullName: data.fullName, email: data.email });
      setPendingVerification(true)

    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: userData?.fullName,
            email: userData?.email,
            clerkId: signUpAttempt.createdUserId, // <-- use from attempt
          }),
        });
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(root)/(tabs)/home')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-white px-5 py-8">
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold mb-4">Verify your email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
          />
          <TouchableOpacity 
            onPress={onVerifyPress}
            className="bg-blue-600 rounded-lg py-3"
          >
            <Text className="text-white text-center font-semibold">Verify</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" 
        >
          {/*tap will work even keyboardisopen*/}
          <View className="flex-1 px-6 py-8">
            {/* Header */}
            <View className="items-center mb-12 mt-8">
              <View className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full items-center justify-center mb-6 shadow-lg">
                <Ionicons name="person-add" size={32} color="white" />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </Text>
              <Text className="text-gray-600 text-center text-base">
                Join us today and start your journey
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              {/* Full Name Field */}
              <View>
                <Text className="text-gray-700 font-medium mb-2 ml-1">
                  Full Name
                </Text>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="relative">
                      <TextInput
                        className={`bg-white border-2 rounded-xl px-4 py-4 text-gray-800 shadow-sm ${
                          errors.fullName ? 'border-red-400' : 'border-gray-200'
                        } focus:border-blue-500`}
                        placeholder="Enter your full name"
                        placeholderTextColor="#9CA3AF"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="words"
                      />
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color="#9CA3AF"
                        style={{
                          position: 'absolute',
                          right: 16,
                          top: 16,
                        }}
                      />
                    </View>
                  )}
                />
                {errors.fullName && (
                  <Text className="text-red-500 text-sm mt-2 ml-1">
                    {errors.fullName.message}
                  </Text>
                )}
              </View>

              {/* Email Field */}
              <View>
                <Text className="text-gray-700 font-medium mb-2 ml-1">
                  Email Address
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="relative">
                      <TextInput
                        className={`bg-white border-2 rounded-xl px-4 py-4 text-gray-800 shadow-sm ${
                          errors.email ? 'border-red-400' : 'border-gray-200'
                        } focus:border-blue-500`}
                        placeholder="Enter your email"
                        placeholderTextColor="#9CA3AF"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color="#9CA3AF"
                        style={{
                          position: 'absolute',
                          right: 16,
                          top: 16,
                        }}
                      />
                    </View>
                  )}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-2 ml-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View>
                <Text className="text-gray-700 font-medium mb-2 ml-1">
                  Password
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="relative">
                      <TextInput
                        className={`bg-white border-2 rounded-xl px-4 py-4 pr-12 text-gray-800 shadow-sm ${
                          errors.password ? 'border-red-400' : 'border-gray-200'
                        } focus:border-blue-500`}
                        placeholder="Create a password"
                        placeholderTextColor="#9CA3AF"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4"
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-2 ml-1">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Confirm Password Field */}
              <View>
                <Text className="text-gray-700 font-medium mb-2 ml-1">
                  Confirm Password
                </Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="relative">
                      <TextInput
                        className={`bg-white border-2 rounded-xl px-4 py-4 pr-12 text-gray-800 shadow-sm ${
                          errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                        } focus:border-blue-500`}
                        placeholder="Confirm your password"
                        placeholderTextColor="#9CA3AF"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-4 "
                      >
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-2 ml-1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className={` rounded-xl py-4 shadow-lg mt-8  bg-red-600${
                  isSubmitting ? 'opacity-70' : ''
                }`}
              >
                <View className="flex-row items-center justify-center">
                  {isSubmitting && (
                    <View className="mr-3">
                      <Ionicons name="refresh" size={20} color="white" />
                    </View>
                  )}
                  <Text className="text-white text-lg font-semibold ">
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
                  <Text className="text-blue-600 font-semibold">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;