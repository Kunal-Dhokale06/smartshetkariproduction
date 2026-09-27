import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions,
  Modal,
  FlatList,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Phone,
  Lock,
  User,
  MapPin,
  Eye,
  EyeOff,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Sprout,
  LandPlot,
  ChevronDown,
  Check,
  Search,
  X,
  PlusCircle,
} from 'lucide-react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { useLanguage } from '../locales/languageContext';
import { useAuth } from '../data/authStore';
import { api } from '../services/api';
import { LanguageSelectorModal } from '../components/LanguageSelectorModal';
import {
  AppLang,
  getStatesList,

  getDistrictsList,
  getTalukasList,
  getVillagesList,
} from '../data/maharashtraLocations';

const { width } = Dimensions.get('window');

/* ────────────────────────────────────────────────────────────────────────────
   Multilingual Searchable Location Picker Modal
──────────────────────────────────────────────────────────────────────────── */
interface LocationOption {
  id: string;
  name: string;
}

interface PickerModalProps {
  visible: boolean;
  title: string;
  options: LocationOption[];
  selectedId: string;
  onSelect: (option: LocationOption) => void;
  onClose: () => void;
  placeholder?: string;
  allowCustom?: boolean;
  onCustomSelect?: (customText: string) => void;
  customLabel?: string;
}

function PickerModal({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
  placeholder = 'Search...',
  allowCustom = false,
  onCustomSelect,
  customLabel = '+ Add other name',
}: PickerModalProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter((o) => o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
  }, [options, search]);

  useEffect(() => {
    if (!visible) setSearch('');
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.sheet}>
          {/* Header */}
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.headerTitle}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={pickerStyles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={pickerStyles.searchBox}>
            <Search size={16} color={colors.secondaryText} />
            <TextInput
              style={pickerStyles.searchInput}
              placeholder={placeholder}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="words"
              placeholderTextColor={colors.mutedText}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} style={{ padding: 4 }}>
                <X size={14} color={colors.secondaryText} />
              </TouchableOpacity>
            )}
          </View>

          {/* Options list */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={pickerStyles.listContent}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedId;
              return (
                <TouchableOpacity
                  style={[pickerStyles.option, isSelected && pickerStyles.optionSelected]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[pickerStyles.optionText, isSelected && pickerStyles.optionTextSelected]}>
                    {item.name}
                  </Text>
                  {isSelected && <Check size={18} color={colors.primaryGreen} />}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={pickerStyles.emptyBox}>
                <Text style={pickerStyles.emptyText}>
                  {search ? `No matches found for "${search}"` : 'No options available'}
                </Text>
                {allowCustom && search.trim().length > 1 && (
                  <TouchableOpacity
                    style={pickerStyles.customOptionBtn}
                    onPress={() => {
                      if (onCustomSelect) {
                        onCustomSelect(search.trim());
                      }
                      onClose();
                    }}
                  >
                    <PlusCircle size={16} color={colors.primaryGreen} />
                    <Text style={pickerStyles.customOptionText}>
                      Use "{search.trim()}" as custom value
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    padding: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    // @ts-ignore
    outline: 'none',
  },
  listContent: {
    paddingBottom: 32,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  optionSelected: {
    backgroundColor: '#F0FDF4',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
  optionTextSelected: {
    color: colors.primaryGreen,
    fontWeight: '600',
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
  },
  customOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    gap: 8,
    marginTop: 6,
  },
  customOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryGreen,
  },
});

/* ────────────────────────────────────────────────────────────────────────────
   Dropdown trigger button
──────────────────────────────────────────────────────────────────────────── */
interface DropdownBtnProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
}

