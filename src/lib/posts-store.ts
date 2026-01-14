import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Post, PostCategory, User } from './types';
import { posts as initialPosts, currentUser } from './mock-data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@spinex_user_profile';
const POSTS_STORAGE_KEY = '@spinex_posts';

interface UserProfile {
  name: string;
  institution: string;
  specialties: string[];
  npi: string | null;
  isVerified: boolean;
  credential: string;
  bio?: string;
  website?: string;
  avatar?: string;
  handle?: string;
}

interface PostsState {
  posts: Post[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addPost: (content: string, category: PostCategory, options?: {
    device?: string;
    diagnosis?: string;
    procedure?: string;
    images?: string[];
  }) => Promise<void>;
  likePost: (postId: string) => void;
  repostPost: (postId: string) => void;
  bookmarkPost: (postId: string) => void;
  deletePost: (postId: string) => void;
}

async function getCurrentUserProfile(): Promise<User> {
  try {
    const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (data) {
      const profile: UserProfile = JSON.parse(data);
      return {
        ...currentUser,
        name: profile.name || currentUser.name,
        handle: profile.handle || currentUser.handle,
        avatar: profile.avatar || currentUser.avatar,
        bio: profile.bio || currentUser.bio,
        institution: profile.institution || currentUser.institution,
        isVerified: profile.isVerified ?? currentUser.isVerified,
      };
    }
  } catch (e) {
    console.log('Error loading profile for post:', e);
  }
  return currentUser;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addPost: async (content, category, options) => {
        const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
        const author = await getCurrentUserProfile();

        const newPost: Post = {
          id: `post-${Date.now()}`,
          author,
          content,
          category,
          hashtags,
          likes: 0,
          reposts: 0,
          replies: 0,
          views: 0,
          isLiked: false,
          isReposted: false,
          isBookmarked: false,
          createdAt: new Date(),
          ...(options?.device && { deviceMention: options.device }),
          ...(options?.images && { images: options.images }),
          ...((options?.diagnosis || options?.procedure) && {
            caseDetails: {
              diagnosis: options.diagnosis || '',
              procedure: options.procedure || '',
            },
          }),
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
      },

      likePost: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                }
              : post
          ),
        }));
      },

      repostPost: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isReposted: !post.isReposted,
                  reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1,
                }
              : post
          ),
        }));
      },

      bookmarkPost: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, isBookmarked: !post.isBookmarked }
              : post
          ),
        }));
      },

      deletePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        }));
      },
    }),
    {
      name: POSTS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ posts: state.posts }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as { posts?: Post[] } | undefined;
        if (persisted?.posts) {
          // Convert date strings back to Date objects
          const hydratedPosts = persisted.posts.map(post => ({
            ...post,
            createdAt: new Date(post.createdAt),
          }));
          return {
            ...currentState,
            posts: hydratedPosts,
            _hasHydrated: true,
          };
        }
        return {
          ...currentState,
          _hasHydrated: true,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
