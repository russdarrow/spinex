import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { X, ImageIcon, Cpu, FileText, FlaskConical, HelpCircle, ChevronDown, MessageSquare, XCircle, Video, Camera, Image as ImageIconLucide } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { currentUser, devices, getCategoryColor } from '@/lib/mock-data';
import { PostCategory, MediaItem } from '@/lib/types';
import { usePostsStore } from '@/lib/posts-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';

const USER_PROFILE_KEY = '@spinex_user_profile';

const categories: { value: PostCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'general', label: 'General', icon: <MessageSquare size={16} color="#71717a" /> },
  { value: 'case', label: 'Case Discussion', icon: <FileText size={16} color="#10b981" /> },
  { value: 'device', label: 'Device Review', icon: <Cpu size={16} color="#8b5cf6" /> },
  { value: 'research', label: 'Research', icon: <FlaskConical size={16} color="#f59e0b" /> },
  { value: 'question', label: 'Question', icon: <HelpCircle size={16} color="#3b82f6" /> },
];

// Video thumbnail component
function VideoThumbnail({ uri, onRemove }: { uri: string; onRemove: () => void }) {
  const player = useVideoPlayer(uri, (p) => {
    p.pause();
  });

  return (
    <View className="mr-3 relative">
      <View className="w-24 h-24 rounded-xl overflow-hidden bg-black">
        <VideoView
          player={player}
          style={{ width: 96, height: 96 }}
          contentFit="cover"
          nativeControls={false}
        />
        <View className="absolute inset-0 items-center justify-center bg-black/30">
          <Video size={24} color="white" />
        </View>
      </View>
      <Pressable
        onPress={onRemove}
        className="absolute -top-2 -right-2 bg-black/70 rounded-full p-0.5"
      >
        <XCircle size={20} color="white" fill="black" />
      </Pressable>
    </View>
  );
}

