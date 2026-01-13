import { User, Post, Notification, Trend } from './types';

export const currentUser: User = {
  id: 'current',
  name: 'Dr. Sarah Chen',
  handle: 'drsarahchen',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
  bio: 'Fellowship-trained spine surgeon | Minimally invasive specialist | Stanford Medicine',
  specialty: 'Minimally Invasive Spine Surgery',
  institution: 'Stanford Medicine',
  followers: 4523,
  following: 892,
  isVerified: true,
};

export const users: User[] = [
  {
    id: '1',
    name: 'Dr. Michael Torres',
    handle: 'spinedoc_torres',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    bio: 'Orthopedic spine surgeon | Complex deformity correction | Mayo Clinic',
    specialty: 'Adult Spinal Deformity',
    institution: 'Mayo Clinic',
    followers: 12400,
    following: 543,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Dr. Emily Watson',
    handle: 'drwatson_neuro',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
    bio: 'Neurosurgeon | Cervical spine specialist | Johns Hopkins',
    specialty: 'Cervical Spine Surgery',
    institution: 'Johns Hopkins',
    followers: 8932,
    following: 421,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Dr. James Park',
    handle: 'jpark_spine',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face',
    bio: 'Spine surgeon | Research focused | Motion preservation advocate',
    specialty: 'Motion Preservation Surgery',
    institution: 'HSS',
    followers: 6721,
    following: 312,
    isVerified: true,
  },
  {
    id: '4',
    name: 'Dr. Lisa Huang',
    handle: 'lisahuang_md',
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face',
    bio: 'Pediatric spine surgeon | Scoliosis expert | CHOP',
    specialty: 'Pediatric Spine Surgery',
    institution: "Children's Hospital of Philadelphia",
    followers: 5430,
    following: 287,
    isVerified: true,
  },
  {
    id: '5',
    name: 'Dr. Robert Kim',
    handle: 'robkim_ortho',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face',
    bio: 'Spine trauma specialist | Level 1 trauma center',
    specialty: 'Spine Trauma',
    institution: 'UCLA Medical Center',
    followers: 3892,
    following: 456,
    isVerified: false,
  },
];

export const posts: Post[] = [
  {
    id: '1',
    author: users[0],
    content: 'Just completed a complex T10-pelvis fusion with excellent coronal and sagittal balance restoration. The key was meticulous rod contouring and strategic osteotomies. #SpineDeformity #LLIF',
    images: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop'],
    likes: 234,
    reposts: 45,
    replies: 28,
    views: 4521,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hashtags: ['SpineDeformity', 'LLIF'],
  },
  {
    id: '2',
    author: users[1],
    content: 'Reminder: C5 palsy risk is real with posterior cervical surgery. Always decompress C5 foramen and consider prophylactic foraminotomies. Prevention > treatment. #CervicalSpine #PatientSafety',
    likes: 567,
    reposts: 123,
    replies: 89,
    views: 12300,
    isLiked: true,
    isReposted: false,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    hashtags: ['CervicalSpine', 'PatientSafety'],
  },
  {
    id: '3',
    author: users[2],
    content: 'Excited to share our latest paper on 5-year outcomes of cervical disc arthroplasty vs ACDF. TL;DR: Motion preservation matters for adjacent segment disease. Link in bio. #Research #SpineSurgery',
    likes: 892,
    reposts: 234,
    replies: 156,
    views: 23400,
    isLiked: false,
    isReposted: true,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    hashtags: ['Research', 'SpineSurgery'],
  },
  {
    id: '4',
    author: users[3],
    content: 'Beautiful case today: 14yo with 65° thoracic curve corrected to 12° with posterior fusion T4-L1. Family in tears of joy. This is why we do what we do. #Scoliosis #PediatricSpine',
    images: ['https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop'],
    likes: 1243,
    reposts: 89,
    replies: 201,
    views: 34500,
    isLiked: true,
    isReposted: false,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    hashtags: ['Scoliosis', 'PediatricSpine'],
  },
  {
    id: '5',
    author: users[4],
    content: 'Quick tip for thoracolumbar burst fractures: Don\'t forget to assess PLC integrity. MRI STIR sequence is your friend. Intact PLC = consider non-op. #SpineTrauma #Tips',
    likes: 445,
    reposts: 167,
    replies: 72,
    views: 8900,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    hashtags: ['SpineTrauma', 'Tips'],
  },
  {
    id: '6',
    author: users[0],
    content: 'Anyone else seeing an uptick in failed MIS TLIF cases needing revision? Proper patient selection is key. Not every patient is a MIS candidate. #MIS #SpineSurgery',
    likes: 378,
    reposts: 56,
    replies: 134,
    views: 7800,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    hashtags: ['MIS', 'SpineSurgery'],
  },
  {
    id: '7',
    author: users[1],
    content: 'NASS 2024 was incredible! Great discussions on AI in spine surgery. The future is here. Who else attended the robotics symposium? #NASS2024 #SpineConference',
    likes: 623,
    reposts: 45,
    replies: 98,
    views: 11200,
    isLiked: true,
    isReposted: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    hashtags: ['NASS2024', 'SpineConference'],
  },
];

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: users[0],
    post: posts[1],
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
  },
  {
    id: '2',
    type: 'follow',
    user: users[2],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '3',
    type: 'repost',
    user: users[1],
    post: posts[3],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '4',
    type: 'reply',
    user: users[3],
    post: posts[0],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '5',
    type: 'mention',
    user: users[4],
    post: posts[2],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '6',
    type: 'like',
    user: users[1],
    post: posts[4],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
  },
];

export const trends: Trend[] = [
  { id: '1', hashtag: 'SpineDeformity', posts: 2340, category: 'Surgery' },
  { id: '2', hashtag: 'NASS2024', posts: 8923, category: 'Conference' },
  { id: '3', hashtag: 'MIS', posts: 4521, category: 'Technique' },
  { id: '4', hashtag: 'CervicalSpine', posts: 3892, category: 'Anatomy' },
  { id: '5', hashtag: 'SpineResearch', posts: 2100, category: 'Research' },
  { id: '6', hashtag: 'Robotics', posts: 1890, category: 'Technology' },
];

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
