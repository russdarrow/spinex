import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Link as LinkIcon, BadgeCheck, Grid3X3, Bookmark, ShieldCheck, Share2, UserPlus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { currentUser, posts, formatNumber } from '@/lib/mock-data';
import { PostCard } from '@/components/PostCard';
import { ShareApp } from '@/components/ShareApp';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  institution: string;
  specialties: string[];
  npi: string | null;
  isVerified: boolean;
  credential: string;
  bio?: string;
  website?: string;
  avatar?: string;
  handle?: string;
}

const USER_PROFILE_KEY = '@spinex_user_profile';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Reload profile data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      async function loadProfile() {
        try {
          const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
          if (data) {
            setUserProfile(JSON.parse(data));
          }
        } catch (e) {
          console.log('Error loading profile:', e);
        }
      }
      loadProfile();
    }, [])
  );

  // Use saved profile name if available, otherwise fallback to mock data
  const displayName = userProfile?.name || currentUser.name;
  const displayHandle = userProfile?.handle || currentUser.handle;
  const displayInstitution = userProfile?.institution || currentUser.institution;
  const displayBio = userProfile?.bio || currentUser.bio;
  const displayWebsite = userProfile?.website || 'stanford.edu/~schen';
  const displayAvatar = userProfile?.avatar || currentUser.avatar;
  const isVerified = userProfile?.isVerified ?? currentUser.isVerified;

  const userPosts = posts.filter(p => p.isLiked || p.isBookmarked).slice(0, 3);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Banner */}
        <View className="h-32 bg-gradient-to-r from-sky-500 to-cyan-400" style={{ backgroundColor: '#0ea5e9' }} />

        {/* Profile Info */}
        <View className="px-4 -mt-16">
          {/* Avatar & Edit Button */}
          <View className="flex-row justify-between items-end">
            <Image
              source={{ uri: displayAvatar }}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-black"
            />
            <View className="flex-row items-center mb-2">
              <Pressable
                onPress={() => setShowShareModal(true)}
                className="border border-zinc-300 dark:border-zinc-600 p-2 rounded-full mr-2 active:bg-zinc-100 dark:active:bg-zinc-800"
              >
                <UserPlus size={18} color="#71717a" />
              </Pressable>
              <Pressable
                onPress={() => router.push('/edit-profile')}
                className="border border-zinc-300 dark:border-zinc-600 px-4 py-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
              >
                <Text className="font-semibold text-zinc-900 dark:text-white text-sm">Edit profile</Text>
              </Pressable>
            </View>
          </View>

          {/* Name & Handle */}
          <View className="mt-3">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                {displayName}
              </Text>
              {isVerified ? (
                <BadgeCheck size={20} color="#0ea5e9" fill="#0ea5e9" style={{ marginLeft: 4 }} />
              ) : null}
            </View>
            <Text className="text-zinc-500 dark:text-zinc-400">@{displayHandle}</Text>
            {isVerified && userProfile?.npi ? (
              <View className="flex-row items-center mt-2 bg-emerald-500/10 px-3 py-1.5 rounded-full self-start">
                <ShieldCheck size={14} color="#10b981" />
                <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-medium ml-1">
                  Verified Physician - NPI {userProfile.npi}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Bio */}
          <Text className="text-zinc-900 dark:text-white mt-3 leading-5">
            {displayBio}
          </Text>

          {/* Specialties */}
          {userProfile?.specialties && userProfile.specialties.length > 0 ? (
            <View className="flex-row flex-wrap mt-3">
              {userProfile.specialties.map((specialty) => (
                <View key={specialty} className="bg-sky-500/10 px-2.5 py-1 rounded-full mr-2 mb-1">
                  <Text className="text-sky-600 dark:text-sky-400 text-xs font-medium">{specialty}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Details */}
          <View className="flex-row flex-wrap mt-3">
            <View className="flex-row items-center mr-4 mb-1">
              <MapPin size={14} color="#71717a" />
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm ml-1">
                {displayInstitution}
              </Text>
            </View>
            {displayWebsite ? (
              <View className="flex-row items-center mr-4 mb-1">
                <LinkIcon size={14} color="#71717a" />
                <Text className="text-sky-500 text-sm ml-1">
                  {displayWebsite}
                </Text>
              </View>
            ) : null}
            <View className="flex-row items-center mb-1">
              <Calendar size={14} color="#71717a" />
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm ml-1">
                Joined March 2019
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row mt-3">
            <Pressable className="flex-row mr-4">
              <Text className="font-bold text-zinc-900 dark:text-white">
                {formatNumber(currentUser.following)}
              </Text>
              <Text className="text-zinc-500 dark:text-zinc-400 ml-1">Following</Text>
            </Pressable>
            <Pressable className="flex-row">
              <Text className="font-bold text-zinc-900 dark:text-white">
                {formatNumber(currentUser.followers)}
              </Text>
              <Text className="text-zinc-500 dark:text-zinc-400 ml-1">Followers</Text>
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row mt-4 border-b border-zinc-100 dark:border-zinc-800">
          {(['posts', 'replies', 'media', 'likes'] as const).map(tab => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-3 ${activeTab === tab ? 'border-b-2 border-sky-500' : ''}`}
            >
              <Text className={`text-center font-medium capitalize ${activeTab === tab ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Content */}
        {activeTab === 'posts' ? (
          <View>
            {userPosts.length > 0 ? (
              userPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPress={() => router.push(`/post/${post.id}`)}
                />
              ))
            ) : (
              <View className="py-12 items-center">
                <Grid3X3 size={48} color="#71717a" />
                <Text className="text-zinc-500 dark:text-zinc-400 mt-4 text-center">
                  No posts yet
                </Text>
              </View>
            )}
          </View>
        ) : null}

        {activeTab === 'replies' ? (
          <View className="py-12 items-center">
            <Text className="text-zinc-500 dark:text-zinc-400">No replies yet</Text>
          </View>
        ) : null}

        {activeTab === 'media' ? (
          <View className="py-12 items-center">
            <Grid3X3 size={48} color="#71717a" />
            <Text className="text-zinc-500 dark:text-zinc-400 mt-4">No media yet</Text>
          </View>
        ) : null}

        {activeTab === 'likes' ? (
          <View className="py-12 items-center">
            <Bookmark size={48} color="#71717a" />
            <Text className="text-zinc-500 dark:text-zinc-400 mt-4">No likes yet</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Share Modal */}
      <ShareApp
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
      </SafeAreaView>
    </View>
  );
}
