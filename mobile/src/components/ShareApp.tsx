import React, { useState } from 'react';
import { View, Text, Pressable, Share, Platform } from 'react-native';
import { Copy, Check, Share2, QrCode, Users, Gift, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';

// App invite/share link - update this to your actual app link
const APP_INVITE_URL = 'https://www.vibecodeapp.com/s/spinex';
const APP_NAME = 'SpineX';

interface ShareAppProps {
  visible: boolean;
  onClose: () => void;
  referralCode?: string;
}

export function ShareApp({ visible, onClose, referralCode }: ShareAppProps) {
  const [copied, setCopied] = useState(false);

  // Generate personalized link with referral code if available
  const shareLink = referralCode
    ? `${APP_INVITE_URL}?ref=${referralCode}`
    : APP_INVITE_URL;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: Platform.OS === 'ios'
          ? `Join me on ${APP_NAME} - the professional network for spine surgeons! 🩺`
          : `Join me on ${APP_NAME} - the professional network for spine surgeons! 🩺\n\n${shareLink}`,
        url: Platform.OS === 'ios' ? shareLink : undefined,
        title: `Join ${APP_NAME}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  if (!visible) return null;

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareLink)}&bgcolor=ffffff&color=0f172a&margin=8`;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      className="absolute inset-0 bg-black/60 z-50 items-center justify-center px-4"
    >
      <Pressable className="absolute inset-0" onPress={onClose} />

      <Animated.View
        entering={SlideInUp.duration(300).springify()}
        className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm overflow-hidden"
      >
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-sky-500 items-center justify-center mr-3">
                <Users size={20} color="white" />
              </View>
              <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                Invite Colleagues
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center"
            >
              <X size={18} color="#71717a" />
            </Pressable>
          </View>

          <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
            Share SpineX with fellow spine surgeons and grow our professional community.
          </Text>
        </View>

        {/* QR Code */}
        <View className="items-center py-6 bg-zinc-50 dark:bg-zinc-800/50">
          <View className="bg-white p-3 rounded-2xl shadow-sm">
            <Image
              source={{ uri: qrCodeUrl }}
              style={{ width: 160, height: 160 }}
              contentFit="contain"
            />
          </View>
          <View className="flex-row items-center mt-3">
            <QrCode size={14} color="#71717a" />
            <Text className="text-zinc-500 dark:text-zinc-400 text-xs ml-1.5">
              Scan to download
            </Text>
          </View>
        </View>

        {/* Share Link */}
        <View className="p-6 pt-4">
          <Text className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Share Link
          </Text>

          <Pressable
            onPress={handleCopyLink}
            className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3"
          >
            <Text
              className="flex-1 text-zinc-700 dark:text-zinc-300 text-sm mr-2"
              numberOfLines={1}
            >
              {shareLink}
            </Text>
            {copied ? (
              <View className="flex-row items-center">
                <Check size={16} color="#22c55e" />
                <Text className="text-green-500 text-xs font-medium ml-1">Copied!</Text>
              </View>
            ) : (
              <Copy size={18} color="#71717a" />
            )}
          </Pressable>

          {/* Action Buttons */}
          <View className="flex-row mt-4 gap-3">
            <Pressable
              onPress={handleCopyLink}
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 py-3 rounded-xl flex-row items-center justify-center active:opacity-70"
            >
              <Copy size={18} color="#71717a" />
              <Text className="text-zinc-700 dark:text-zinc-300 font-semibold ml-2">
                Copy
              </Text>
            </Pressable>

            <Pressable
              onPress={handleShare}
              className="flex-1 bg-sky-500 py-3 rounded-xl flex-row items-center justify-center active:opacity-70"
            >
              <Share2 size={18} color="white" />
              <Text className="text-white font-semibold ml-2">
                Share
              </Text>
            </Pressable>
          </View>

          {/* Early Access Badge */}
          <View className="flex-row items-center justify-center mt-5 bg-amber-500/10 py-2.5 px-4 rounded-full">
            <Gift size={16} color="#f59e0b" />
            <Text className="text-amber-600 dark:text-amber-400 text-sm font-medium ml-2">
              Help us reach 100 early users!
            </Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
