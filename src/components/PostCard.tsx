import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, BadgeCheck, Cpu, FileText, FlaskConical, HelpCircle, Play } from 'lucide-react-native';
import { Post, MediaItem } from '@/lib/types';
import { formatTimeAgo, formatNumber, getCategoryColor, getCategoryLabel } from '@/lib/mock-data';
import { cn } from '@/lib/cn';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';

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

// Video player component with controls
function VideoPlayer({ uri, aspectRatio = 16/9 }: { uri: string; aspectRatio?: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
  });

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, player]);

  return (
    <Pressable onPress={togglePlay} className="relative">
      <VideoView
        player={player}
        style={{
          width: '100%',
          aspectRatio: aspectRatio,
        }}
        contentFit="contain"
        nativeControls={false}
      />
      {!isPlaying && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <View className="w-14 h-14 rounded-full bg-black/60 items-center justify-center">
            <Play size={28} color="white" fill="white" />
          </View>
        </View>
      )}
    </Pressable>
  );
}

// Single image with dynamic height based on aspect ratio
function MediaImage({ uri, aspectRatio }: { uri: string; aspectRatio?: number }) {
  const [imageAspect, setImageAspect] = useState(aspectRatio ?? 1);
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth - 32 - 48 - 12; // padding + avatar + margin

  // Calculate height: max 400px, min 150px
  const calculatedHeight = Math.min(400, Math.max(150, containerWidth / imageAspect));

  return (
    <Image
      source={{ uri }}
      style={{
        width: '100%',
        height: calculatedHeight,
        backgroundColor: '#18181b',
      }}
      contentFit="contain"
      onLoad={(e) => {
        if (!aspectRatio && e.source) {
          const { width, height } = e.source;
          if (width && height) {
            setImageAspect(width / height);
          }
        }
      }}
    />
  );
}

