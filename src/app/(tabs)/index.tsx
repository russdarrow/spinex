import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { PostCard } from '@/components/PostCard';
import { posts as initialPosts, currentUser } from '@/lib/mock-data';
import { Post } from '@/lib/types';

export default function FeedScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleRepost = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, isReposted: !p.isReposted, reposts: p.isReposted ? p.reposts - 1 : p.reposts + 1 }
          : p
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, isBookmarked: !p.isBookmarked }
          : p
      )
    );
  };

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
          <Pressable className="flex-1 py-3 border-b-2 border-sky-500">
            <Text className="text-center font-semibold text-zinc-900 dark:text-white">For You</Text>
          </Pressable>
          <Pressable className="flex-1 py-3">
            <Text className="text-center text-zinc-500 dark:text-zinc-400">Following</Text>
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
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => router.push(`/post/${post.id}`)}
              onLike={() => handleLike(post.id)}
              onRepost={() => handleRepost(post.id)}
              onBookmark={() => handleBookmark(post.id)}
            />
          ))}
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
