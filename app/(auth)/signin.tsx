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
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

// Zod validation schema
const signinSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const validateForm = (data: any) => {
    try {
      signinSchema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) => {
          const fieldName = err.path.join(".");
          setError(fieldName as any, {
            type: "validation",
            message: err.message,
          });
        });
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (!isLoaded || !signIn) return;
      
      // Clear previous errors
      clearErrors();

      // Validate with Zod
      if (!validateForm(data)) {
        return;
      }

      // Sign in with Clerk
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(root)/(tabs)/home');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert('Error', 'Sign in failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      Alert.alert('Error', error?.errors?.[0]?.message || 'Something went wrong. Please try again.');
    }
  };

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
          <View className="flex-1 px-6 py-8">
            {/* Header */}
            <View className="items-center mb-12 mt-8">
              <View className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full items-center justify-center mb-6 shadow-lg">
                <Ionicons name="log-in-outline" size={32} color="white" />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-600 text-center text-base">
                Sign in to continue your journey
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
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
                        placeholder="Enter your password"
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

              {/* Forgot Password Link */}
              <View className="flex-row justify-end">
                <TouchableOpacity>
                  <Text className="text-blue-600 font-medium text-sm">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className={`rounded-xl py-4 shadow-lg mt-8 bg-blue-600 ${
                  isSubmitting ? 'opacity-70' : ''
                }`}
              >
                <View className="flex-row items-center justify-center">
                  {isSubmitting && (
                    <View className="mr-3">
                      <Ionicons name="refresh" size={20} color="white" />
                    </View>
                  )}
                  <Text className="text-white text-lg font-semibold">
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-gray-600">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                  <Text className="text-blue-600 font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signin;