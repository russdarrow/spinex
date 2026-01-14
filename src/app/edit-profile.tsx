import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@spinex_user_profile';

const specialtiesList = [
  'Minimally Invasive Surgery',
  'Adult Deformity',
  'Pediatric Spine',
  'Cervical Spine',
  'Spine Trauma',
  'Motion Preservation',
  'Complex Revision',
  'Tumor Surgery',
];

interface UserProfile {
  name: string;
  institution: string;
  specialties: string[];
  npi: string | null;
  isVerified: boolean;
  credential: string;
  bio?: string;
  website?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [npi, setNpi] = useState<string | null>(null);
  const [credential, setCredential] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
        if (data) {
          const profile: UserProfile = JSON.parse(data);
          setName(profile.name || '');
          setInstitution(profile.institution || '');
          setSelectedSpecialties(profile.specialties || []);
          setIsVerified(profile.isVerified || false);
          setNpi(profile.npi || null);
          setCredential(profile.credential || '');
          setBio(profile.bio || '');
          setWebsite(profile.website || '');
        }
      } catch (e) {
        console.log('Error loading profile:', e);
      }
    }
    loadProfile();
  }, []);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const profile: UserProfile = {
        name,
        institution,
        specialties: selectedSpecialties,
        npi,
        isVerified,
        credential,
        bio,
        website,
      };
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      router.back();
    } catch (e) {
      console.log('Error saving profile:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <Pressable onPress={() => router.back()} className="p-1">
              <X size={24} color="#71717a" />
            </Pressable>
            <Text className="text-lg font-bold text-zinc-900 dark:text-white">
              Edit Profile
            </Text>
            <Pressable
              onPress={handleSave}
              disabled={isSaving || !name.trim()}
              className={`px-4 py-1.5 rounded-full ${
                name.trim() ? 'bg-sky-500' : 'bg-sky-300'
              }`}
            >
              <Text className="text-white font-semibold">
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-4 py-6">
              {/* Name */}
              <View className="mb-5">
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor="#a1a1aa"
                  className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl text-zinc-900 dark:text-white text-base"
                />
              </View>

              {/* Institution */}
              <View className="mb-5">
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Institution
                </Text>
                <TextInput
                  value={institution}
                  onChangeText={setInstitution}
                  placeholder="Hospital or clinic"
                  placeholderTextColor="#a1a1aa"
                  className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl text-zinc-900 dark:text-white text-base"
                />
              </View>

              {/* Bio */}
              <View className="mb-5">
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Bio
                </Text>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#a1a1aa"
                  multiline
                  numberOfLines={3}
                  className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl text-zinc-900 dark:text-white text-base min-h-[100px]"
                  textAlignVertical="top"
                />
              </View>

              {/* Website */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Website
                </Text>
                <TextInput
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="yourwebsite.com"
                  placeholderTextColor="#a1a1aa"
                  autoCapitalize="none"
                  keyboardType="url"
                  className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-xl text-zinc-900 dark:text-white text-base"
                />
              </View>

              {/* Specialties */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                  Specialties
                </Text>
                <View className="flex-row flex-wrap">
                  {specialtiesList.map(specialty => {
                    const isSelected = selectedSpecialties.includes(specialty);
                    return (
                      <Pressable
                        key={specialty}
                        onPress={() => toggleSpecialty(specialty)}
                        className={`flex-row items-center px-3 py-2 rounded-full mr-2 mb-2 ${
                          isSelected
                            ? 'bg-sky-500'
                            : 'bg-zinc-100 dark:bg-zinc-800'
                        }`}
                      >
                        {isSelected && (
                          <Check size={14} color="white" style={{ marginRight: 4 }} />
                        )}
                        <Text
                          className={`text-sm font-medium ${
                            isSelected
                              ? 'text-white'
                              : 'text-zinc-600 dark:text-zinc-300'
                          }`}
                        >
                          {specialty}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Verification Status */}
              {isVerified && npi ? (
                <View className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                  <Text className="text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                    Verified Physician
                  </Text>
                  <Text className="text-emerald-600 dark:text-emerald-300 text-sm">
                    NPI: {npi}
                  </Text>
                </View>
              ) : (
                <View className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl">
                  <Text className="text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    Not Verified
                  </Text>
                  <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Complete verification to get a verified badge
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
