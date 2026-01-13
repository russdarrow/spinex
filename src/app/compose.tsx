import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { X, ImageIcon, MapPin, AtSign } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currentUser } from '@/lib/mock-data';

export default function ComposeScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const maxLength = 280;

  const characterCount = content.length;
  const isOverLimit = characterCount > maxLength;
  const canPost = content.trim().length > 0 && !isOverLimit;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Pressable onPress={() => router.back()} className="p-1">
            <X size={24} color="#71717a" />
          </Pressable>
          <Pressable
            onPress={() => {
              if (canPost) {
                router.back();
              }
            }}
            className={`px-4 py-1.5 rounded-full ${canPost ? 'bg-sky-500' : 'bg-sky-300'}`}
            disabled={!canPost}
          >
            <Text className="text-white font-semibold">Post</Text>
          </Pressable>
        </View>

        {/* Compose Area */}
        <View className="flex-1 flex-row px-4 pt-4">
          <Image
            source={{ uri: currentUser.avatar }}
            className="w-10 h-10 rounded-full"
          />
          <View className="flex-1 ml-3">
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What's happening in spine surgery?"
              placeholderTextColor="#71717a"
              multiline
              className="text-lg text-zinc-900 dark:text-white min-h-[120px]"
              autoFocus
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable className="p-2 mr-2">
                <ImageIcon size={22} color="#0ea5e9" />
              </Pressable>
              <Pressable className="p-2 mr-2">
                <MapPin size={22} color="#0ea5e9" />
              </Pressable>
              <Pressable className="p-2">
                <AtSign size={22} color="#0ea5e9" />
              </Pressable>
            </View>

            {/* Character Count */}
            <View className="flex-row items-center">
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  isOverLimit
                    ? 'border-red-500'
                    : characterCount > maxLength * 0.8
                    ? 'border-amber-500'
                    : 'border-zinc-300 dark:border-zinc-600'
                }`}
              >
                {characterCount > maxLength * 0.8 && (
                  <Text
                    className={`text-[10px] font-bold ${
                      isOverLimit ? 'text-red-500' : 'text-amber-500'
                    }`}
                  >
                    {maxLength - characterCount}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Quick Hashtags */}
          <View className="flex-row flex-wrap mt-3">
            {['SpineSurgery', 'ClinicalCase', 'Research', 'Tips'].map(tag => (
              <Pressable
                key={tag}
                onPress={() => setContent(prev => prev + (prev.length > 0 ? ' ' : '') + `#${tag}`)}
                className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full mr-2 mb-2"
              >
                <Text className="text-zinc-600 dark:text-zinc-300 text-sm">#{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
