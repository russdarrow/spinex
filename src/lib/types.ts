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

export type PostCategory = 'general' | 'case' | 'device' | 'research' | 'question';

export interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  aspectRatio?: number; // width / height for proper display
  thumbnailUri?: string; // for video thumbnails
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  media?: MediaItem[]; // New: supports both images and videos with aspect ratios
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  hashtags?: string[];
  category: PostCategory;
  deviceMention?: string;
  caseDetails?: {
    diagnosis: string;
    procedure: string;
    outcome?: string;
  };
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

export interface Device {
  id: string;
  name: string;
  manufacturer: string;
  category: 'implant' | 'instrument' | 'navigation' | 'biologics' | 'robotics';
  posts: number;
}
