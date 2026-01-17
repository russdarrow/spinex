import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View className="flex-1 bg-zinc-950">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header */}
          <View className="px-4 py-3 flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-zinc-900 active:bg-zinc-800"
            >
              <ArrowLeft size={20} color="#fff" />
            </Pressable>
          </View>

          <View className="flex-1 px-6 justify-center">
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <Text className="text-3xl font-bold text-white mb-2">Welcome back</Text>
              <Text className="text-zinc-400 text-base mb-8">Sign in to your account</Text>
            </Animated.View>

            {/* Error Message */}
            {error ? (
              <Animated.View
                entering={FadeInDown.duration(300)}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
              >
                <Text className="text-red-400 text-sm">{error}</Text>
              </Animated.View>
            ) : null}

            {/* Email Input */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)} className="mb-4">
              <View className="flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border border-zinc-800">
                <Mail size={20} color="#71717a" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="#71717a"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 ml-3 text-white text-base"
                />
              </View>
            </Animated.View>

            {/* Password Input */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} className="mb-6">
              <View className="flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border border-zinc-800">
                <Lock size={20} color="#71717a" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#71717a"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-white text-base"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#71717a" />
                  ) : (
                    <Eye size={20} color="#71717a" />
                  )}
                </Pressable>
              </View>
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
              <Pressable
                onPress={handleLogin}
                disabled={isLoading}
                className="bg-sky-500 rounded-xl py-4 items-center active:bg-sky-600"
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-base">Sign In</Text>
                )}
              </Pressable>
            </Animated.View>

            {/* Sign Up Link */}
            <Animated.View entering={FadeInDown.delay(500).duration(500)} className="mt-6">
              <View className="flex-row justify-center">
                <Text className="text-zinc-400">Don't have an account? </Text>
                <Pressable onPress={() => router.replace('/signup')}>
                  <Text className="text-sky-500 font-semibold">Sign Up</Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
