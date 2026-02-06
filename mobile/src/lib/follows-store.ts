import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FOLLOWS_STORAGE_KEY = '@spinex_follows';

interface FollowsState {
  followingIds: string[];
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  toggleFollow: (userId: string) => void;
}

export const useFollowsStore = create<FollowsState>()(
  persist(
    (set, get) => ({
      // Default following: users 1 and 3 from mock data
      followingIds: ['1', '3'],

      followUser: (userId) => {
        set((state) => ({
          followingIds: state.followingIds.includes(userId)
            ? state.followingIds
            : [...state.followingIds, userId],
        }));
      },

      unfollowUser: (userId) => {
        set((state) => ({
          followingIds: state.followingIds.filter((id) => id !== userId),
        }));
      },

      isFollowing: (userId) => {
        return get().followingIds.includes(userId);
      },

      toggleFollow: (userId) => {
        const { followingIds } = get();
        if (followingIds.includes(userId)) {
          set({ followingIds: followingIds.filter((id) => id !== userId) });
        } else {
          set({ followingIds: [...followingIds, userId] });
        }
      },
    }),
    {
      name: FOLLOWS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