// Media gallery that handles both images and videos
function MediaGallery({ post }: { post: Post }) {
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth - 32 - 48 - 12;

  // If we have the new media array with aspect ratios, use it
  if (post.media && post.media.length > 0) {
    if (post.media.length === 1) {
      const item = post.media[0];
      if (item.type === 'video') {
        return (
          <View className="mt-3 rounded-2xl overflow-hidden bg-black">
            <VideoPlayer uri={item.uri} aspectRatio={item.aspectRatio} />
          </View>
        );
      }
      return (
        <View className="mt-3 rounded-2xl overflow-hidden bg-zinc-900">
          <MediaImage uri={item.uri} aspectRatio={item.aspectRatio} />
        </View>
      );
    }

    // Multiple media items - grid layout
    return (
      <View className="mt-3 rounded-2xl overflow-hidden">
        {post.media.length === 2 ? (
          <View className="flex-row" style={{ height: 200 }}>
            {post.media.map((item, index) => (
              <View key={index} className={`flex-1 ${index === 0 ? 'mr-0.5' : 'ml-0.5'}`}>
                {item.type === 'video' ? (
                  <View className="flex-1 bg-black">
                    <VideoPlayer uri={item.uri} aspectRatio={1} />
                  </View>
                ) : (
                  <Image
                    source={{ uri: item.uri }}
                    style={{ flex: 1, backgroundColor: '#18181b' }}
                    contentFit="cover"
                  />
                )}
              </View>
            ))}
          </View>
        ) : post.media.length === 3 ? (
          <View className="flex-row" style={{ height: 240 }}>
            <View className="flex-1 mr-0.5">
              {post.media[0].type === 'video' ? (
                <View className="flex-1 bg-black">
                  <VideoPlayer uri={post.media[0].uri} aspectRatio={0.75} />
                </View>
              ) : (
                <Image
                  source={{ uri: post.media[0].uri }}
                  style={{ flex: 1, backgroundColor: '#18181b' }}
                  contentFit="cover"
                />
              )}
            </View>
            <View className="flex-1 ml-0.5">
              {post.media.slice(1).map((item, index) => (
                <View key={index} className={`flex-1 ${index === 0 ? 'mb-0.5' : 'mt-0.5'}`}>
                  {item.type === 'video' ? (
                    <View className="flex-1 bg-black items-center justify-center">
                      <Play size={24} color="white" fill="white" />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: item.uri }}
                      style={{ flex: 1, backgroundColor: '#18181b' }}
                      contentFit="cover"
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ height: 240 }}>
            <View className="flex-row flex-1">
              {post.media.slice(0, 2).map((item, index) => (
                <View key={index} className={`flex-1 ${index === 0 ? 'mr-0.5' : 'ml-0.5'} mb-0.5`}>
                  {item.type === 'video' ? (
                    <View className="flex-1 bg-black items-center justify-center">
                      <Play size={24} color="white" fill="white" />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: item.uri }}
                      style={{ flex: 1, backgroundColor: '#18181b' }}
                      contentFit="cover"
                    />
                  )}
                </View>
              ))}
            </View>
            <View className="flex-row flex-1">
              {post.media.slice(2, 4).map((item, index) => (
                <View key={index} className={`flex-1 ${index === 0 ? 'mr-0.5' : 'ml-0.5'} mt-0.5`}>
                  {item.type === 'video' ? (
                    <View className="flex-1 bg-black items-center justify-center">
                      <Play size={24} color="white" fill="white" />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: item.uri }}
                      style={{ flex: 1, backgroundColor: '#18181b' }}
                      contentFit="cover"
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  }

  // Fallback for old images array - show full images with dynamic height
  if (post.images && post.images.length > 0) {
    if (post.images.length === 1) {
      return (
        <View className="mt-3 rounded-2xl overflow-hidden bg-zinc-900">
          <MediaImage uri={post.images[0]} />
        </View>
      );
    }

    // Multiple images - use grid but with better proportions
    return (
      <View className="mt-3 rounded-2xl overflow-hidden">
        {post.images.length === 2 ? (
          <View className="flex-row" style={{ height: 220 }}>
            <Image
              source={{ uri: post.images[0] }}
              style={{ flex: 1, marginRight: 1, backgroundColor: '#18181b' }}
              contentFit="cover"
            />
            <Image
              source={{ uri: post.images[1] }}
              style={{ flex: 1, marginLeft: 1, backgroundColor: '#18181b' }}
              contentFit="cover"
            />
          </View>
        ) : post.images.length === 3 ? (
          <View className="flex-row" style={{ height: 260 }}>
            <Image
              source={{ uri: post.images[0] }}
              style={{ flex: 1, marginRight: 1, backgroundColor: '#18181b' }}
              contentFit="cover"
            />
            <View className="flex-1 ml-0.5">
              <Image
                source={{ uri: post.images[1] }}
                style={{ flex: 1, marginBottom: 1, backgroundColor: '#18181b' }}
                contentFit="cover"
              />
              <Image
                source={{ uri: post.images[2] }}
                style={{ flex: 1, marginTop: 1, backgroundColor: '#18181b' }}
                contentFit="cover"
              />
            </View>
          </View>
        ) : (
          <View style={{ height: 260 }}>
            <View className="flex-row flex-1 mb-0.5">
              <Image
                source={{ uri: post.images[0] }}
                style={{ flex: 1, marginRight: 1, backgroundColor: '#18181b' }}
                contentFit="cover"
              />
              <Image
                source={{ uri: post.images[1] }}
                style={{ flex: 1, marginLeft: 1, backgroundColor: '#18181b' }}
                contentFit="cover"
              />
            </View>
            <View className="flex-row flex-1 mt-0.5">
              <Image
                source={{ uri: post.images[2] }}
                style={{ flex: 1, marginRight: 1, backgroundColor: '#18181b' }}
                contentFit="cover"
              />
              {post.images[3] && (
                <Image
                  source={{ uri: post.images[3] }}
                  style={{ flex: 1, marginLeft: 1, backgroundColor: '#18181b' }}
                  contentFit="cover"
                />
              )}
            </View>
          </View>
        )}
      </View>
    );
  }

  return null;
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
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />

        {/* Content */}
        <View className="flex-1 ml-3">
          {/* Header */}
          <View className="flex-row items-center flex-wrap">
            <Text className="font-semibold text-zinc-900 dark:text-white text-[15px]">
              {post.author.name}
            </Text>
            {post.author.isVerified ? (
              <BadgeCheck size={16} color="#0ea5e9" fill="#0ea5e9" style={{ marginLeft: 4 }} />
            ) : null}
            <Text className="text-zinc-500 dark:text-zinc-400 text-[14px] ml-1">
              @{post.author.handle}
            </Text>
            <Text className="text-zinc-400 dark:text-zinc-500 text-[14px] mx-1">-</Text>
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

          {/* Media Gallery */}
          <MediaGallery post={post} />

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
