import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput, Modal, Share as RNShare, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Repeat2, Share, Bookmark, BadgeCheck, MoreHorizontal, UserPlus, EyeOff, BarChart3, Flag, AlertTriangle, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { users, formatTimeAgo, formatNumber, currentUser } from '@/lib/mock-data';
import { usePostsStore } from '@/lib/posts-store';
import * as Haptics from 'expo-haptics';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [reposts, setReposts] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const posts = usePostsStore((state) => state.posts);
  const post = posts.find(p => p.id === id);

  // Initialize state from post data
  React.useEffect(() => {
    if (post && !initialized) {
      setIsLiked(post.isLiked);
      setIsReposted(post.isReposted);
      setIsBookmarked(post.isBookmarked);
      setLikes(post.likes);
      setReposts(post.reposts);
      setInitialized(true);
    }
  }, [post, initialized]);

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black items-center justify-center">
        <Text className="text-zinc-500">Post not found</Text>
      </SafeAreaView>
    );
  }

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRepost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsReposted(!isReposted);
    setReposts(prev => isReposted ? prev - 1 : prev + 1);
  };

  const handleOpenOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowOptionsMenu(true);
  };

  const handleFollow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFollowing(!isFollowing);
    setShowOptionsMenu(false);
  };

  const handleNotInterested = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowOptionsMenu(false);
    Alert.alert('Got it', "You'll see fewer posts like this.");
  };

  const handleViewEngagements = () => {
    setShowOptionsMenu(false);
    Alert.alert('Post Engagements', `${formatNumber(likes)} likes\n${formatNumber(reposts)} reposts\n${formatNumber(post.views)} views\n${post.replies} replies`);
  };

  const handleReport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setShowOptionsMenu(false);
    Alert.alert('Report Post', 'Why are you reporting this post?', [
      { text: 'Spam', onPress: () => Alert.alert('Thanks', 'Your report has been submitted.') },
      { text: 'Misinformation', onPress: () => Alert.alert('Thanks', 'Your report has been submitted.') },
      { text: 'Harassment', onPress: () => Alert.alert('Thanks', 'Your report has been submitted.') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSharePost = async () => {
    setShowOptionsMenu(false);
    try {
      await RNShare.share({
        message: `Check out this post by @${post.author.handle}: "${post.content.substring(0, 100)}..."`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Mock replies
  const mockReplies = [
    {
      id: '1',
      author: users[1],
      content: 'Great case! What was your approach for the osteotomies?',
      likes: 12,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: '2',
      author: users[3],
      content: 'Impressive correction. Did you use navigation?',
      likes: 8,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <Pressable onPress={() => router.back()} className="p-1 mr-4">
          <ArrowLeft size={24} color="#71717a" />
        </Pressable>
        <Text className="text-lg font-bold text-zinc-900 dark:text-white">Post</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Post */}
        <View className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
          {/* Author */}
          <View className="flex-row items-center">
            <Image
              source={{ uri: post.author.avatar }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text className="font-semibold text-zinc-900 dark:text-white">
                  {post.author.name}
                </Text>
                {post.author.isVerified ? (
                  <BadgeCheck size={16} color="#0ea5e9" fill="#0ea5e9" style={{ marginLeft: 4 }} />
                ) : null}
              </View>
              <Text className="text-zinc-500 dark:text-zinc-400">@{post.author.handle}</Text>
            </View>
            <Pressable onPress={handleOpenOptions} className="p-2">
              <MoreHorizontal size={20} color="#71717a" />
            </Pressable>
          </View>

          {/* Options Menu Modal */}
          <Modal
            visible={showOptionsMenu}
            transparent
            animationType="fade"
            onRequestClose={() => setShowOptionsMenu(false)}
          >
            <Pressable
              className="flex-1 bg-black/50 justify-end"
              onPress={() => setShowOptionsMenu(false)}
            >
              <Pressable
                className="bg-white dark:bg-zinc-900 rounded-t-3xl"
                onPress={(e) => e.stopPropagation()}
              >
                <View className="items-center pt-3 pb-2">
                  <View className="w-10 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                </View>

                {/* Menu Options */}
                <View className="px-4 pb-8">
                  {/* Follow */}
                  <Pressable
                    onPress={handleFollow}
                    className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <UserPlus size={22} color="#71717a" />
                    <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                      {isFollowing ? 'Unfollow' : 'Follow'} @{post.author.handle}
                    </Text>
                  </Pressable>

                  {/* Not Interested */}
                  <Pressable
                    onPress={handleNotInterested}
                    className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <EyeOff size={22} color="#71717a" />
                    <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                      Not interested in this post
                    </Text>
                  </Pressable>

                  {/* View Engagements */}
                  <Pressable
                    onPress={handleViewEngagements}
                    className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <BarChart3 size={22} color="#71717a" />
                    <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                      View post engagements
                    </Text>
                  </Pressable>

                  {/* Share */}
                  <Pressable
                    onPress={handleSharePost}
                    className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <Share size={22} color="#71717a" />
                    <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                      Share post
                    </Text>
                  </Pressable>

                  {/* Report */}
                  <Pressable
                    onPress={handleReport}
                    className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <Flag size={22} color="#ef4444" />
                    <Text className="flex-1 ml-4 text-base text-red-500">
                      Report post
                    </Text>
                  </Pressable>

                  {/* Cancel */}
                  <Pressable
                    onPress={() => setShowOptionsMenu(false)}
                    className="flex-row items-center justify-center py-4 mt-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
                  >
                    <Text className="text-base font-semibold text-zinc-900 dark:text-white">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </Modal>

          {/* Content */}
          <Text className="text-lg text-zinc-900 dark:text-white mt-4 leading-6">
            {post.content}
          </Text>

          {/* Images */}
          {post.images && post.images.length > 0 ? (
            <View className="mt-4 rounded-2xl overflow-hidden">
              {post.images.length === 1 ? (
                <Image
                  source={{ uri: post.images[0] }}
                  className="w-full h-64"
                  resizeMode="cover"
                />
              ) : post.images.length === 2 ? (
                <View className="flex-row h-64">
                  <Image
                    source={{ uri: post.images[0] }}
                    className="flex-1 mr-0.5"
                    resizeMode="cover"
                  />
                  <Image
                    source={{ uri: post.images[1] }}
                    className="flex-1 ml-0.5"
                    resizeMode="cover"
                  />
                </View>
              ) : post.images.length === 3 ? (
                <View className="flex-row h-64">
                  <Image
                    source={{ uri: post.images[0] }}
                    className="flex-1 mr-0.5"
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
                <View className="h-64">
                  <View className="flex-row flex-1">
                    <Image
                      source={{ uri: post.images[0] }}
                      className="flex-1 mr-0.5"
                      resizeMode="cover"
                    />
                    <Image
                      source={{ uri: post.images[1] }}
                      className="flex-1 ml-0.5"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-row flex-1 mt-1">
                    <Image
                      source={{ uri: post.images[2] }}
                      className="flex-1 mr-0.5"
                      resizeMode="cover"
                    />
                    <Image
                      source={{ uri: post.images[3] }}
                      className="flex-1 ml-0.5"
                      resizeMode="cover"
                    />
                  </View>
                </View>
              )}
            </View>
          ) : null}

          {/* Timestamp */}
          <View className="flex-row items-center mt-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-zinc-500 dark:text-zinc-400">
              {post.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </Text>
            <Text className="text-zinc-400 mx-1">-</Text>
            <Text className="text-zinc-500 dark:text-zinc-400">
              {post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row py-3 border-b border-zinc-100 dark:border-zinc-800">
            <Pressable className="flex-row mr-5">
              <Text className="font-bold text-zinc-900 dark:text-white">{formatNumber(reposts)}</Text>
              <Text className="text-zinc-500 dark:text-zinc-400 ml-1">Reposts</Text>
            </Pressable>
            <Pressable className="flex-row mr-5">
              <Text className="font-bold text-zinc-900 dark:text-white">{formatNumber(likes)}</Text>
              <Text className="text-zinc-500 dark:text-zinc-400 ml-1">Likes</Text>
            </Pressable>
            <Pressable className="flex-row">
              <Text className="font-bold text-zinc-900 dark:text-white">{formatNumber(post.views)}</Text>
              <Text className="text-zinc-500 dark:text-zinc-400 ml-1">Views</Text>
            </Pressable>
          </View>

          {/* Actions */}
          <View className="flex-row items-center justify-around py-3">
            <Pressable className="p-2">
              <MessageCircle size={22} color="#71717a" />
            </Pressable>
            <Pressable onPress={handleRepost} className="p-2">
              <Repeat2 size={22} color={isReposted ? '#22c55e' : '#71717a'} />
            </Pressable>
            <Pressable onPress={handleLike} className="p-2">
              <Heart size={22} color={isLiked ? '#ef4444' : '#71717a'} fill={isLiked ? '#ef4444' : 'transparent'} />
            </Pressable>
            <Pressable onPress={() => setIsBookmarked(!isBookmarked)} className="p-2">
              <Bookmark size={22} color={isBookmarked ? '#0ea5e9' : '#71717a'} fill={isBookmarked ? '#0ea5e9' : 'transparent'} />
            </Pressable>
            <Pressable className="p-2">
              <Share size={22} color="#71717a" />
            </Pressable>
          </View>
        </View>

        {/* Replies */}
        <View>
          {mockReplies.map(reply => (
            <View key={reply.id} className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <View className="flex-row">
                <Image
                  source={{ uri: reply.author.avatar }}
                  className="w-10 h-10 rounded-full"
                />
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center">
                    <Text className="font-semibold text-zinc-900 dark:text-white">
                      {reply.author.name}
                    </Text>
                    {reply.author.isVerified ? (
                      <BadgeCheck size={14} color="#0ea5e9" fill="#0ea5e9" style={{ marginLeft: 4 }} />
                    ) : null}
                    <Text className="text-zinc-500 dark:text-zinc-400 ml-1">
                      @{reply.author.handle}
                    </Text>
                    <Text className="text-zinc-400 mx-1">-</Text>
                    <Text className="text-zinc-500 dark:text-zinc-400">
                      {formatTimeAgo(reply.createdAt)}
                    </Text>
                  </View>
                  <Text className="text-zinc-900 dark:text-white mt-1">
                    {reply.content}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Heart size={16} color="#71717a" />
                    <Text className="text-zinc-500 dark:text-zinc-400 text-sm ml-1">
                      {reply.likes}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Reply Input */}
      <View className="flex-row items-center px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
        <Image
          source={{ uri: currentUser.avatar }}
          className="w-8 h-8 rounded-full"
        />
        <TextInput
          value={replyText}
          onChangeText={setReplyText}
          placeholder="Post your reply"
          placeholderTextColor="#71717a"
          className="flex-1 ml-3 text-base text-zinc-900 dark:text-white"
        />
        <Pressable
          className={`px-4 py-1.5 rounded-full ${replyText.trim() ? 'bg-sky-500' : 'bg-sky-300'}`}
          disabled={!replyText.trim()}
        >
          <Text className="text-white font-semibold">Reply</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
