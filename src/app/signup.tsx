import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

// Create Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!isConfigured || !supabase) {
      setError('Supabase is not configured. Please add your credentials in the ENV tab.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-zinc-950">
        <SafeAreaView className="flex-1 justify-center items-center px-6">
          <Animated.View entering={FadeInDown.duration(500)} className="items-center">
            <View className="w-20 h-20 rounded-full bg-emerald-500/20 items-center justify-center mb-6">
              <CheckCircle size={48} color="#10b981" />
            </View>
            <Text className="text-2xl font-bold text-white mb-2 text-center">Check your email</Text>
            <Text className="text-zinc-400 text-center mb-8">
              We've sent a confirmation link to {email}. Please click the link to verify your account.
            </Text>
            <Pressable
              onPress={() => router.replace('/login')}
              className="bg-sky-500 rounded-xl py-4 px-8 active:bg-sky-600"
            >
              <Text className="text-white font-semibold text-base">Back to Login</Text>
            </Pressable>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

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

          <ScrollView className="flex-1 px-6" contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <Text className="text-3xl font-bold text-white mb-2">Create account</Text>
              <Text className="text-zinc-400 text-base mb-8">Sign up to get started</Text>
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
            <Animated.View entering={FadeInDown.delay(300).duration(500)} className="mb-4">
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

            {/* Confirm Password Input */}
            <Animated.View entering={FadeInDown.delay(400).duration(500)} className="mb-6">
              <View className="flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border border-zinc-800">
                <Lock size={20} color="#71717a" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#71717a"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-white text-base"
                />
              </View>
            </Animated.View>

            {/* Sign Up Button */}
            <Animated.View entering={FadeInDown.delay(500).duration(500)}>
              <Pressable
                onPress={handleSignUp}
                disabled={isLoading}
                className="bg-sky-500 rounded-xl py-4 items-center active:bg-sky-600"
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-base">Create Account</Text>
                )}
              </Pressable>
            </Animated.View>

            {/* Login Link */}
            <Animated.View entering={FadeInDown.delay(600).duration(500)} className="mt-6">
              <View className="flex-row justify-center">
                <Text className="text-zinc-400">Already have an account? </Text>
                <Pressable onPress={() => router.replace('/login')}>
                  <Text className="text-sky-500 font-semibold">Sign In</Text>
                </Pressable>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
