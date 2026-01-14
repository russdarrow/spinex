import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, BadgeCheck, Cpu, FileText, FlaskConical, HelpCircle } from 'lucide-react-native';
import { Post } from '@/lib/types';
import { formatTimeAgo, formatNumber, getCategoryColor, getCategoryLabel } from '@/lib/mock-data';
import { cn } from '@/lib/cn';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onRepost?: () => void;
  onBookmark?: () => void;
}

function getCategoryIcon(category: string, color: string) {
  const size = 12;
  switch (category) {
    case 'case':
      return <FileText size={size} color={color} />;
    case 'device':
      return <Cpu size={size} color={color} />;
    case 'research':
      return <FlaskConical size={size} color={color} />;
    case 'question':
      return <HelpCircle size={size} color={color} />;
    default:
      return null;
  }
}

export function PostCard({ post, onPress, onLike, onRepost, onBookmark }: PostCardProps) {
  const categoryColor = getCategoryColor(post.category);

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
            {post.author.isVerified ? (
              <BadgeCheck size={16} color="#0ea5e9" fill="#0ea5e9" className="ml-1" />
            ) : null}
            <Text className="text-zinc-500 dark:text-zinc-400 text-[14px] ml-1">
              @{post.author.handle}
            </Text>
            <Text className="text-zinc-400 dark:text-zinc-500 text-[14px] mx-1">·</Text>
            <Text className="text-zinc-500 dark:text-zinc-400 text-[14px]">
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>

          {/* Category Badge */}
          {post.category !== 'general' ? (
            <View className="flex-row items-center mt-1.5">
              <View
                className="flex-row items-center px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${categoryColor}15` }}
              >
                {getCategoryIcon(post.category, categoryColor)}
                <Text
                  className="text-[11px] font-medium ml-1"
                  style={{ color: categoryColor }}
                >
                  {getCategoryLabel(post.category)}
                </Text>
              </View>
              {post.deviceMention ? (
                <View className="flex-row items-center ml-2 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                  <Cpu size={10} color="#8b5cf6" />
                  <Text className="text-[11px] font-medium text-violet-600 dark:text-violet-400 ml-1">
                    {post.deviceMention}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Case Details */}
          {post.caseDetails ? (
            <View className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <View className="flex-row items-center mb-1">
                <Text className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Dx:</Text>
                <Text className="text-[11px] text-emerald-600 dark:text-emerald-300 ml-1">{post.caseDetails.diagnosis}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Procedure:</Text>
                <Text className="text-[11px] text-emerald-600 dark:text-emerald-300 ml-1">{post.caseDetails.procedure}</Text>
              </View>
              {post.caseDetails.outcome ? (
                <View className="flex-row items-center mt-1">
                  <Text className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Outcome:</Text>
                  <Text className="text-[11px] text-emerald-600 dark:text-emerald-300 ml-1">{post.caseDetails.outcome}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Post Content */}
          <Text className="text-zinc-900 dark:text-white text-[15px] mt-2 leading-[22px]">
            {post.content}
          </Text>

          {/* Images */}
          {post.images && post.images.length > 0 ? (
            <View className="mt-3 rounded-2xl overflow-hidden">
              {post.images.length === 1 ? (
                <Image
                  source={{ uri: post.images[0] }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              ) : post.images.length === 2 ? (
                <View className="flex-row">
                  <Image
                    source={{ uri: post.images[0] }}
                    className="flex-1 h-48 mr-0.5"
                    resizeMode="cover"
                  />
                  <Image
                    source={{ uri: post.images[1] }}
                    className="flex-1 h-48 ml-0.5"
                    resizeMode="cover"
                  />
                </View>
              ) : post.images.length === 3 ? (
                <View className="flex-row">
                  <Image
                    source={{ uri: post.images[0] }}
                    className="flex-1 h-48 mr-0.5"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-0.5">
                    <Image
                      source={{ uri: post.images[1] }}
                      className="flex-1 mb-0.5"
                      resizeMode="cover"
                    />
                    <Image
                      source={{ uri: post.images[2] }}
                      className="flex-1 mt-0.5"
                      resizeMode="cover"
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <View className="flex-row">
                    <Image
                      source={{ uri: post.images[0] }}
                      className="flex-1 h-24 mr-0.5"
                      resizeMode="cover"
                    />
                    <Image
                      source={{ uri: post.images[1] }}
                      className="flex-1 h-24 ml-0.5"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-row mt-1">
                    <Image
                      source={{ uri: post.images[2] }}
                      className="flex-1 h-24 mr-0.5"
                      resizeMode="cover"
                    />
                    <Image
                      source={{ uri: post.images[3] }}
                      className="flex-1 h-24 ml-0.5"
                      resizeMode="cover"
                    />
                  </View>
                </View>
              )}
            </View>
          ) : null}

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 ? (
            <View className="flex-row flex-wrap mt-2">
              {post.hashtags.map((tag) => (
                <Text key={tag} className="text-sky-500 text-[14px] mr-2">
                  #{tag}
                </Text>
              ))}
            </View>
          ) : null}

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
      {count !== undefined ? (
        <Text className={cn(
          'ml-1 text-[13px]',
          isActive ? activeColor : 'text-zinc-500 dark:text-zinc-400'
        )}>
          {formatNumber(count)}
        </Text>
      ) : null}
    </Pressable>
  );
}
