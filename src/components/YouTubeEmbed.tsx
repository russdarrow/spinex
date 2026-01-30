import React, { useState } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Play, Youtube, ExternalLink } from 'lucide-react-native';
import { YouTubeEmbed as YouTubeEmbedType } from '@/lib/types';

interface YouTubeEmbedProps {
  embed: YouTubeEmbedType;
}

export function YouTubeEmbed({ embed }: YouTubeEmbedProps) {
  const [imageError, setImageError] = useState(false);

  // YouTube thumbnail URLs - try maxresdefault first, fallback to hqdefault
  const thumbnailUrl = imageError
    ? `https://img.youtube.com/vi/${embed.videoId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${embed.videoId}/maxresdefault.jpg`;

  const handlePress = () => {
    // Open YouTube video in browser or YouTube app
    Linking.openURL(embed.url);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mt-3 rounded-xl overflow-hidden bg-black"
    >
      {/* Thumbnail with play button overlay */}
      <View className="relative" style={{ aspectRatio: 16 / 9 }}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          onError={() => setImageError(true)}
        />

        {/* Dark gradient overlay */}
        <View
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        />

        {/* Play button */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-red-600 rounded-2xl px-5 py-3 flex-row items-center">
            <Play size={24} color="white" fill="white" />
            <Text className="text-white font-semibold ml-2 text-base">Play</Text>
          </View>
        </View>

        {/* YouTube branding */}
        <View className="absolute top-3 left-3 flex-row items-center bg-black/60 rounded-lg px-2 py-1">
          <Youtube size={16} color="#ff0000" />
          <Text className="text-white text-xs font-medium ml-1.5">YouTube</Text>
        </View>

        {/* External link indicator */}
        <View className="absolute top-3 right-3 bg-black/60 rounded-lg p-1.5">
          <ExternalLink size={14} color="white" />
        </View>
      </View>

      {/* Video title if available */}
      {embed.title ? (
        <View className="px-3 py-2.5 bg-zinc-900">
          <Text className="text-white text-sm font-medium" numberOfLines={2}>
            {embed.title}
          </Text>
          <Text className="text-zinc-400 text-xs mt-1">youtube.com</Text>
        </View>
      ) : (
        <View className="px-3 py-2 bg-zinc-900">
          <Text className="text-zinc-400 text-xs">Tap to watch on YouTube</Text>
        </View>
      )}
    </Pressable>
  );
}

// Utility function to extract YouTube video ID from various URL formats
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    // Standard watch URLs: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Short URLs: youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URLs: youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Mobile URLs: m.youtube.com/watch?v=VIDEO_ID
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // YouTube Shorts: youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

// Check if a URL is a YouTube URL
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

// Extract YouTube URL from text content
export function extractYouTubeUrlFromText(text: string): string | null {
  const urlPattern = /(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/|m\.youtube\.com\/watch\?v=)[a-zA-Z0-9_-]{11}[^\s]*)/gi;
  const match = text.match(urlPattern);
  return match?.[0] ?? null;
}
