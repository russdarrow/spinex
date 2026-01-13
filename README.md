# SpineX - Social Network for Spine Surgeons

A Twitter/X-style social media app designed for spine surgeons to discuss patient cases, share experiences with medical devices, and connect with colleagues.

## Features

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
