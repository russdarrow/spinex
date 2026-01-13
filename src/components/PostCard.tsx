import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, BadgeCheck } from 'lucide-react-native';
import { Post } from '@/lib/types';
import { formatTimeAgo, formatNumber } from '@/lib/mock-data';
import { cn } from '@/lib/cn';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onRepost?: () => void;
  onBookmark?: () => void;
}

export function PostCard({ post, onPress, onLike, onRepost, onBookmark }: PostCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 active:bg-zinc-50 dark:active:bg-zinc-800/50"
    >
      <View className="flex-row">
        {/* Avatar */}
        <Image
          source={{ uri: post.author.avatar }}
          className="w-12 h-12 rounded-full"
        />

        {/* Content */}
        <View className="flex-1 ml-3">
          {/* Header */}
          <View className="flex-row items-center flex-wrap">
            <Text className="font-semibold text-zinc-900 dark:text-white text-[15px]">
              {post.author.name}
            </Text>
            {post.author.isVerified && (
              <BadgeCheck size={16} color="#0ea5e9" fill="#0ea5e9" className="ml-1" />
            )}
            <Text className="text-zinc-500 dark:text-zinc-400 text-[14px] ml-1">
              @{post.author.handle}
            </Text>
            <Text className="text-zinc-400 dark:text-zinc-500 text-[14px] mx-1">·</Text>
            <Text className="text-zinc-500 dark:text-zinc-400 text-[14px]">
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>

          {/* Post Content */}
          <Text className="text-zinc-900 dark:text-white text-[15px] mt-1 leading-[22px]">
            {post.content}
          </Text>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <View className="mt-3 rounded-2xl overflow-hidden">
              <Image
                source={{ uri: post.images[0] }}
                className="w-full h-48"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <View className="flex-row flex-wrap mt-1">
              {post.hashtags.map((tag) => (
                <Text key={tag} className="text-sky-500 text-[14px] mr-2">
                  #{tag}
                </Text>
              ))}
            </View>
          )}

          {/* Actions */}
          <View className="flex-row items-center justify-between mt-3 pr-8">
            <ActionButton
              icon={<MessageCircle size={18} color="#71717a" />}
              count={post.replies}
              onPress={() => {}}
            />
            <ActionButton
              icon={<Repeat2 size={18} color={post.isReposted ? '#22c55e' : '#71717a'} />}
              count={post.reposts}
              isActive={post.isReposted}
              activeColor="text-green-500"
              onPress={onRepost}
            />
            <ActionButton
              icon={<Heart size={18} color={post.isLiked ? '#ef4444' : '#71717a'} fill={post.isLiked ? '#ef4444' : 'transparent'} />}
              count={post.likes}
              isActive={post.isLiked}
              activeColor="text-red-500"
              onPress={onLike}
            />
            <ActionButton
              icon={<Bookmark size={18} color={post.isBookmarked ? '#0ea5e9' : '#71717a'} fill={post.isBookmarked ? '#0ea5e9' : 'transparent'} />}
              onPress={onBookmark}
            />
            <ActionButton
              icon={<Share size={18} color="#71717a" />}
              onPress={() => {}}
            />
          </View>

          {/* Views */}
          <Text className="text-zinc-400 dark:text-zinc-500 text-[13px] mt-2">
            {formatNumber(post.views)} views
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  count?: number;
  isActive?: boolean;
  activeColor?: string;
  onPress?: () => void;
}

function ActionButton({ icon, count, isActive, activeColor, onPress }: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center active:opacity-50"
    >
      {icon}
      {count !== undefined && (
        <Text className={cn(
          'ml-1 text-[13px]',
          isActive ? activeColor : 'text-zinc-500 dark:text-zinc-400'
        )}>
          {formatNumber(count)}
        </Text>
      )}
    </Pressable>
  );
}