export default function ComposeScreen() {
  const router = useRouter();
  const addPost = usePostsStore((s) => s.addPost);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [procedure, setProcedure] = useState('');
  const [userAvatar, setUserAvatar] = useState(currentUser.avatar);
  const [isPosting, setIsPosting] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<MediaItem[]>([]);

  // Load user's avatar
  useFocusEffect(
    useCallback(() => {
      async function loadAvatar() {
        try {
          const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
          if (data) {
            const profile = JSON.parse(data);
            if (profile.avatar) {
              setUserAvatar(profile.avatar);
            }
          }
        } catch (e) {
          console.log('Error loading avatar:', e);
        }
      }
      loadAvatar();
    }, [])
  );

  const maxLength = 500;
  const characterCount = content.length;
  const isOverLimit = characterCount > maxLength;
  const canPost = content.trim().length > 0 && !isOverLimit && !isPosting;

  const selectedCategoryData = categories.find(c => c.value === category);
  const categoryColor = getCategoryColor(category);

  // Check if we have a video (only one video allowed)
  const hasVideo = attachedMedia.some(m => m.type === 'video');
  const mediaCount = attachedMedia.length;

  const pickMedia = async (type: 'images' | 'videos') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to add media to your post.'
      );
      return;
    }

    if (type === 'videos') {
      // Only allow one video
      if (hasVideo) {
        Alert.alert('Video Limit', 'You can only attach one video per post.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsMultipleSelection: false,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const aspectRatio = asset.width && asset.height ? asset.width / asset.height : 16 / 9;

        // Replace all media with just the video
        setAttachedMedia([{
          uri: asset.uri,
          type: 'video',
          aspectRatio,
        }]);
      }
    } else {
      // Images - but not if we already have a video
      if (hasVideo) {
        Alert.alert('Media Conflict', 'You cannot mix videos and images. Remove the video first.');
        return;
      }

      const remainingSlots = 4 - mediaCount;
      if (remainingSlots <= 0) {
        Alert.alert('Limit Reached', 'You can only attach up to 4 images per post.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newMedia: MediaItem[] = result.assets.map(asset => ({
          uri: asset.uri,
          type: 'image' as const,
          aspectRatio: asset.width && asset.height ? asset.width / asset.height : 1,
        }));
        setAttachedMedia(prev => [...prev, ...newMedia].slice(0, 4));
      }
    }
  };

  const takePhoto = async () => {
    if (hasVideo) {
      Alert.alert('Media Conflict', 'You cannot mix videos and images. Remove the video first.');
      return;
    }

    if (mediaCount >= 4) {
      Alert.alert('Limit Reached', 'You can only attach up to 4 images per post.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your camera to take a photo.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newMedia: MediaItem = {
        uri: asset.uri,
        type: 'image',
        aspectRatio: asset.width && asset.height ? asset.width / asset.height : 1,
      };
      setAttachedMedia(prev => [...prev, newMedia].slice(0, 4));
    }
  };

  const recordVideo = async () => {
    if (hasVideo) {
      Alert.alert('Video Limit', 'You can only attach one video per post.');
      return;
    }

    if (mediaCount > 0) {
      Alert.alert('Media Conflict', 'Remove existing media before recording a video.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your camera to record a video.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos'],
      videoMaxDuration: 60,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setAttachedMedia([{
        uri: asset.uri,
        type: 'video',
        aspectRatio: asset.width && asset.height ? asset.width / asset.height : 16 / 9,
      }]);
    }
  };

  const showMediaOptions = () => {
    Alert.alert(
      'Add Media',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Record Video', onPress: recordVideo },
        { text: 'Choose Photos', onPress: () => pickMedia('images') },
        { text: 'Choose Video', onPress: () => pickMedia('videos') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const removeMedia = (index: number) => {
    setAttachedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!canPost) return;

    setIsPosting(true);
    try {
      await addPost(content, category, {
        device: selectedDevice ?? undefined,
        diagnosis: diagnosis || undefined,
        procedure: procedure || undefined,
        media: attachedMedia.length > 0 ? attachedMedia : undefined,
      });
      router.back();
    } catch (e) {
      console.log('Error posting:', e);
      setIsPosting(false);
    }
  };

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
            onPress={handlePost}
            className={`px-4 py-1.5 rounded-full ${canPost ? 'bg-sky-500' : 'bg-sky-300'}`}
            disabled={!canPost}
          >
            <Text className="text-white font-semibold">
              {isPosting ? 'Posting...' : 'Post'}
            </Text>
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
              <ChevronDown size={14} color={category !== 'general' ? categoryColor : '#71717a'} style={{ marginLeft: 4 }} />
            </Pressable>

            {/* Category Picker Dropdown */}
            {showCategoryPicker ? (
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
            ) : null}
          </View>

          {/* Device Selector (for device posts) */}
          {(category === 'device' || category === 'case') ? (
            <View className="px-4 mt-3">
              <Pressable
                onPress={() => setShowDevicePicker(!showDevicePicker)}
                className="flex-row items-center self-start px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30"
              >
                <Cpu size={14} color="#8b5cf6" />
                <Text className="ml-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
                  {selectedDevice || 'Select Device'}
                </Text>
                <ChevronDown size={14} color="#8b5cf6" style={{ marginLeft: 4 }} />
              </Pressable>

              {showDevicePicker ? (
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
              ) : null}
            </View>
          ) : null}

          {/* Case Details (for case posts) */}
          {category === 'case' ? (
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
          ) : null}

          {/* Compose Area */}
          <View className="flex-row px-4 pt-4">
            <Image
              source={{ uri: userAvatar }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
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
                className="text-[15px] text-zinc-900 dark:text-white min-h-[120px]"
                autoFocus
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Attached Media */}
          {attachedMedia.length > 0 ? (
            <View className="px-4 mt-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
              >
                {attachedMedia.map((media, index) => (
                  media.type === 'video' ? (
                    <VideoThumbnail
                      key={index}
                      uri={media.uri}
                      onRemove={() => removeMedia(index)}
                    />
                  ) : (
                    <View key={index} className="mr-3 relative">
                      <Image
                        source={{ uri: media.uri }}
                        style={{ width: 96, height: 96, borderRadius: 12 }}
                        contentFit="cover"
                      />
                      <Pressable
                        onPress={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-black/70 rounded-full p-0.5"
                      >
                        <XCircle size={20} color="white" fill="black" />
                      </Pressable>
                    </View>
                  )
                ))}
                {!hasVideo && mediaCount < 4 ? (
                  <Pressable
                    onPress={showMediaOptions}
                    className="w-24 h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800 items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600"
                  >
                    <ImageIcon size={24} color="#71717a" />
                    <Text className="text-zinc-500 text-xs mt-1">Add more</Text>
                  </Pressable>
                ) : null}
              </ScrollView>
              <Text className="text-zinc-400 text-xs mt-2">
                {hasVideo ? '1 video attached' : `${mediaCount}/4 images`}
              </Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Bottom Actions */}
        <View className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable onPress={() => pickMedia('images')} className="p-2 mr-1">
                <ImageIconLucide size={22} color="#0ea5e9" />
              </Pressable>
              <Pressable onPress={() => pickMedia('videos')} className="p-2 mr-1">
                <Video size={22} color="#f97316" />
              </Pressable>
              <Pressable onPress={takePhoto} className="p-2 mr-1">
                <Camera size={22} color="#22c55e" />
              </Pressable>
              <Pressable
                onPress={() => setShowDevicePicker(!showDevicePicker)}
                className="p-2"
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
                {characterCount > maxLength * 0.8 ? (
                  <Text
                    className={`text-[10px] font-bold ${
                      isOverLimit ? 'text-red-500' : 'text-amber-500'
                    }`}
                  >
                    {maxLength - characterCount}
                  </Text>
                ) : null}
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
