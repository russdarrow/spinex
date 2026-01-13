import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { X, ImageIcon, Cpu, FileText, FlaskConical, HelpCircle, ChevronDown, MessageSquare } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currentUser, devices, getCategoryColor, getCategoryLabel } from '@/lib/mock-data';
import { PostCategory } from '@/lib/types';

const categories: { value: PostCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'general', label: 'General', icon: <MessageSquare size={16} color="#71717a" /> },
  { value: 'case', label: 'Case Discussion', icon: <FileText size={16} color="#10b981" /> },
  { value: 'device', label: 'Device Review', icon: <Cpu size={16} color="#8b5cf6" /> },
  { value: 'research', label: 'Research', icon: <FlaskConical size={16} color="#f59e0b" /> },
  { value: 'question', label: 'Question', icon: <HelpCircle size={16} color="#3b82f6" /> },
];

export default function ComposeScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [procedure, setProcedure] = useState('');

  const maxLength = 500;
  const characterCount = content.length;
  const isOverLimit = characterCount > maxLength;
  const canPost = content.trim().length > 0 && !isOverLimit;

  const selectedCategoryData = categories.find(c => c.value === category);
  const categoryColor = getCategoryColor(category);

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

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Category Selector */}
          <View className="px-4 pt-3">
            <Pressable
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              className="flex-row items-center self-start px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700"
              style={{ borderColor: category !== 'general' ? categoryColor : undefined }}
            >
              {selectedCategoryData?.icon}
              <Text
                className="ml-1.5 text-sm font-medium"
                style={{ color: category !== 'general' ? categoryColor : '#71717a' }}
              >
                {selectedCategoryData?.label}
              </Text>
              <ChevronDown size={14} color={category !== 'general' ? categoryColor : '#71717a'} className="ml-1" />
            </Pressable>

            {/* Category Picker Dropdown */}
            {showCategoryPicker && (
              <View className="mt-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2">
                {categories.map(cat => (
                  <Pressable
                    key={cat.value}
                    onPress={() => {
                      setCategory(cat.value);
                      setShowCategoryPicker(false);
                      if (cat.value !== 'device') setSelectedDevice(null);
                    }}
                    className={`flex-row items-center px-3 py-2.5 rounded-lg ${category === cat.value ? 'bg-white dark:bg-zinc-700' : ''}`}
                  >
                    {cat.icon}
                    <Text className={`ml-2 ${category === cat.value ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'}`}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Device Selector (for device posts) */}
          {(category === 'device' || category === 'case') && (
            <View className="px-4 mt-3">
              <Pressable
                onPress={() => setShowDevicePicker(!showDevicePicker)}
                className="flex-row items-center self-start px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30"
              >
                <Cpu size={14} color="#8b5cf6" />
                <Text className="ml-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
                  {selectedDevice || 'Select Device'}
                </Text>
                <ChevronDown size={14} color="#8b5cf6" className="ml-1" />
              </Pressable>

              {showDevicePicker && (
                <View className="mt-2 bg-violet-50 dark:bg-violet-900/20 rounded-xl p-2 max-h-48">
                  <ScrollView nestedScrollEnabled style={{ flexGrow: 0 }}>
                    {devices.map(device => (
                      <Pressable
                        key={device.id}
                        onPress={() => {
                          setSelectedDevice(device.name);
                          setShowDevicePicker(false);
                        }}
                        className={`px-3 py-2.5 rounded-lg ${selectedDevice === device.name ? 'bg-violet-100 dark:bg-violet-800/30' : ''}`}
                      >
                        <Text className="font-medium text-zinc-900 dark:text-white">{device.name}</Text>
                        <Text className="text-xs text-zinc-500 dark:text-zinc-400">{device.manufacturer}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {/* Case Details (for case posts) */}
          {category === 'case' && (
            <View className="px-4 mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl mx-4">
              <Text className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Case Details (optional)</Text>
              <TextInput
                value={diagnosis}
                onChangeText={setDiagnosis}
                placeholder="Diagnosis"
                placeholderTextColor="#71717a"
                className="bg-white dark:bg-zinc-800 px-3 py-2 rounded-lg text-sm text-zinc-900 dark:text-white mb-2"
              />
              <TextInput
                value={procedure}
                onChangeText={setProcedure}
                placeholder="Procedure"
                placeholderTextColor="#71717a"
                className="bg-white dark:bg-zinc-800 px-3 py-2 rounded-lg text-sm text-zinc-900 dark:text-white"
              />
            </View>
          )}

          {/* Compose Area */}
          <View className="flex-row px-4 pt-4">
            <Image
              source={{ uri: currentUser.avatar }}
              className="w-10 h-10 rounded-full"
            />
            <View className="flex-1 ml-3">
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder={
                  category === 'case' ? "Describe your case..." :
                  category === 'device' ? "Share your experience with this device..." :
                  category === 'question' ? "Ask the spine surgery community..." :
                  category === 'research' ? "Share your research findings..." :
                  "What's happening in spine surgery?"
                }
                placeholderTextColor="#71717a"
                multiline
                className="text-lg text-zinc-900 dark:text-white min-h-[120px]"
                autoFocus
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable className="p-2 mr-2">
                <ImageIcon size={22} color="#0ea5e9" />
              </Pressable>
              <Pressable
                onPress={() => setShowDevicePicker(!showDevicePicker)}
                className="p-2 mr-2"
              >
                <Cpu size={22} color="#8b5cf6" />
              </Pressable>
            </View>

            {/* Character Count */}
            <View className="flex-row items-center">
              <Text className="text-zinc-400 text-xs mr-2">{characterCount}/{maxLength}</Text>
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
            {['SpineSurgery', 'CaseDiscussion', 'DeviceReview', 'Question'].map(tag => (
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
