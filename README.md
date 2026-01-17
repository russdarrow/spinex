# SpineX - Social Network for Spine Surgeons

A Twitter/X-style social media app designed for spine surgeons to discuss patient cases, share experiences with medical devices, and connect with colleagues.

## Features

### Onboarding
- **Welcome Slides**: 4 animated slides introducing SpineX features
- **Profile Setup**: Name, institution, and specialty selection
- **Animated Transitions**: Smooth slide animations with spring physics
- **Persistent State**: Remembers when onboarding is completed

### Core Social Features
- **Home Feed**: Browse posts with "For You" and "Following" tabs
- **Search & Explore**: Find trending topics, medical devices, and surgeons
- **Notifications**: Track likes, reposts, follows, replies, and mentions
- **Profile**: View and manage your profile and activity
- **Compose Posts**: Create posts with category selection

### Spine Surgery Specific
- **Case Discussions**: Share patient cases with diagnosis, procedure, and outcomes
- **Device Reviews**: Discuss experiences with medical devices (robotics, navigation, implants, biologics)
- **Research Sharing**: Share and discuss research findings
- **Q&A**: Ask questions to the spine surgery community

### Medical Device Database
- Mazor X Stealth, ExcelsiusGPS, ROSA Spine (Robotics)
- O-arm, Airo Mobile CT (Navigation)
- PEEK Cages, Titanium Rods, Prestige LP, M6-C Disc (Implants)
- INFUSE Bone Graft (Biologics)

## Post Categories

| Category | Color | Use Case |
|----------|-------|----------|
| Case Discussion | Emerald | Sharing patient cases |
| Device Review | Violet | Medical device experiences |
| Research | Amber | Research findings |
| Question | Blue | Community questions |
| General | Gray | General discussions |

## Screens

- `onboarding.tsx` - Multi-step onboarding with animated slides
- `(tabs)/index.tsx` - Home feed with categorized posts
- `(tabs)/search.tsx` - Search with Trending, Devices, and Surgeons tabs
- `(tabs)/notifications.tsx` - Notification center
- `(tabs)/profile.tsx` - User profile
- `compose.tsx` - Create posts with category/device selection
- `post/[id].tsx` - Post detail view with replies

## Tech Stack

- Expo SDK 53
- React Native 0.76.7
- NativeWind (TailwindCSS)
- Lucide React Native icons
- React Query for state management
- Supabase for authentication and database

## Supabase Integration

### Authentication
The app includes full user authentication via Supabase:
- Sign up with email/password
- Sign in with email/password
- Sign out
- Session persistence

**Files:**
- `src/lib/auth-context.tsx` - Auth provider and `useAuth` hook
- `src/app/login.tsx` - Login screen
- `src/app/signup.tsx` - Sign up screen

**Usage:**
```tsx
import { useAuth } from '@/lib/auth-context';

const { user, signIn, signUp, signOut, isLoading } = useAuth();
```

### Database Hooks
Custom hooks for Supabase database operations with React Query:

**Files:**
- `src/lib/supabase.ts` - Supabase client
- `src/lib/supabase-hooks.ts` - Database hooks

**Available hooks:**
```tsx
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  useSupabaseRealtime,
  useSupabaseRealtimeQuery
} from '@/lib/supabase-hooks';

// Fetch data
const { data, isLoading } = useSupabaseQuery('table_name', {
  select: '*',
  filter: { column: 'user_id', value: userId },
  orderBy: { column: 'created_at', ascending: false },
  limit: 10
});

// Insert data
const insertMutation = useSupabaseInsert('table_name');
insertMutation.mutate({ title: 'New item' });

// Update data
const updateMutation = useSupabaseUpdate('table_name');
updateMutation.mutate({ id: 'item-id', updates: { title: 'Updated' } });

// Delete data
const deleteMutation = useSupabaseDelete('table_name');
deleteMutation.mutate('item-id');

// Real-time updates (auto-refreshes query when data changes)
const { data } = useSupabaseRealtimeQuery('table_name');
```

### Environment Variables
Add these in the ENV tab:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
