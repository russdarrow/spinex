import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Link as LinkIcon, BadgeCheck, Grid3X3, Bookmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { currentUser, posts, formatNumber } from '@/lib/mock-data';
import { PostCard } from '@/components/PostCard';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');

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
              source={{ uri: currentUser.avatar }}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-black"
            />
            <Pressable className="border border-zinc-300 dark:border-zinc-600 px-4 py-1.5 rounded-full mb-2">
              <Text className="font-semibold text-zinc-900 dark:text-white text-sm">Edit profile</Text>
            </Pressable>
          </View>

          {/* Name & Handle */}
          <View className="mt-3">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                {currentUser.name}
              </Text>
              {currentUser.isVerified && (
                <BadgeCheck size={20} color="#0ea5e9" fill="#0ea5e9" className="ml-1" />
              )}
            </View>
            <Text className="text-zinc-500 dark:text-zinc-400">@{currentUser.handle}</Text>
          </View>

          {/* Bio */}
          <Text className="text-zinc-900 dark:text-white mt-3 leading-5">
            {currentUser.bio}
          </Text>

          {/* Details */}
          <View className="flex-row flex-wrap mt-3">
            <View className="flex-row items-center mr-4 mb-1">
              <MapPin size={14} color="#71717a" />
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm ml-1">
                {currentUser.institution}
              </Text>
            </View>
            <View className="flex-row items-center mr-4 mb-1">
              <LinkIcon size={14} color="#71717a" />
              <Text className="text-sky-500 text-sm ml-1">
                stanford.edu/~schen
              </Text>
            </View>
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
        {activeTab === 'posts' && (
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
        )}

        {activeTab === 'replies' && (
          <View className="py-12 items-center">
            <Text className="text-zinc-500 dark:text-zinc-400">No replies yet</Text>
          </View>
        )}

        {activeTab === 'media' && (
          <View className="py-12 items-center">
            <Grid3X3 size={48} color="#71717a" />
            <Text className="text-zinc-500 dark:text-zinc-400 mt-4">No media yet</Text>
          </View>
        )}

        {activeTab === 'likes' && (
          <View className="py-12 items-center">
            <Bookmark size={48} color="#71717a" />
            <Text className="text-zinc-500 dark:text-zinc-400 mt-4">No likes yet</Text>
          </View>
        )}
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}
