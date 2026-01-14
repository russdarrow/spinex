import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { PostCard } from '@/components/PostCard';
import { currentUser } from '@/lib/mock-data';
import { usePostsStore } from '@/lib/posts-store';
import { useFollowsStore } from '@/lib/follows-store';

export default function FeedScreen() {
  const router = useRouter();
  const posts = usePostsStore((s) => s.posts);
  const likePost = usePostsStore((s) => s.likePost);
  const repostPost = usePostsStore((s) => s.repostPost);
  const bookmarkPost = usePostsStore((s) => s.bookmarkPost);
  const followingIds = useFollowsStore((s) => s.followingIds);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filter posts based on active tab
  const displayedPosts = activeTab === 'following'
    ? posts.filter(post => followingIds.includes(post.author.id))
    : posts;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Image
            source={{ uri: currentUser.avatar }}
            className="w-8 h-8 rounded-full"
          />
          <View className="items-center">
            <Text className="text-lg font-bold text-zinc-900 dark:text-white">SpineX</Text>
            <Text className="text-xs text-zinc-500">For Spine Surgeons</Text>
          </View>
          <View className="w-8" />
        </View>

        {/* Feed Tabs */}
        <View className="flex-row border-b border-zinc-100 dark:border-zinc-800">
          <Pressable
            onPress={() => setActiveTab('forYou')}
            className={`flex-1 py-3 ${activeTab === 'forYou' ? 'border-b-2 border-sky-500' : ''}`}
          >
            <Text className={`text-center font-semibold ${activeTab === 'forYou' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
              For You
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('following')}
            className={`flex-1 py-3 ${activeTab === 'following' ? 'border-b-2 border-sky-500' : ''}`}
          >
            <Text className={`text-center font-semibold ${activeTab === 'following' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
              Following
            </Text>
          </Pressable>
        </View>

        {/* Posts */}
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />
          }
          showsVerticalScrollIndicator={false}
        >
          {displayedPosts.length > 0 ? (
            displayedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onPress={() => router.push(`/post/${post.id}`)}
                onLike={() => likePost(post.id)}
                onRepost={() => repostPost(post.id)}
                onBookmark={() => bookmarkPost(post.id)}
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-zinc-500 dark:text-zinc-400 text-center">
                No posts from people you follow yet.
              </Text>
              <Text className="text-zinc-400 dark:text-zinc-500 text-center text-sm mt-1">
                Follow more surgeons to see their posts here.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Compose FAB */}
        <Pressable
          onPress={() => router.push('/compose')}
          className="absolute bottom-6 right-6 w-14 h-14 bg-sky-500 rounded-full items-center justify-center shadow-lg active:bg-sky-600"
          style={{
            shadowColor: '#0ea5e9',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Pencil size={24} color="white" />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
