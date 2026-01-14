import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, TrendingUp, BadgeCheck, Cpu, Bot, Navigation, Pill, Wrench } from 'lucide-react-native';
import { trends, users, devices, formatNumber } from '@/lib/mock-data';

function getDeviceCategoryIcon(category: string) {
  switch (category) {
    case 'robotics':
      return <Bot size={16} color="#8b5cf6" />;
    case 'navigation':
      return <Navigation size={16} color="#0ea5e9" />;
    case 'implant':
      return <Wrench size={16} color="#f59e0b" />;
    case 'biologics':
      return <Pill size={16} color="#10b981" />;
    default:
      return <Cpu size={16} color="#71717a" />;
  }
}

function getDeviceCategoryColor(category: string) {
  switch (category) {
    case 'robotics':
      return '#8b5cf6';
    case 'navigation':
      return '#0ea5e9';
    case 'implant':
      return '#f59e0b';
    case 'biologics':
      return '#10b981';
    default:
      return '#71717a';
  }
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'surgeons' | 'devices'>('trending');

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDevices = devices.filter(
    device =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Search Bar */}
        <View className="px-4 pt-2 pb-3">
          <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2.5">
            <Search size={20} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search surgeons, devices, topics..."
              placeholderTextColor="#71717a"
              className="flex-1 ml-3 text-base text-zinc-900 dark:text-white"
            />
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-zinc-100 dark:border-zinc-800">
          <Pressable
            onPress={() => setActiveTab('trending')}
            className={`flex-1 py-3 ${activeTab === 'trending' ? 'border-b-2 border-sky-500' : ''}`}
          >
            <Text className={`text-center font-medium ${activeTab === 'trending' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
              Trending
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('devices')}
            className={`flex-1 py-3 ${activeTab === 'devices' ? 'border-b-2 border-sky-500' : ''}`}
          >
            <Text className={`text-center font-medium ${activeTab === 'devices' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
              Devices
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('surgeons')}
            className={`flex-1 py-3 ${activeTab === 'surgeons' ? 'border-b-2 border-sky-500' : ''}`}
          >
            <Text className={`text-center font-medium ${activeTab === 'surgeons' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
              Surgeons
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {activeTab === 'trending' ? (
            <View className="py-2">
              {/* Trending Topics Section */}
              <View className="px-4 py-3">
                <View className="flex-row items-center mb-4">
                  <TrendingUp size={20} color="#0ea5e9" />
                  <Text className="text-lg font-bold text-zinc-900 dark:text-white ml-2">
                    Trending in Spine Surgery
                  </Text>
                </View>

                {trends.map((trend) => (
                  <Pressable
                    key={trend.id}
                    className="py-3 border-b border-zinc-100 dark:border-zinc-800 active:bg-zinc-50 dark:active:bg-zinc-800/50"
                  >
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                      {trend.category} · Trending
                    </Text>
                    <Text className="text-base font-semibold text-zinc-900 dark:text-white mt-0.5">
                      #{trend.hashtag}
                    </Text>
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {formatNumber(trend.posts)} posts
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Hot Topics */}
              <View className="px-4 py-4 mt-2 bg-zinc-50 dark:bg-zinc-900/50">
                <Text className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
                  Hot Topics This Week
                </Text>
                <View className="flex-row flex-wrap">
                  {['Robotics', 'OLIF', 'BMP', 'Navigation', 'Disc Replacement', 'Fusion'].map(topic => (
                    <Pressable
                      key={topic}
                      className="bg-sky-100 dark:bg-sky-900/30 px-3 py-1.5 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-sky-600 dark:text-sky-400 font-medium">
                        {topic}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          ) : null}

          {activeTab === 'devices' ? (
            <View className="py-2">
              <View className="px-4 py-3">
                <View className="flex-row items-center mb-4">
                  <Cpu size={20} color="#8b5cf6" />
                  <Text className="text-lg font-bold text-zinc-900 dark:text-white ml-2">
                    Medical Devices
                  </Text>
                </View>

                {/* Device Categories */}
                <View className="flex-row flex-wrap mb-4">
                  {[
                    { label: 'Robotics', category: 'robotics' },
                    { label: 'Navigation', category: 'navigation' },
                    { label: 'Implants', category: 'implant' },
                    { label: 'Biologics', category: 'biologics' },
                  ].map(cat => (
                    <Pressable
                      key={cat.category}
                      className="flex-row items-center px-3 py-1.5 rounded-full mr-2 mb-2"
                      style={{ backgroundColor: `${getDeviceCategoryColor(cat.category)}15` }}
                    >
                      {getDeviceCategoryIcon(cat.category)}
                      <Text
                        className="ml-1.5 font-medium text-sm"
                        style={{ color: getDeviceCategoryColor(cat.category) }}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Device List */}
                {(searchQuery ? filteredDevices : devices).map(device => (
                  <Pressable
                    key={device.id}
                    className="flex-row items-center py-3 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center"
                      style={{ backgroundColor: `${getDeviceCategoryColor(device.category)}15` }}
                    >
                      {getDeviceCategoryIcon(device.category)}
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="font-semibold text-zinc-900 dark:text-white">
                        {device.name}
                      </Text>
                      <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                        {device.manufacturer}
                      </Text>
                      <Text className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {formatNumber(device.posts)} discussions
                      </Text>
                    </View>
                    <Pressable
                      className="px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: `${getDeviceCategoryColor(device.category)}15` }}
                    >
                      <Text
                        className="font-medium text-sm"
                        style={{ color: getDeviceCategoryColor(device.category) }}
                      >
                        View
                      </Text>
                    </Pressable>
                  </Pressable>
                ))}

                {searchQuery && filteredDevices.length === 0 ? (
                  <View className="py-8 items-center">
                    <Text className="text-zinc-500 dark:text-zinc-400">
                      No devices found for "{searchQuery}"
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          {activeTab === 'surgeons' ? (
            <View className="py-2">
              <View className="px-4 py-3">
                <Text className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
                  {searchQuery ? 'Search Results' : 'Suggested Surgeons'}
                </Text>

                {(searchQuery ? filteredUsers : users).map(user => (
                  <Pressable
                    key={user.id}
                    className="flex-row items-center py-3 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <Image
                      source={{ uri: user.avatar }}
                      className="w-12 h-12 rounded-full"
                    />
                    <View className="flex-1 ml-3">
                      <View className="flex-row items-center">
                        <Text className="font-semibold text-zinc-900 dark:text-white">
                          {user.name}
                        </Text>
                        {user.isVerified ? (
                          <BadgeCheck size={16} color="#0ea5e9" fill="#0ea5e9" className="ml-1" />
                        ) : null}
                      </View>
                      <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                        @{user.handle}
                      </Text>
                      <Text className="text-zinc-600 dark:text-zinc-300 text-sm mt-0.5" numberOfLines={1}>
                        {user.specialty}
                      </Text>
                    </View>
                    <Pressable className="bg-zinc-900 dark:bg-white px-4 py-1.5 rounded-full">
                      <Text className="text-white dark:text-zinc-900 font-semibold text-sm">
                        Follow
                      </Text>
                    </Pressable>
                  </Pressable>
                ))}

                {searchQuery && filteredUsers.length === 0 ? (
                  <View className="py-8 items-center">
                    <Text className="text-zinc-500 dark:text-zinc-400">
                      No surgeons found for "{searchQuery}"
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
