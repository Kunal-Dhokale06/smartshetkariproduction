import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
  TouchableWithoutFeedback,
  PanResponder,
  Image,
} from 'react-native';
import {
  LayoutDashboard,
  Sprout,
  Banknote,
  ShoppingCart,
  BarChart3,
  BookOpen,
  ClipboardList,
  MessageSquare,
  FileText,
  Settings,
  X,
  Globe,
  ChevronRight,
  LogOut,
  Trash2,
} from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { useLanguage } from '../locales/languageContext';
import { useAuth } from '../data/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Drawer width: 85% of screen on mobile, minimum 320px
const DRAWER_WIDTH = Math.min(400, Math.max(320, SCREEN_WIDTH * 0.85));

export default function DrawerMenuScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const isClosing = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      closeDrawer();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const closeDrawer = (onComplete?: () => void) => {
    if (isClosing.current) return;
    isClosing.current = true;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onComplete) {
        onComplete();
      } else {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -80 || gestureState.vx < -0.5) {
          closeDrawer();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const menuItems = [
    { labelKey: 'dashboard' as const, fallback: 'Dashboard', route: '/(tabs)', icon: LayoutDashboard },
    { labelKey: 'myCrops' as const, fallback: 'My Crops', route: '/(tabs)/crops', icon: Sprout },
    { labelKey: 'trash' as const, fallback: 'Trash / Deleted Crops', route: '/deleted-crops', icon: Trash2 },
    { labelKey: 'expenses' as const, fallback: 'Expenses', route: '/(tabs)/expenses', icon: Banknote },
    { labelKey: 'sales' as const, fallback: 'Sales', route: '/(tabs)/sales', icon: ShoppingCart },
    { labelKey: 'analytics' as const, fallback: 'Analytics', route: '/(tabs)/analytics', icon: BarChart3 },
    { labelKey: 'diary' as const, fallback: 'Diary', route: '/(tabs)/diary', icon: BookOpen },
    { labelKey: 'budget' as const, fallback: 'Budget', route: '/(tabs)/budget', icon: ClipboardList },
    { labelKey: 'aiAssistant' as const, fallback: 'AI Assistant', route: '/(tabs)/ai-assistant', icon: MessageSquare },
    { labelKey: 'reports' as const, fallback: 'Reports', route: '/(tabs)/reports', icon: FileText },
    { labelKey: 'settings' as const, fallback: 'Settings', route: '/(tabs)/settings', icon: Settings },
  ];

  const handleNavigate = (route: string) => {
    if (pathname === route) {
      closeDrawer();
      return;
    }
    closeDrawer(() => {
      router.replace(route as any);
    });
  };

  const handleLogout = async () => {
    closeDrawer(async () => {
      await logout();
      router.replace('/auth');
    });
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'mr' : language === 'mr' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  return (
    <View style={styles.overlayContainer}>
      {/* Backdrop overlay */}
      <TouchableWithoutFeedback onPress={() => closeDrawer()}>
        <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Drawer content sheet */}
      <Animated.View
        style={[
          styles.drawerSheet,
          { width: DRAWER_WIDTH, transform: [{ translateX: slideAnim }] },
        ]}
        {...panResponder.panHandlers}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left']}>
          {/* Drawer Header */}
          <View style={styles.headerContainer}>
            {/* Top row with Logo and Prominent Close Button */}
            <View style={styles.headerTopRow}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.logoImageSmall}
                  resizeMode="contain"
                />
                <Text style={styles.appNameText}>{t('appTitle')}</Text>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => closeDrawer()}
                activeOpacity={0.7}
                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                accessibilityLabel={t('close')}
              >
                <X size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Farmer Profile Info */}
            <Text style={styles.userName}>{user?.name || 'Kunal Deshmukh'}</Text>

            <View style={styles.subTitleRow}>
              <View style={styles.statusDot} />
              <Text style={styles.userSubtitle}>
                {user?.village ? `${user.village}${user.district ? ', ' + user.district : ''}` : 'Farmer • Maharashtra'}
              </Text>
            </View>

            {/* Language Quick Switch Pill in Header */}
            <TouchableOpacity
              style={styles.langSwitchPill}
              onPress={toggleLanguage}
              activeOpacity={0.8}
            >
              <Globe size={16} color={colors.white} />
              <Text style={styles.langSwitchText}>
                {language === 'en' ? 'मराठी' : language === 'mr' ? 'हिन्दी' : 'English'}
              </Text>
              <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>

          {/* Drawer Menu Items */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const titleText = t(item.labelKey) || item.fallback;
              const isActive =
                item.fallback === 'Dashboard'
                  ? pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index'
                  : pathname.includes(item.fallback.toLowerCase().replace(' ', ''));

              return (
                <TouchableOpacity
                  key={item.labelKey}
                  style={[styles.menuItem, isActive && styles.activeMenuItem]}
                  onPress={() => handleNavigate(item.route)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.menuIconBox, isActive && styles.activeMenuIconBox]}>
                    <Icon
                      size={24}
                      color={isActive ? colors.primaryGreen : colors.primaryText}
                    />
                  </View>
                  <Text
                    style={[
                      styles.menuItemText,
                      isActive && styles.activeMenuItemText,
                    ]}
                    numberOfLines={1}
                  >
                    {titleText}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}

            {/* Logout Action in Drawer */}
            <View style={styles.drawerDivider} />
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutMenuItem]}
              onPress={handleLogout}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, styles.logoutIconBox]}>
                <LogOut size={22} color={colors.danger} />
              </View>
              <Text style={[styles.menuItemText, styles.logoutItemText]}>
                {t('logout')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  drawerSheet: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
    zIndex: 1000,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.darkGreen,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoImageSmall: {
    width: 48,
    height: 48,
  },
  appNameText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: 4,
  },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34D399',
  },
  userSubtitle: {
    fontSize: fontSize.sm,
    color: '#D1FAE5',
    fontWeight: fontWeight.medium,
  },
  langSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    gap: spacing.xs + 2,
  },
  langSwitchText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  menuContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 14,
    gap: spacing.md,
    position: 'relative',
    minHeight: 52,
  },
  activeMenuItem: {
    backgroundColor: colors.lightGreen,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  activeMenuIconBox: {
    backgroundColor: '#DCFCE7',
  },
  menuItemText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.primaryText,
    flex: 1,
  },
  activeMenuItemText: {
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
  },
  activeIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.primaryGreen,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  logoutMenuItem: {
    backgroundColor: '#FFF5F5',
  },
  logoutIconBox: {
    backgroundColor: '#FEE2E2',
  },
  logoutItemText: {
    color: colors.danger,
    fontWeight: fontWeight.bold,
  },
});
