import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Youtube, ExternalLink } from 'lucide-react-native';
import { YouTubeEmbed as YouTubeEmbedType } from '@/lib/types';

interface YouTubeEmbedProps {
  embed: YouTubeEmbedType;
}

export function YouTubeEmbed({ embed }: YouTubeEmbedProps) {
  return (
    <View className="mt-3 rounded-xl overflow-hidden bg-black">
      {/* Embedded YouTube iframe for web */}
      <View style={{ aspectRatio: 16 / 9, width: '100%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${embed.videoId}?rel=0`}
          title={embed.title ?? 'YouTube video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </View>

      {/* Video info */}
      {embed.title ? (
        <View className="px-3 py-2.5 bg-zinc-900">
          <View className="flex-row items-center mb-1">
            <Youtube size={14} color="#ff0000" />
            <Text className="text-zinc-400 text-xs ml-1.5">YouTube</Text>
          </View>
          <Text className="text-white text-sm font-medium" numberOfLines={2}>
            {embed.title}
          </Text>
        </View>
      ) : (
        <View className="px-3 py-2 bg-zinc-900 flex-row items-center">
          <Youtube size={14} color="#ff0000" />
          <Text className="text-zinc-400 text-xs ml-1.5">YouTube</Text>
        </View>
      )}
    </View>
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
