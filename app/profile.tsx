import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Phone, Mail, Sprout, Edit, UserCheck, X } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { useLanguage } from '../locales/languageContext';
import { useAuth } from '../data/authStore';
import { api } from '../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Kunal Deshmukh');
  const [village, setVillage] = useState(user?.village || 'Khadakawadi');
  const [district, setDistrict] = useState(user?.district || 'Pune');
  const [state, setState] = useState(user?.state || 'Maharashtra');
  const [mobile, setMobile] = useState(user?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'kunal.deshmukh@farm.in');
  const [landArea, setLandArea] = useState(user?.landArea ? `${user.landArea} ${user.landAreaUnit || 'Acre'}` : '7.0 Acre');
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const areaNumber = parseFloat(landArea.replace(/[^\d.]/g, '')) || undefined;
      await api.updateProfile({
        name: name.trim(),
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        email: email.trim() || undefined,
        landArea: areaNumber,
      });
      await refreshUser();
      setIsEditing(false);
      Alert.alert(t('profileUpdatedTitle'), t('profileUpdatedMsg'));
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('farmerProfile')}</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <X size={22} color={colors.danger} />
          ) : (
            <Edit size={20} color={colors.primaryGreen} />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Hero Card */}
          <Card style={styles.heroCard}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarInnerCircle}>
                <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
              </View>
            </View>

            <Text style={styles.farmerName}>{name}</Text>

            <View style={styles.roleTag}>
              <UserCheck size={12} color={colors.primaryGreen} />
              <Text style={styles.roleText}>
                {t('owner')} • {village} ({landArea})
              </Text>
            </View>
          </Card>

          {isEditing ? (
            /* Edit Mode Form */
            <View style={styles.editSection}>
              <Text style={styles.sectionTitle}>{t('editProfileInfo')}</Text>

              <Input
                label={t('farmerFullName')}
                value={name}
                onChangeText={setName}
              />

              <Input
                label={t('villageTaluka')}
                value={village}
                onChangeText={setVillage}
              />

              <Input
                label={t('district')}
                value={district}
                onChangeText={setDistrict}
              />

              <Input
                label={t('state')}
                value={state}
                onChangeText={setState}
              />

              <Input
                label={t('landHoldingArea')}
                value={landArea}
                onChangeText={setLandArea}
              />

              <Input
                label={t('mobileNumber')}
                value={mobile}
                keyboardType="phone-pad"
                onChangeText={setMobile}
              />

              <Input
                label={t('emailAddress')}
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
              />

              <View style={styles.actionsRow}>
                <SecondaryButton
                  title={t('cancel')}
                  onPress={() => setIsEditing(false)}
                  style={styles.actionCol}
                />
                <PrimaryButton
                  title={t('save')}
                  onPress={handleSave}
                  style={styles.actionCol}
                />
              </View>
            </View>
          ) : (
            /* View Mode Card */
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t('contactLocationDetails')}</Text>

              <Card style={styles.infoCard}>
                {/* Land Area */}
                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Sprout size={18} color={colors.primaryGreen} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{t('totalFarmArea')}</Text>
                    <Text style={styles.infoValue}>{landArea}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Village */}
                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <MapPin size={18} color={colors.primaryGreen} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{t('village')}</Text>
                    <Text style={styles.infoValue}>{village}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* District */}
                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <MapPin size={18} color={colors.primaryGreen} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{t('district')}</Text>
                    <Text style={styles.infoValue}>{district}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* State */}
                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <MapPin size={18} color={colors.primaryGreen} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{t('state')}</Text>
                    <Text style={styles.infoValue}>{state}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Mobile */}
                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Phone size={18} color={colors.primaryGreen} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{t('mobile')}</Text>
                    <Text style={styles.infoValue}>{mobile}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Email */}
                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Mail size={18} color={colors.primaryGreen} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{t('email')}</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                  </View>
                </View>
              </Card>

              {/* Edit Profile CTA Button */}
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title={t('editProfile')}
                  onPress={() => setIsEditing(true)}
                  icon={<Edit size={16} color={colors.white} />}
                  fullWidth
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginVertical: spacing.md,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    ...shadows.sm,
  },
  avatarBorder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: colors.primaryGreen,
    padding: 3,
    marginBottom: spacing.sm,
  },
  avatarInnerCircle: {
    flex: 1,
    borderRadius: 36,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  farmerName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGreen,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  roleText: {
    fontSize: 11,
    color: colors.primaryGreen,
    fontWeight: fontWeight.semibold,
  },
  sectionContainer: {
    marginTop: spacing.md,
  },
  editSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primaryText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  buttonWrapper: {
    marginTop: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionCol: {
    flex: 1,
  },
});
