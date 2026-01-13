import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Repeat2, UserPlus, MessageCircle, AtSign, BadgeCheck } from 'lucide-react-native';
import { notifications as initialNotifications, formatTimeAgo } from '@/lib/mock-data';
import { Notification } from '@/lib/types';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'mentions'>('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart size={18} color="#ef4444" fill="#ef4444" />;
      case 'repost':
        return <Repeat2 size={18} color="#22c55e" />;
      case 'follow':
        return <UserPlus size={18} color="#0ea5e9" />;
      case 'reply':
        return <MessageCircle size={18} color="#0ea5e9" />;
      case 'mention':
        return <AtSign size={18} color="#8b5cf6" />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'repost':
        return 'reposted your post';
      case 'follow':
        return 'followed you';
      case 'reply':
        return 'replied to your post';
      case 'mention':
        return 'mentioned you';
      default:
        return '';
    }
  };

  const filteredNotifications = activeTab === 'mentions'
    ? notifications.filter(n => n.type === 'mention' || n.type === 'reply')
    : notifications;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Notifications</Text>
        </View>

      {/* Tabs */}
      <View className="flex-row border-b border-zinc-100 dark:border-zinc-800">
        <Pressable
          onPress={() => setActiveTab('all')}
          className={`flex-1 py-3 ${activeTab === 'all' ? 'border-b-2 border-sky-500' : ''}`}
        >
          <Text className={`text-center font-medium ${activeTab === 'all' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
            All
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('mentions')}
          className={`flex-1 py-3 ${activeTab === 'mentions' ? 'border-b-2 border-sky-500' : ''}`}
        >
          <Text className={`text-center font-medium ${activeTab === 'mentions' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
            Mentions
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.map(notification => (
          <Pressable
            key={notification.id}
            className={`flex-row px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 active:bg-zinc-50 dark:active:bg-zinc-800/50 ${
              !notification.isRead ? 'bg-sky-50/50 dark:bg-sky-900/10' : ''
            }`}
          >
            {/* Icon */}
            <View className="w-8 items-end mt-1">
              {getNotificationIcon(notification.type)}
            </View>

            {/* Content */}
            <View className="flex-1 ml-3">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: notification.user.avatar }}
                  className="w-10 h-10 rounded-full"
                />
              </View>

              <View className="mt-2">
                <View className="flex-row items-center flex-wrap">
                  <Text className="font-semibold text-zinc-900 dark:text-white">
                    {notification.user.name}
                  </Text>
                  {notification.user.isVerified && (
                    <BadgeCheck size={14} color="#0ea5e9" fill="#0ea5e9" className="ml-1" />
                  )}
                  <Text className="text-zinc-600 dark:text-zinc-300 ml-1">
                    {getNotificationText(notification)}
                  </Text>
                </View>

                <Text className="text-zinc-400 dark:text-zinc-500 text-sm mt-0.5">
                  {formatTimeAgo(notification.createdAt)}
                </Text>

                {notification.post && (
                  <View className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <Text className="text-zinc-600 dark:text-zinc-300 text-sm" numberOfLines={2}>
                      {notification.post.content}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Unread indicator */}
            {!notification.isRead && (
              <View className="w-2 h-2 bg-sky-500 rounded-full mt-2" />
            )}
          </Pressable>
        ))}

        {filteredNotifications.length === 0 && (
          <View className="py-12 items-center">
            <Text className="text-zinc-500 dark:text-zinc-400 text-center">
              No notifications yet
            </Text>
          </View>
        )}
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}
