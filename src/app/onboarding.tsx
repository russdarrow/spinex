import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Stethoscope,
  Users,
  Cpu,
  MessageCircle,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ONBOARDING_KEY = '@spinex_onboarding_complete';

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to SpineX',
    subtitle: 'The professional network built exclusively for spine surgeons',
    icon: <Stethoscope size={64} color="white" />,
    gradient: ['#0ea5e9', '#0284c7'],
  },
  {
    id: '2',
    title: 'Share Cases',
    subtitle: 'Discuss complex cases, share outcomes, and learn from peers worldwide',
    icon: <MessageCircle size={64} color="white" />,
    gradient: ['#10b981', '#059669'],
  },
  {
    id: '3',
    title: 'Device Insights',
    subtitle: 'Real experiences with surgical devices from surgeons like you',
    icon: <Cpu size={64} color="white" />,
    gradient: ['#8b5cf6', '#7c3aed'],
  },
  {
    id: '4',
    title: 'Connect & Grow',
    subtitle: 'Build your network with verified spine surgery professionals',
    icon: <Users size={64} color="white" />,
    gradient: ['#f59e0b', '#d97706'],
  },
];

const specialties = [
  'Minimally Invasive Surgery',
  'Adult Deformity',
  'Pediatric Spine',
  'Cervical Spine',
  'Spine Trauma',
  'Motion Preservation',
  'Complex Revision',
  'Tumor Surgery',
];