function DropdownBtn({ icon, label, value, placeholder, onPress, disabled }: DropdownBtnProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownBox, disabled && styles.dropdownDisabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <Text style={[styles.dropdownValue, !value && styles.dropdownPlaceholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <ChevronDown size={16} color={disabled ? '#D1D5DB' : colors.secondaryText} />
      </TouchableOpacity>
    </View>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Main Auth Screen
──────────────────────────────────────────────────────────────────────────── */
export default function AuthScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { login, register, isLoading, error } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [langModalVisible, setLangModalVisible] = useState(false);

  // Login Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [landArea, setLandArea] = useState('');

  // Multilingual Cascading IDs
  const [stateId, setStateId] = useState('MH'); // Default to Maharashtra
  const [districtId, setDistrictId] = useState('');
  const [talukaId, setTalukaId] = useState('');
  const [villageId, setVillageId] = useState('');
  const [customVillage, setCustomVillage] = useState('');

  // Dynamic API state for locations
  const [apiDistricts, setApiDistricts] = useState<LocationOption[]>([]);
  const [apiTalukas, setApiTalukas] = useState<LocationOption[]>([]);
  const [apiVillages, setApiVillages] = useState<LocationOption[]>([]);
  const [isLocLoading, setIsLocLoading] = useState(false);

  // Picker modal states
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [districtPickerOpen, setDistrictPickerOpen] = useState(false);
  const [talukaPickerOpen, setTalukaPickerOpen] = useState(false);
  const [villagePickerOpen, setVillagePickerOpen] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const onBackPress = () => {
      if (authMode === 'register') {
        setAuthMode('login');
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [authMode]);

  const curLang: AppLang = (language as AppLang) || 'mr';

  // Static fallback options
  const staticStateOptions = useMemo(() => getStatesList(curLang), [curLang]);
  const staticDistrictOptions = useMemo(() => (stateId ? getDistrictsList(stateId, curLang) : []), [stateId, curLang]);
  const staticTalukaOptions = useMemo(
    () => (stateId && districtId ? getTalukasList(stateId, districtId, curLang) : []),
    [stateId, districtId, curLang]
  );
  const staticVillageOptions = useMemo(
    () => (stateId && districtId && talukaId ? getVillagesList(stateId, districtId, talukaId, curLang) : []),
    [stateId, districtId, talukaId, curLang]
  );

  // Effective options (prefer API results if available, fallback to static)
  const stateOptions = staticStateOptions;
  const districtOptions = apiDistricts.length > 0 ? apiDistricts : staticDistrictOptions;
  const talukaOptions = apiTalukas.length > 0 ? apiTalukas : staticTalukaOptions;
  const villageOptions = apiVillages.length > 0 ? apiVillages : staticVillageOptions;

  // 1. Fetch districts from API when state changes
  useEffect(() => {
    if (stateId === 'MH') {
      api.getDistricts('MH')
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setApiDistricts(
              data.map((d) => ({
                id: d.id,
                name: curLang === 'mr' ? d.nameMr : curLang === 'hi' ? (d.nameHi || d.nameMr) : d.nameEn,
              }))
            );
          }
        })
        .catch(() => {
          // Use static fallback
        });
    } else {
      setApiDistricts([]);
    }
  }, [stateId, curLang]);

  // 2. Fetch talukas from API when district changes
  useEffect(() => {
    if (districtId) {
      api.getTalukas(districtId)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setApiTalukas(
              data.map((t) => ({
                id: t.id,
                name: curLang === 'mr' ? t.nameMr : curLang === 'hi' ? (t.nameHi || t.nameMr) : t.nameEn,
              }))
            );
          }
        })
        .catch(() => {
          // Use static fallback
        });
    } else {
      setApiTalukas([]);
    }
  }, [districtId, curLang]);

  // 3. Fetch villages from API when taluka changes
  useEffect(() => {
    if (talukaId) {
      setIsLocLoading(true);
      api.getVillages(talukaId, undefined, 1, 150)
        .then((res) => {
          if (res?.villages && Array.isArray(res.villages) && res.villages.length > 0) {
            setApiVillages(
              res.villages.map((v) => ({
                id: v.id,
                name: curLang === 'mr' ? v.nameMr : curLang === 'hi' ? (v.nameHi || v.nameMr) : v.nameEn,
              }))
            );
          }
        })
        .catch(() => {
          // Use static fallback
        })
        .finally(() => {
          setIsLocLoading(false);
        });
    } else {
      setApiVillages([]);
    }
  }, [talukaId, curLang]);

  // Computed displayed translated labels
  const selectedStateName = useMemo(() => {
    return stateOptions.find((s) => s.id === stateId)?.name || '';
  }, [stateOptions, stateId]);

  const selectedDistrictName = useMemo(() => {
    return districtOptions.find((d) => d.id === districtId)?.name || '';
  }, [districtOptions, districtId]);

  const selectedTalukaName = useMemo(() => {
    return talukaOptions.find((t) => t.id === talukaId)?.name || '';
  }, [talukaOptions, talukaId]);

  const selectedVillageName = useMemo(() => {
    if (customVillage) return customVillage;
    return villageOptions.find((v) => v.id === villageId)?.name || '';
  }, [villageOptions, villageId, customVillage]);

  // Resets on parent changes
  const handleStateSelect = (option: LocationOption) => {
    setStateId(option.id);
    setDistrictId('');
    setTalukaId('');
    setVillageId('');
    setCustomVillage('');
  };

  const handleDistrictSelect = (option: LocationOption) => {
    setDistrictId(option.id);
    setTalukaId('');
    setVillageId('');
    setCustomVillage('');
  };

  const handleTalukaSelect = (option: LocationOption) => {
    setTalukaId(option.id);
    setVillageId('');
    setCustomVillage('');
  };

  const handleVillageSelect = (option: LocationOption) => {
    setVillageId(option.id);
    setCustomVillage('');
  };

  const handleCustomVillageSelect = (customText: string) => {
    setVillageId('custom');
    setCustomVillage(customText);
  };

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    setFormError(null);
    if (!identifier.trim()) {
      setFormError(language === 'mr' ? 'कृपया मोबाईल क्रमांक किंवा ईमेल टाका' : 'Please enter mobile number or email');
      return;
    }
    if (!password) {
      setFormError(language === 'mr' ? 'कृपया पासवर्ड टाका' : 'Please enter password');
      return;
    }
    try {
      await login(identifier, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setFormError(err?.message || 'Login failed');
    }
  };

  const handleQuickDemoLogin = async () => {
    setFormError(null);
    setIdentifier('+919876543210');
    setPassword('Farmer@123');
    try {
      await login('+919876543210', 'Farmer@123');
      router.replace('/(tabs)');
    } catch (err: any) {
      setFormError(err?.message || 'Demo login failed');
    }
  };

  const handleRegister = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError(language === 'mr' ? 'कृपया आपले पूर्ण नाव टाका' : 'Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setFormError(language === 'mr' ? 'कृपया मोबाईल क्रमांक टाका' : 'Please enter mobile number');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setFormError(language === 'mr' ? 'पासवर्ड किमान ६ अक्षरांचा असावा' : 'Password must be at least 6 characters');
      return;
    }

    try {
      const formattedPhone = phone.trim().startsWith('+') ? phone.trim() : `+91${phone.trim()}`;
      const districtForApi = selectedDistrictName || undefined;
      const villageForApi = [selectedTalukaName, selectedVillageName].filter(Boolean).join(', ') || undefined;

      await register({
        name: name.trim(),
        phone: formattedPhone,
        password: regPassword,
        village: villageForApi,
        district: districtForApi,
        landArea: landArea ? parseFloat(landArea) : undefined,
        language,
      });
      router.replace('/(tabs)');
    } catch (err: any) {
      setFormError(err?.message || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top Header Row with Language Switcher */}
      <View style={styles.topNav}>
        <View style={styles.brandPill}>
          <Sprout size={16} color={colors.primaryGreen} />
          <Text style={styles.brandPillText}>SmartShetkari ERP</Text>
        </View>
        <TouchableOpacity style={styles.langBtn} onPress={() => setLangModalVisible(true)} activeOpacity={0.8}>
          <Globe size={16} color={colors.primaryGreen} />
          <Text style={styles.langBtnText}>
            {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Logo */}
            <View style={styles.logoSection}>
              <Image source={require('../assets/logo.png')} style={styles.fullLogoImageAuth} resizeMode="contain" />
            </View>

            {/* Mode Switcher Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabBtn, authMode === 'login' && styles.activeTabBtn]}
                onPress={() => { setAuthMode('login'); setFormError(null); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabBtnText, authMode === 'login' && styles.activeTabBtnText]}>
                  {language === 'mr' ? 'लॉगिन' : language === 'hi' ? 'लॉगिन' : 'Sign In'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, authMode === 'register' && styles.activeTabBtn]}
                onPress={() => { setAuthMode('register'); setFormError(null); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabBtnText, authMode === 'register' && styles.activeTabBtnText]}>
                  {language === 'mr' ? 'नवीन नोंदणी' : language === 'hi' ? 'नया पंजीकरण' : 'Register'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Banner */}
            {(formError || error) ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{formError || error}</Text>
              </View>
            ) : null}

            {authMode === 'login' ? (
              /* ═══════════════ LOGIN FORM ═══════════════ */
              <View style={styles.formCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'mr' ? 'मोबाईल क्रमांक किंवा ईमेल' : language === 'hi' ? 'मोबाइल नंबर या ईमेल' : 'Mobile Number or Email'} *
                  </Text>
                  <View style={styles.inputBox}>
                    <Phone size={18} color={colors.primaryGreen} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="+91 98765 43210"
                      placeholderTextColor={colors.mutedText}
                      value={identifier}
                      onChangeText={setIdentifier}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'mr' ? 'पासवर्ड' : language === 'hi' ? 'पासवर्ड' : 'Password'} *
                  </Text>
                  <View style={styles.inputBox}>
                    <Lock size={18} color={colors.primaryGreen} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor={colors.mutedText}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      {showPassword ? <EyeOff size={18} color={colors.secondaryText} /> : <Eye size={18} color={colors.secondaryText} />}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <>
                      <Text style={styles.primaryBtnText}>
                        {language === 'mr' ? 'खात्यात प्रवेश करा' : language === 'hi' ? 'लॉगिन करें' : 'Sign In to Dashboard'}
                      </Text>
                      <ArrowRight size={18} color={colors.white} />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.demoBtn} onPress={handleQuickDemoLogin} disabled={isLoading} activeOpacity={0.8}>
                  <Sparkles size={16} color="#D97706" />
                  <Text style={styles.demoBtnText}>
                    {language === 'mr' ? '⚡ डेमो लॉगिन (कुणाल देशमुख)' : language === 'hi' ? '⚡ डेमो लॉगिन (कुणाल देशमुख)' : '⚡ Quick Demo Login (Kunal Deshmukh)'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* ═══════════════ REGISTER FORM ═══════════════ */
              <View style={styles.formCard}>
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'mr' ? 'पूर्ण नाव (Farmer Name)' : language === 'hi' ? 'पूरा नाम' : 'Full Name'} *
                  </Text>
                  <View style={styles.inputBox}>
                    <User size={18} color={colors.primaryGreen} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder={language === 'mr' ? 'उदा. रमेश विठ्ठल पाटील' : language === 'hi' ? 'उदा. रमेश विट्ठल पाटिल' : 'e.g. Ramesh Vitthal Patil'}
                      placeholderTextColor={colors.mutedText}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'mr' ? 'मोबाईल क्रमांक' : language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} *
                  </Text>
                  <View style={styles.inputBox}>
                    <Phone size={18} color={colors.primaryGreen} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="9876543210"
                      placeholderTextColor={colors.mutedText}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'mr' ? 'पासवर्ड (किमान ६ अक्षरे)' : language === 'hi' ? 'पासवर्ड (न्यूनतम ६ अक्षर)' : 'Password (min 6 chars)'} *
                  </Text>
                  <View style={styles.inputBox}>
                    <Lock size={18} color={colors.primaryGreen} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor={colors.mutedText}
                      value={regPassword}
                      onChangeText={setRegPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      {showPassword ? <EyeOff size={18} color={colors.secondaryText} /> : <Eye size={18} color={colors.secondaryText} />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ── Multilingual Location Section ─────────────────────── */}
                <View style={styles.locationSectionLabel}>
                  <MapPin size={14} color={colors.primaryGreen} />
                  <Text style={styles.locationSectionText}>
                    {language === 'mr' ? 'स्थान निवडा (State → District → Taluka → Village)' : language === 'hi' ? 'स्थान चुनें' : 'Select Location'}
                  </Text>
                </View>

                {/* 1. State Dropdown */}
                <DropdownBtn
                  icon={<MapPin size={17} color={colors.primaryGreen} />}
                  label={language === 'mr' ? 'राज्य (State)' : language === 'hi' ? 'राज्य (State)' : 'State'}
                  value={selectedStateName}
                  placeholder={language === 'mr' ? 'राज्य निवडा...' : language === 'hi' ? 'राज्य चुनें...' : 'Select State...'}
                  onPress={() => setStatePickerOpen(true)}
                />

                {/* 2. District Dropdown */}
                <DropdownBtn
                  icon={<MapPin size={17} color={stateId ? colors.primaryGreen : '#D1D5DB'} />}
                  label={language === 'mr' ? 'जिल्हा (District)' : language === 'hi' ? 'जिला (District)' : 'District'}
                  value={selectedDistrictName}
                  placeholder={
                    stateId
                      ? language === 'mr'
                        ? 'जिल्हा निवडा...'
                        : language === 'hi'
                        ? 'जिला चुनें...'
                        : 'Select District...'
                      : language === 'mr'
                      ? 'आधी राज्य निवडा'
                      : language === 'hi'
                      ? 'पहले राज्य चुनें'
                      : 'Select State first'
                  }
                  onPress={() => setDistrictPickerOpen(true)}
                  disabled={!stateId}
                />

                {/* 3. Taluka Dropdown */}
                <DropdownBtn
                  icon={<MapPin size={17} color={districtId ? colors.primaryGreen : '#D1D5DB'} />}
                  label={language === 'mr' ? 'तालुका (Taluka)' : language === 'hi' ? 'तालुका (Taluka)' : 'Taluka'}
                  value={selectedTalukaName}
                  placeholder={
                    districtId
                      ? language === 'mr'
                        ? 'तालुका निवडा...'
                        : language === 'hi'
                        ? 'तालुका चुनें...'
                        : 'Select Taluka...'
                      : language === 'mr'
                      ? 'आधी जिल्हा निवडा'
                      : language === 'hi'
                      ? 'पहले जिला चुनें'
                      : 'Select District first'
                  }
                  onPress={() => setTalukaPickerOpen(true)}
                  disabled={!districtId}
                />

                {/* 4. Village Dropdown */}
                <DropdownBtn
                  icon={<MapPin size={17} color={talukaId ? colors.primaryGreen : '#D1D5DB'} />}
                  label={language === 'mr' ? 'गाव (Village)' : language === 'hi' ? 'गांव (Village)' : 'Village'}
                  value={selectedVillageName}
                  placeholder={
                    talukaId
                      ? language === 'mr'
                        ? 'गाव निवडा किंवा शोधा...'
                        : language === 'hi'
                        ? 'गांव चुनें या खोजें...'
                        : 'Select or search Village...'
                      : language === 'mr'
                      ? 'आधी तालुका निवडा'
                      : language === 'hi'
                      ? 'पहले तालुका चुनें'
                      : 'Select Taluka first'
                  }
                  onPress={() => setVillagePickerOpen(true)}
                  disabled={!talukaId}
                />

                {/* Land Area */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'mr' ? 'शेत जमीन (एकर मध्ये)' : language === 'hi' ? 'कृषि भूमि (एकड़ में)' : 'Farm Area (in Acres)'}
                  </Text>
                  <View style={styles.inputBox}>
                    <LandPlot size={18} color={colors.primaryGreen} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder={language === 'mr' ? 'उदा. 4.5' : 'e.g. 4.5'}
                      placeholderTextColor={colors.mutedText}
                      value={landArea}
                      onChangeText={setLandArea}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Submit */}
                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <>
                      <Text style={styles.primaryBtnText}>
                        {language === 'mr' ? 'खाते तयार करा व सुरू करा' : language === 'hi' ? 'खाता बनाएं और शुरू करें' : 'Register & Start'}
                      </Text>
                      <ArrowRight size={18} color={colors.white} />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Footer Security Badge */}
            <View style={styles.securityFooter}>
              <ShieldCheck size={16} color={colors.primaryGreen} />
              <Text style={styles.securityFooterText}>
                {language === 'mr'
                  ? '१००% सुरक्षित शेतकरी डेटा सुरक्षा प्रणाली'
                  : language === 'hi'
                  ? '100% सुरक्षित किसान डेटा सुरक्षा प्रणाली'
                  : '100% Secure & Encrypted Farmer Data Protection'}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Cascading Location Pickers ─────────────────────── */}
      <PickerModal
        visible={statePickerOpen}
        title={language === 'mr' ? 'राज्य निवडा (Select State)' : language === 'hi' ? 'राज्य चुनें' : 'Select State'}
        options={stateOptions}
        selectedId={stateId}
        onSelect={handleStateSelect}
        onClose={() => setStatePickerOpen(false)}
        placeholder={language === 'mr' ? 'राज्य शोधा...' : language === 'hi' ? 'राज्य खोजें...' : 'Search state...'}
      />
      <PickerModal
        visible={districtPickerOpen}
        title={language === 'mr' ? 'जिल्हा निवडा (Select District)' : language === 'hi' ? 'जिला चुनें' : 'Select District'}
        options={districtOptions}
        selectedId={districtId}
        onSelect={handleDistrictSelect}
        onClose={() => setDistrictPickerOpen(false)}
        placeholder={language === 'mr' ? 'जिल्हा शोधा...' : language === 'hi' ? 'जिला खोजें...' : 'Search district...'}
      />
      <PickerModal
        visible={talukaPickerOpen}
        title={language === 'mr' ? 'तालुका निवडा (Select Taluka)' : language === 'hi' ? 'तालुका चुनें' : 'Select Taluka'}
        options={talukaOptions}
        selectedId={talukaId}
        onSelect={handleTalukaSelect}
        onClose={() => setTalukaPickerOpen(false)}
        placeholder={language === 'mr' ? 'तालुका शोधा...' : language === 'hi' ? 'तालुका खोजें...' : 'Search taluka...'}
      />
      <PickerModal
        visible={villagePickerOpen}
        title={language === 'mr' ? 'गाव निवडा (Select Village)' : language === 'hi' ? 'गांव चुनें' : 'Select Village'}
        options={villageOptions}
        selectedId={villageId}
        onSelect={handleVillageSelect}
        onClose={() => setVillagePickerOpen(false)}
        placeholder={language === 'mr' ? 'गाव शोधा...' : language === 'hi' ? 'गांव खोजें...' : 'Search village...'}
        allowCustom
        onCustomSelect={handleCustomVillageSelect}
      />

      <LanguageSelectorModal visible={langModalVisible} onClose={() => setLangModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF7',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  brandPillText: {
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.xs,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  langBtnText: {
    color: colors.primaryText,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 20,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  fullLogoImageAuth: {
    width: Math.min(width * 0.72, 260),
    height: Math.min(width * 0.72, 260),
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    padding: 4,
    marginBottom: spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabBtn: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  tabBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryText,
  },
  activeTabBtnText: {
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 0,
    ...shadows.sm,
    gap: spacing.md,
    // @ts-ignore
    boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 0,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 50,
    // @ts-ignore
    outline: 'none',
    boxShadow: 'none',
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: fontSize.sm + 1,
    color: colors.primaryText,
    // @ts-ignore
    outline: 'none',
    borderWidth: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 0,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 50,
    gap: 8,
    // @ts-ignore
    outline: 'none',
    boxShadow: 'none',
  },
  dropdownDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.65,
  },
  dropdownValue: {
    flex: 1,
    fontSize: fontSize.sm + 1,
    color: colors.primaryText,
    fontWeight: fontWeight.medium,
  },
  dropdownPlaceholder: {
    color: colors.mutedText,
    fontWeight: fontWeight.regular,
  },
  locationSectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    paddingBottom: 2,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 4,
  },
  locationSectionText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
    letterSpacing: 0.3,
  },
  primaryBtn: {
    backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    gap: 8,
    marginTop: 4,
    ...shadows.md,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  demoBtnText: {
    color: '#92400E',
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.bold,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
  securityFooterText: {
    fontSize: 11,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
});
