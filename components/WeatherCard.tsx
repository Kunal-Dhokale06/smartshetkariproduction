import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  SunMedium,
  Droplets,
  CloudRain,
  CloudSun,
  Cloud,
  CloudLightning,
  MapPin,
  RefreshCw,
  Wind,
} from 'lucide-react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { WeatherInfo } from '../types';
import { useLanguage } from '../locales/languageContext';
import { useAuth } from '../data/authStore';
import { useLiveWeather } from '../services/weatherService';

interface WeatherCardProps {
  weather?: WeatherInfo;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather: propWeather }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const fallbackUserLocation = user?.village
    ? `${user.village}${user.district ? ', ' + user.district : ''}`
    : user?.district
    ? `${user.district}, Maharashtra`
    : 'Maharashtra, India';

  const { weather, refresh } = useLiveWeather(fallbackUserLocation);

  const displayLocation = weather.location || fallbackUserLocation;
  const temperature = weather.temperature;
  const humidity = weather.humidity;
  const rainChance = weather.rainChance;
  const condition = weather.condition || 'Sunny';

  // Choose icon based on live condition
  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle')) {
      return <CloudRain size={40} color="#3B82F6" />;
    }
    if (c.includes('thunder') || c.includes('storm')) {
      return <CloudLightning size={40} color="#8B5CF6" />;
    }
    if (c.includes('cloud')) {
      return <CloudSun size={40} color="#F59E0B" />;
    }
    return <SunMedium size={40} color="#F59E0B" />;
  };

  const conditionKey = weather.conditionKey;
  const localizedCondition = conditionKey ? t(conditionKey as any) : condition;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => refresh(true)}
    >
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>{t('todaysWeather')}</Text>
          {weather.isLiveGps && (
            <View style={styles.liveGpsBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.liveGpsText}>LIVE GPS</Text>
            </View>
          )}
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={12} color={colors.primaryGreen} style={{ marginRight: 3 }} />
          <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
            {displayLocation}
          </Text>
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.tempGroup}>
          {getWeatherIcon(condition)}
          <View style={styles.tempTextContainer}>
            <View style={styles.tempWithLoaderRow}>
              <Text style={styles.tempText}>{temperature}°C</Text>
              {weather.isLoading && (
                <ActivityIndicator size="small" color={colors.primaryGreen} style={styles.loader} />
              )}
            </View>
            <Text style={styles.conditionText}>{localizedCondition}</Text>
          </View>
        </View>

        <View style={styles.metricsGroup}>
          <View style={styles.metricItem}>
            <Droplets size={13} color="#3B82F6" />
            <Text style={styles.metricLabel}>{t('humidity')}</Text>
            <Text style={styles.metricValue}>{humidity}%</Text>
          </View>

          <View style={styles.metricItem}>
            <CloudRain size={13} color="#3B82F6" />
            <Text style={styles.metricLabel}>{t('rainChance')}</Text>
            <Text style={styles.metricValue}>{rainChance}%</Text>
          </View>

          {weather.windSpeed !== undefined && (
            <View style={styles.metricItem}>
              <Wind size={13} color="#0EA5E9" />
              <Text style={styles.metricLabel}>{t('wind' as any)}</Text>
              <Text style={styles.metricValue}>{weather.windSpeed} km/h</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.weatherCardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderColor: colors.weatherCardBorder,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  liveGpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryGreen,
  },
  liveGpsText: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
    letterSpacing: 0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '50%',
  },
  locationText: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tempTextContainer: {
    justifyContent: 'center',
  },
  tempWithLoaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tempText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  loader: {
    marginLeft: 2,
  },
  conditionText: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  metricsGroup: {
    gap: 4,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    minWidth: 62,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
    color: colors.primaryText,
  },
});
