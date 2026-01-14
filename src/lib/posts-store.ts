import { create } from 'zustand';
import { Post, PostCategory } from './types';
import { posts as initialPosts, currentUser } from './mock-data';

interface PostsState {
  posts: Post[];
  addPost: (content: string, category: PostCategory, options?: {
    device?: string;
    diagnosis?: string;
    procedure?: string;
    images?: string[];
  }) => void;
  likePost: (postId: string) => void;
  repostPost: (postId: string) => void;
  bookmarkPost: (postId: string) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: initialPosts,

  addPost: (content, category, options) => {
    const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
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
}));
