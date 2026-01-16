import React, { useState, useCallback } from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import { Play } from 'lucide-react-native';
import { Post, MediaItem } from '@/lib/types';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';

// Video player component with controls
export function VideoPlayer({ uri, aspectRatio = 16/9 }: { uri: string; aspectRatio?: number }) {
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
function MediaImage({ uri, aspectRatio, containerWidth }: { uri: string; aspectRatio?: number; containerWidth: number }) {
  const [imageAspect, setImageAspect] = useState(aspectRatio ?? 1);

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

interface MediaGalleryProps {
  post: Post;
  isDetailView?: boolean; // Larger display for detail view
}

// Media gallery that handles both images and videos
export function MediaGallery({ post, isDetailView = false }: MediaGalleryProps) {
  const { width: screenWidth } = useWindowDimensions();
  // For feed: account for padding + avatar + margin
  // For detail view: just account for padding
  const containerWidth = isDetailView
    ? screenWidth - 32
    : screenWidth - 32 - 48 - 12;

  const gridHeight = isDetailView ? 300 : 240;
  const singleGridHeight = isDetailView ? 280 : 220;

  // If we have the new media array with aspect ratios, use it
  if (post.media && post.media.length > 0) {
    if (post.media.length === 1) {
      const item = post.media[0];
      if (item.type === 'video') {
        return (
          <View className="mt-4 rounded-2xl overflow-hidden bg-black">
            <VideoPlayer uri={item.uri} aspectRatio={item.aspectRatio} />
          </View>
        );
      }
      return (
        <View className="mt-4 rounded-2xl overflow-hidden bg-zinc-900">
          <MediaImage uri={item.uri} aspectRatio={item.aspectRatio} containerWidth={containerWidth} />
        </View>
      );
    }

    // Multiple media items - grid layout
    return (
      <View className="mt-4 rounded-2xl overflow-hidden">
        {post.media.length === 2 ? (
          <View className="flex-row" style={{ height: singleGridHeight }}>
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
          <View className="flex-row" style={{ height: gridHeight }}>
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
          <View style={{ height: gridHeight }}>
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
        <View className="mt-4 rounded-2xl overflow-hidden bg-zinc-900">
          <MediaImage uri={post.images[0]} containerWidth={containerWidth} />
        </View>
      );
    }

    // Multiple images - use grid but with better proportions
    return (
      <View className="mt-4 rounded-2xl overflow-hidden">
        {post.images.length === 2 ? (
          <View className="flex-row" style={{ height: singleGridHeight }}>
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
          <View className="flex-row" style={{ height: gridHeight }}>
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
          <View style={{ height: gridHeight }}>
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
