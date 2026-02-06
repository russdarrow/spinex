import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
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
  ShieldCheck,
  AlertCircle,
  Search,
  BadgeCheck,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyNPI, searchNPI, NPIResult } from '@/lib/npi-lookup';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ONBOARDING_KEY = '@spinex_onboarding_complete';
const USER_PROFILE_KEY = '@spinex_user_profile';

type OnboardingStep = 'slides' | 'verification' | 'profile';

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
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('slides');

  // Verification state
  const [npiNumber, setNpiNumber] = useState('');
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verifiedPhysician, setVerifiedPhysician] = useState<NPIResult | null>(null);
  const [searchResults, setSearchResults] = useState<NPIResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Profile state
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const slideAnim = useSharedValue(0);

  const goToSlide = (index: number) => {
    slideAnim.value = withSpring(index, { damping: 20, stiffness: 90 });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      setCurrentStep('verification');
    }
  };

  const handleSkip = () => {
    setCurrentStep('verification');
  };

  const handleVerifyNPI = async () => {
    if (!npiNumber.trim()) {
      setVerificationError('Please enter your NPI number');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');
    setVerifiedPhysician(null);

    try {
      const result = await verifyNPI(npiNumber.trim());

      if (result) {
        setVerifiedPhysician(result);
        setName(result.name);
        setTimeout(() => {
          setCurrentStep('profile');
        }, 1500);
      } else {
        setVerificationError('NPI not found. Please check the number or search by name.');
      }
    } catch (error) {
      setVerificationError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchLastName.trim()) {
      setVerificationError('Please enter your last name to search');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');
    setSearchResults([]);

    try {
      const results = await searchNPI({
        firstName: searchFirstName.trim() || undefined,
        lastName: searchLastName.trim(),
      });

      if (results.length > 0) {
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setVerificationError('No physicians found. Try different search criteria.');
      }
    } catch (error) {
      setVerificationError('Search failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const selectPhysician = (physician: NPIResult) => {
    setVerifiedPhysician(physician);
    setNpiNumber(physician.npi);
    setName(physician.name);
    setShowSearchResults(false);
    setTimeout(() => {
      setCurrentStep('profile');
    }, 1000);
  };

  const skipVerification = () => {
    setCurrentStep('profile');
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

      const profile = {
        name,
        institution,
        specialties: selectedSpecialties,
        npi: verifiedPhysician?.npi || null,
        isVerified: !!verifiedPhysician,
        credential: verifiedPhysician?.credential || '',
      };
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');

      console.log('[Onboarding] Saved! Navigating to tabs...');
      router.replace('/(tabs)');
    } catch (error) {
      console.log('[Onboarding] Error saving:', error);
      router.replace('/(tabs)');
    }
  };

  const slidesContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -slideAnim.value * SCREEN_WIDTH }],
  }));

  // VERIFICATION SCREEN
  if (currentStep === 'verification') {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b' }}>
        <LinearGradient
          colors={['#10b981', '#059669', '#047857']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280 }}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <ShieldCheck size={24} color="white" />
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginLeft: 8 }}>
                  Physician Verification
                </Text>
              </View>
              <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
                Verify your credentials
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 8 }}>
                We cross-check national physician databases to ensure a trusted community
              </Text>
            </View>

            {/* Form Card */}
            <View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48, minHeight: 500 }}>
              {/* Verified Success State */}
              {verifiedPhysician ? (
                <View style={{ backgroundColor: '#052e16', borderRadius: 16, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}>
                  <BadgeCheck size={32} color="#22c55e" />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 16 }}>Verified!</Text>
                    <Text style={{ color: '#86efac', fontSize: 14 }}>{verifiedPhysician.name}</Text>
                    <Text style={{ color: '#86efac', fontSize: 12, marginTop: 2 }}>{verifiedPhysician.specialty}</Text>
                  </View>
                </View>
              ) : null}

              {/* Search Results */}
              {showSearchResults && searchResults.length > 0 ? (
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ color: 'white', fontWeight: '600', marginBottom: 12 }}>
                    Select your profile:
                  </Text>
                  {searchResults.map((physician) => (
                    <Pressable
                      key={physician.npi}
                      onPress={() => selectPhysician(physician)}
                      style={{ backgroundColor: '#27272a', borderRadius: 12, padding: 16, marginBottom: 8 }}
                    >
                      <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{physician.name}</Text>
                      <Text style={{ color: '#a1a1aa', fontSize: 14, marginTop: 2 }}>{physician.specialty}</Text>
                      <Text style={{ color: '#71717a', fontSize: 12, marginTop: 4 }}>
                        NPI: {physician.npi} - {physician.city}, {physician.state}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}

              {/* Error Message */}
              {verificationError && !verifiedPhysician ? (
                <View style={{ backgroundColor: '#450a0a', borderRadius: 12, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <AlertCircle size={20} color="#ef4444" />
                  <Text style={{ color: '#fca5a5', marginLeft: 8, flex: 1 }}>{verificationError}</Text>
                </View>
              ) : null}

              {!verifiedPhysician && !showSearchResults ? (
                <>
                  {/* NPI Input */}
                  <View style={{ marginBottom: 24 }}>
                    <Text style={{ color: 'white', fontWeight: '600', marginBottom: 8 }}>
                      NPI Number
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TextInput
                        value={npiNumber}
                        onChangeText={setNpiNumber}
                        placeholder="Enter your 10-digit NPI"
                        placeholderTextColor="#71717a"
                        keyboardType="number-pad"
                        maxLength={10}
                        style={{ flex: 1, backgroundColor: '#27272a', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, color: 'white', fontSize: 16, marginRight: 8 }}
                      />
                      <Pressable
                        onPress={handleVerifyNPI}
                        disabled={isVerifying}
                        style={{ backgroundColor: '#10b981', paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                      >
                        {isVerifying ? (
                          <ActivityIndicator color="white" size="small" />
                        ) : (
                          <Text style={{ color: 'white', fontWeight: 'bold' }}>Verify</Text>
                        )}
                      </Pressable>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#3f3f46' }} />
                    <Text style={{ color: '#71717a', marginHorizontal: 16, fontSize: 14 }}>or search by name</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#3f3f46' }} />
                  </View>

                  {/* Name Search */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: 'white', fontWeight: '600', marginBottom: 8 }}>First Name</Text>
                    <TextInput
                      value={searchFirstName}
                      onChangeText={setSearchFirstName}
                      placeholder="John"
                      placeholderTextColor="#71717a"
                      style={{ backgroundColor: '#27272a', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, color: 'white', fontSize: 16 }}
                    />
                  </View>

                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: 'white', fontWeight: '600', marginBottom: 8 }}>Last Name</Text>
                    <TextInput
                      value={searchLastName}
                      onChangeText={setSearchLastName}
                      placeholder="Smith"
                      placeholderTextColor="#71717a"
                      style={{ backgroundColor: '#27272a', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, color: 'white', fontSize: 16 }}
                    />
                  </View>

                  <Pressable
                    onPress={handleSearchByName}
                    disabled={isVerifying}
                    style={{ backgroundColor: '#3f3f46', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}
                  >
                    {isVerifying ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Search size={18} color="white" />
                        <Text style={{ color: 'white', fontWeight: '600', marginLeft: 8 }}>Search Database</Text>
                      </>
                    )}
                  </Pressable>
                </>
              ) : null}

              {/* Skip Verification */}
              <Pressable
                onPress={skipVerification}
                style={{ paddingVertical: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#71717a', fontWeight: '500' }}>Skip verification for now</Text>
                <Text style={{ color: '#52525b', fontSize: 12, marginTop: 4 }}>You can verify later in settings</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // PROFILE SETUP SCREEN
  if (currentStep === 'profile') {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b' }}>
        <LinearGradient
          colors={['#0ea5e9', '#0284c7', '#0369a1']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280 }}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Sparkles size={24} color="white" />
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginLeft: 8 }}>Almost there!</Text>
              </View>
              <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
                Set up your profile
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 8 }}>
                Help colleagues find and connect with you
              </Text>
            </View>

            {/* Form Card */}
            <View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48, minHeight: 500 }}>
              {/* Verified Badge */}
              {verifiedPhysician ? (
                <View style={{ backgroundColor: '#052e16', borderRadius: 12, padding: 12, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                  <BadgeCheck size={20} color="#22c55e" />
                  <Text style={{ color: '#22c55e', fontWeight: '600', marginLeft: 8 }}>Verified Physician</Text>
                </View>
              ) : null}

              {/* Name Input */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: 'white', fontWeight: '600', marginBottom: 8 }}>Full Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Dr. Jane Smith"
                  placeholderTextColor="#71717a"
                  style={{ backgroundColor: '#27272a', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, color: 'white', fontSize: 16 }}
                />
              </View>

              {/* Institution Input */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: 'white', fontWeight: '600', marginBottom: 8 }}>Institution</Text>
                <TextInput
                  value={institution}
                  onChangeText={setInstitution}
                  placeholder="Mayo Clinic, Stanford Medicine..."
                  placeholderTextColor="#71717a"
                  style={{ backgroundColor: '#27272a', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, color: 'white', fontSize: 16 }}
                />
              </View>

              {/* Specialties */}
              <View style={{ marginBottom: 28 }}>
                <Text style={{ color: 'white', fontWeight: '600', marginBottom: 12 }}>
                  Specialties (select all that apply)
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {specialties.map(specialty => {
                    const isSelected = selectedSpecialties.includes(specialty);
                    return (
                      <Pressable
                        key={specialty}
                        onPress={() => toggleSpecialty(specialty)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 20,
                          marginRight: 8,
                          marginBottom: 8,
                          backgroundColor: isSelected ? '#0ea5e9' : 'transparent',
                          borderWidth: 1,
                          borderColor: isSelected ? '#0ea5e9' : '#3f3f46',
                        }}
                      >
                        {isSelected ? <Check size={14} color="white" /> : null}
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: isSelected ? 'white' : '#a1a1aa',
                            marginLeft: isSelected ? 4 : 0,
                          }}
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
                style={{
                  backgroundColor: '#0ea5e9',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  shadowColor: '#0ea5e9',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Get Started</Text>
              </Pressable>

              {/* Skip for now */}
              <Pressable
                onPress={completeOnboarding}
                style={{ paddingVertical: 16, alignItems: 'center', marginTop: 8 }}
              >
                <Text style={{ color: '#71717a', fontWeight: '500' }}>Skip for now</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // INTRO SLIDES
  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
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
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
                <View
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 64,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 32,
                  }}
                >
                  {slide.icon}
                </View>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 30,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: 16,
                  }}
                >
                  {slide.title}
                </Text>
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
              <Pressable key={index} onPress={() => goToSlide(index)} style={{ padding: 4 }}>
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
