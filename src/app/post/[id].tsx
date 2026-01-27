import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, Share as RNShare, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Repeat2, Share, Bookmark, BadgeCheck, MoreHorizontal, UserPlus, UserMinus, EyeOff, BarChart3, Flag, Trash2, Pin, Sparkles, List, MessageSquare, FileText, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { users, formatTimeAgo, formatNumber, currentUser } from '@/lib/mock-data';
import { usePostsStore } from '@/lib/posts-store';
import { useFollowsStore } from '@/lib/follows-store';
import { MediaGallery } from '@/components/MediaGallery';
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
  const [isPinned, setIsPinned] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const posts = usePostsStore((state) => state.posts);
  const deletePost = usePostsStore((state) => state.deletePost);
  const post = posts.find(p => p.id === id);

  const toggleFollow = useFollowsStore((state) => state.toggleFollow);
  const isFollowing = useFollowsStore((state) => state.isFollowing);
  const isFollowingAuthor = post ? isFollowing(post.author.id) : false;

  // Check if current user is the post author
  const isOwnPost = post?.author.id === 'current' || post?.author.handle === currentUser.handle;

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
    if (post) {
      toggleFollow(post.author.id);
    }
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

  // Owner-only actions
  const handleDeletePost = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setShowOptionsMenu(false);
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePost(post.id);
            router.back();
          },
        },
      ]
    );
  };

  const handlePinPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPinned(!isPinned);
    setShowOptionsMenu(false);
    Alert.alert(isPinned ? 'Unpinned' : 'Pinned', isPinned ? 'Post removed from your profile.' : 'Post pinned to your profile.');
  };

  const handleHighlights = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsHighlighted(!isHighlighted);
    setShowOptionsMenu(false);
    Alert.alert(isHighlighted ? 'Removed from Highlights' : 'Added to Highlights', isHighlighted ? 'Post removed from your highlights.' : 'Post added to your highlights.');
  };

  const handleAddToList = () => {
    setShowOptionsMenu(false);
    Alert.alert('Add to List', 'Choose a list', [
      { text: 'Interesting Cases', onPress: () => Alert.alert('Added', 'Post added to "Interesting Cases"') },
      { text: 'Device Reviews', onPress: () => Alert.alert('Added', 'Post added to "Device Reviews"') },
      { text: 'Research Papers', onPress: () => Alert.alert('Added', 'Post added to "Research Papers"') },
      { text: 'Create New List', onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon.') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleChangeWhoCanReply = () => {
    setShowOptionsMenu(false);
    Alert.alert('Who can reply?', 'Choose who can reply to this post', [
      { text: 'Everyone', onPress: () => Alert.alert('Updated', 'Everyone can reply to this post.') },
      { text: 'People you follow', onPress: () => Alert.alert('Updated', 'Only people you follow can reply.') },
      { text: 'Verified accounts', onPress: () => Alert.alert('Updated', 'Only verified accounts can reply.') },
      { text: 'Only you', onPress: () => Alert.alert('Updated', 'Only you can reply to this post.') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleViewAnalytics = () => {
    setShowOptionsMenu(false);
    Alert.alert(
      'Post Analytics',
      `Impressions: ${formatNumber(post.views * 3)}\nEngagements: ${formatNumber(likes + reposts + post.replies)}\nDetail expands: ${formatNumber(Math.floor(post.views * 0.4))}\nProfile visits: ${formatNumber(Math.floor(post.views * 0.1))}\nNew followers: ${formatNumber(Math.floor(post.views * 0.02))}`
    );
  };

  const handleRequestCommunityNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowOptionsMenu(false);
    Alert.alert(
      'Request Community Note',
      'Community Notes add helpful context to posts. Your request has been submitted for review by contributors.',
      [{ text: 'OK' }]
    );
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
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text className="font-semibold text-[15px] text-zinc-900 dark:text-white">
                  {post.author.name}
                </Text>
                {post.author.isVerified ? (
                  <BadgeCheck size={16} color="#0ea5e9" fill="#0ea5e9" style={{ marginLeft: 4 }} />
                ) : null}
              </View>
              <Text className="text-[14px] text-zinc-500 dark:text-zinc-400">@{post.author.handle}</Text>
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
                <ScrollView className="px-4 pb-8" style={{ maxHeight: 500 }}>
                  {/* Owner-only options */}
                  {isOwnPost ? (
                    <>
                      {/* Delete */}
                      <Pressable
                        onPress={handleDeletePost}
                        className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <Trash2 size={22} color="#ef4444" />
                        <Text className="flex-1 ml-4 text-base text-red-500">
                          Delete post
                        </Text>
                      </Pressable>

                      {/* Pin to profile */}
                      <Pressable
                        onPress={handlePinPost}
                        className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <Pin size={22} color="#71717a" />
                        <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                          {isPinned ? 'Unpin from profile' : 'Pin to your profile'}
                        </Text>
                      </Pressable>

                      {/* Highlights */}
                      <Pressable
                        onPress={handleHighlights}
                        className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <Sparkles size={22} color="#71717a" />
                        <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                          {isHighlighted ? 'Remove from Highlights' : 'Add to Highlights'}
                        </Text>
                      </Pressable>

                      {/* Change who can reply */}
                      <Pressable
                        onPress={handleChangeWhoCanReply}
                        className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <MessageSquare size={22} color="#71717a" />
                        <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                          Change who can reply
                        </Text>
                      </Pressable>

                      {/* View Analytics */}
                      <Pressable
                        onPress={handleViewAnalytics}
                        className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <BarChart3 size={22} color="#71717a" />
                        <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                          View post analytics
                        </Text>
                      </Pressable>
                    </>
                  ) : (
                    <>
                      {/* Follow - only show for other users' posts */}
                      <Pressable
                        onPress={handleFollow}
                        className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                      >
                        {isFollowingAuthor ? (
                          <UserMinus size={22} color="#71717a" />
                        ) : (
                          <UserPlus size={22} color="#71717a" />
                        )}
                        <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                          {isFollowingAuthor ? 'Unfollow' : 'Follow'} @{post.author.handle}
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
                    </>
                  )}

                  {/* Common options for all posts */}
                  {/* Add to List */}
                  <Pressable
                    onPress={handleAddToList}
                    className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <List size={22} color="#71717a" />
                    <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                      Add/remove from Lists
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

                  {/* Request Community Note - only for others' posts */}
                  {!isOwnPost ? (
                    <Pressable
                      onPress={handleRequestCommunityNote}
                      className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                    >
                      <Users size={22} color="#71717a" />
                      <Text className="flex-1 ml-4 text-base text-zinc-900 dark:text-white">
                        Request Community Note
                      </Text>
                    </Pressable>
                  ) : null}

                  {/* Report - only for others' posts */}
                  {!isOwnPost ? (
                    <Pressable
                      onPress={handleReport}
                      className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                    >
                      <Flag size={22} color="#ef4444" />
                      <Text className="flex-1 ml-4 text-base text-red-500">
                        Report post
                      </Text>
                    </Pressable>
                  ) : null}

                  {/* Cancel */}
                  <Pressable
                    onPress={() => setShowOptionsMenu(false)}
                    className="flex-row items-center justify-center py-4 mt-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
                  >
                    <Text className="text-base font-semibold text-zinc-900 dark:text-white">
                      Cancel
                    </Text>
                  </Pressable>
                </ScrollView>
              </Pressable>
            </Pressable>
          </Modal>

          {/* Content */}
          <Text className="text-[15px] text-zinc-900 dark:text-white mt-4 leading-[22px]">
            {post.content}
          </Text>

          {/* Media Gallery */}
          <MediaGallery post={post} isDetailView />

          {/* Timestamp */}
          <View className="flex-row items-center mt-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-[14px] text-zinc-500 dark:text-zinc-400">
              {post.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </Text>
            <Text className="text-[14px] text-zinc-400 mx-1">-</Text>
            <Text className="text-[14px] text-zinc-500 dark:text-zinc-400">
              {post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row py-3 border-b border-zinc-100 dark:border-zinc-800">
            <Pressable className="flex-row mr-5">
              <Text className="text-[15px] font-bold text-zinc-900 dark:text-white">{formatNumber(reposts)}</Text>
              <Text className="text-[15px] text-zinc-500 dark:text-zinc-400 ml-1">Reposts</Text>
            </Pressable>
            <Pressable className="flex-row mr-5">
              <Text className="text-[15px] font-bold text-zinc-900 dark:text-white">{formatNumber(likes)}</Text>
              <Text className="text-[15px] text-zinc-500 dark:text-zinc-400 ml-1">Likes</Text>
            </Pressable>
            <Pressable className="flex-row">
              <Text className="text-[15px] font-bold text-zinc-900 dark:text-white">{formatNumber(post.views)}</Text>
              <Text className="text-[15px] text-zinc-500 dark:text-zinc-400 ml-1">Views</Text>
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
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center flex-wrap">
                    <Text className="font-semibold text-[15px] text-zinc-900 dark:text-white">
                      {reply.author.name}
                    </Text>
                    {reply.author.isVerified ? (
                      <BadgeCheck size={14} color="#0ea5e9" fill="#0ea5e9" style={{ marginLeft: 4 }} />
                    ) : null}
                    <Text className="text-[14px] text-zinc-500 dark:text-zinc-400 ml-1">
                      @{reply.author.handle}
                    </Text>
                    <Text className="text-[14px] text-zinc-400 mx-1">-</Text>
                    <Text className="text-[14px] text-zinc-500 dark:text-zinc-400">
                      {formatTimeAgo(reply.createdAt)}
                    </Text>
                  </View>
                  <Text className="text-[15px] text-zinc-900 dark:text-white mt-1 leading-[22px]">
                    {reply.content}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Heart size={16} color="#71717a" />
                    <Text className="text-[13px] text-zinc-500 dark:text-zinc-400 ml-1">
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
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
        <TextInput
          value={replyText}
          onChangeText={setReplyText}
          placeholder="Post your reply"
          placeholderTextColor="#71717a"
          className="flex-1 ml-3 text-[15px] text-zinc-900 dark:text-white"
        />
        <Pressable
          className={`px-4 py-1.5 rounded-full ${replyText.trim() ? 'bg-sky-500' : 'bg-sky-300'}`}
          disabled={!replyText.trim()}
        >
          <Text className="text-[15px] text-white font-semibold">Reply</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