function DotIndicator({ index, slideAnim }: { index: number; slideAnim: Animated.SharedValue<number> }) {
  const dotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      slideAnim.value,
      [index - 1, index, index + 1],
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          slideAnim.value,
          [index - 1, index, index + 1],
          [1, 1.3, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
          backgroundColor: 'white',
        },
        dotStyle,
      ]}
    />
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const slideAnim = useSharedValue(0);
  const profileAnim = useSharedValue(0);

  const goToSlide = (index: number) => {
    slideAnim.value = withSpring(index, { damping: 20, stiffness: 90 });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      profileAnim.value = withTiming(1, { duration: 400 });
      setShowProfileSetup(true);
    }
  };

  const handleSkip = () => {
    profileAnim.value = withTiming(1, { duration: 400 });
    setShowProfileSetup(true);
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const completeOnboarding = async () => {
    try {
      console.log('[Onboarding] Saving completion...');
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      console.log('[Onboarding] Saved! Navigating to tabs...');
      router.replace('/(tabs)');
    } catch (error) {
      console.log('[Onboarding] Error saving:', error);
      router.replace('/(tabs)');
    }
  };

  const profileStyle = useAnimatedStyle(() => ({
    opacity: profileAnim.value,
    transform: [
      { translateY: interpolate(profileAnim.value, [0, 1], [50, 0]) },
    ],
  }));

  const slidesStyle = useAnimatedStyle(() => ({
    opacity: interpolate(profileAnim.value, [0, 1], [1, 0]),
    transform: [
      { translateY: interpolate(profileAnim.value, [0, 1], [0, -50]) },
    ],
  }));

  const slidesContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -slideAnim.value * SCREEN_WIDTH },
    ],
  }));

  if (showProfileSetup) {
    return (
      <View className="flex-1 bg-zinc-950">
        <LinearGradient
          colors={['#0ea5e9', '#0284c7', '#0369a1']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300 }}
        />
        <SafeAreaView className="flex-1">
          <Animated.View style={[{ flex: 1 }, profileStyle]}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="px-6 pt-8 pb-12">
                <View className="flex-row items-center mb-2">
                  <Sparkles size={24} color="white" />
                  <Text className="text-white text-lg font-medium ml-2">Almost there!</Text>
                </View>
                <Text className="text-white text-3xl font-bold">
                  Set up your profile
                </Text>
                <Text className="text-white/70 text-base mt-2">
                  Help colleagues find and connect with you
                </Text>
              </View>

              {/* Form Card */}
              <View className="bg-white dark:bg-zinc-900 rounded-t-[32px] flex-1 px-6 pt-8 pb-12 min-h-[600px]">
                {/* Name Input */}
                <View className="mb-6">
                  <Text className="text-zinc-900 dark:text-white font-semibold mb-2">
                    Full Name
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Dr. Jane Smith"
                    placeholderTextColor="#a1a1aa"
                    className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3.5 rounded-xl text-zinc-900 dark:text-white text-base"
                  />
                </View>

                {/* Institution Input */}
                <View className="mb-6">
                  <Text className="text-zinc-900 dark:text-white font-semibold mb-2">
                    Institution
                  </Text>
                  <TextInput
                    value={institution}
                    onChangeText={setInstitution}
                    placeholder="Mayo Clinic, Stanford Medicine..."
                    placeholderTextColor="#a1a1aa"
                    className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3.5 rounded-xl text-zinc-900 dark:text-white text-base"
                  />
                </View>

                {/* Specialties */}
                <View className="mb-8">
                  <Text className="text-zinc-900 dark:text-white font-semibold mb-3">
                    Specialties (select all that apply)
                  </Text>
                  <View className="flex-row flex-wrap">
                    {specialties.map(specialty => {
                      const isSelected = selectedSpecialties.includes(specialty);
                      return (
                        <Pressable
                          key={specialty}
                          onPress={() => toggleSpecialty(specialty)}
                          className={`flex-row items-center px-3.5 py-2 rounded-full mr-2 mb-2 border ${
                            isSelected
                              ? 'bg-sky-500 border-sky-500'
                              : 'bg-transparent border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          {isSelected && <Check size={14} color="white" />}
                          <Text
                            className={`text-sm font-medium ${
                              isSelected ? 'text-white ml-1' : 'text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {specialty}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Continue Button */}
                <Pressable
                  onPress={completeOnboarding}
                  className="bg-sky-500 py-4 rounded-2xl items-center active:bg-sky-600"
                  style={{
                    shadowColor: '#0ea5e9',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Text className="text-white font-bold text-lg">Get Started</Text>
                </Pressable>

                {/* Skip for now */}
                <Pressable
                  onPress={completeOnboarding}
                  className="py-4 items-center mt-2"
                >
                  <Text className="text-zinc-500 font-medium">Skip for now</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <Animated.View style={[{ flex: 1 }, slidesStyle]}>
        {/* Slides */}
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              width: SCREEN_WIDTH * slides.length,
              height: SCREEN_HEIGHT,
            },
            slidesContainerStyle,
          ]}
        >
          {slides.map((slide) => (
            <LinearGradient
              key={slide.id}
              colors={slide.gradient as [string, string]}
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
              }}
            >
              <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
                  {/* Icon Container */}
                  <View
                    style={{
                      width: 128,
                      height: 128,
                      borderRadius: 64,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 32
                    }}
                  >
                    {slide.icon}
                  </View>

                  {/* Title */}
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 30,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: 16
                    }}
                  >
                    {slide.title}
                  </Text>

                  {/* Subtitle */}
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: 18,
                      textAlign: 'center',
                      lineHeight: 28,
                      paddingHorizontal: 16,
                    }}
                  >
                    {slide.subtitle}
                  </Text>
                </View>
              </SafeAreaView>
            </LinearGradient>
          ))}
        </Animated.View>

        {/* Bottom Controls */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 48, paddingHorizontal: 24 }}>
          <SafeAreaView edges={['bottom']}>
            {/* Dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
              {slides.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => goToSlide(index)}
                  style={{ padding: 4 }}
                >
                  <DotIndicator index={index} slideAnim={slideAnim} />
                </Pressable>
              ))}
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable onPress={handleSkip} style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500', fontSize: 16 }}>Skip</Text>
              </Pressable>

              <Pressable
                onPress={handleNext}
                style={{
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  borderRadius: 9999,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text style={{ color: '#18181b', fontWeight: 'bold', fontSize: 16, marginRight: 4 }}>
                  {currentIndex === slides.length - 1 ? 'Continue' : 'Next'}
                </Text>
                <ChevronRight size={20} color="#18181b" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Animated.View>
    </View>
  );
}

export async function checkOnboardingComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}
