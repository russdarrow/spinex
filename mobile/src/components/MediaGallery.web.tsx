import React, { useState, useRef } from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { Post } from '@/lib/types';
import { Image } from 'expo-image';

// Web video player using HTML5 video element
export function VideoPlayer({ uri, aspectRatio = 16/9 }: { uri: string; aspectRatio?: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Pressable onPress={togglePlay} style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        src={uri}
        loop
        muted
        playsInline
        style={{
          width: '100%',
          aspectRatio: aspectRatio,
          objectFit: 'contain',
          backgroundColor: '#000',
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(0,0,0,0.6)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
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
  isDetailView?: boolean;
}

export function MediaGallery({ post, isDetailView = false }: MediaGalleryProps) {
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = isDetailView
    ? screenWidth - 32
    : screenWidth - 32 - 48 - 12;

  const gridHeight = isDetailView ? 300 : 240;
  const singleGridHeight = isDetailView ? 280 : 220;

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

  // Fallback for old images array
  if (post.images && post.images.length > 0) {
    if (post.images.length === 1) {
      return (
        <View className="mt-4 rounded-2xl overflow-hidden bg-zinc-900">
          <MediaImage uri={post.images[0]} containerWidth={containerWidth} />
        </View>
      );
    }

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
