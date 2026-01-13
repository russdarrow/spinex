export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  specialty: string;
  institution: string;
  followers: number;
  following: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  hashtags?: string[];
}

export interface Notification {
  id: string;
  type: 'like' | 'repost' | 'follow' | 'reply' | 'mention';
  user: User;
  post?: Post;
  createdAt: Date;
  isRead: boolean;
}

export interface Trend {
  id: string;
  hashtag: string;
  posts: number;
  category: string;
}
