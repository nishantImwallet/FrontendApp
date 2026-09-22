import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../theme';

interface ProfileStatsCardProps {
  tripsCount?: number;
  miles?: string;
  tier?: string;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  tripsCount = 3,
  miles = '2,450',
  tier = 'Gold',
}) => {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{tripsCount}</Text>
        <Text style={styles.statLabel}>Trips Done</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: COLORS.primary }]}>{miles}</Text>
        <Text style={styles.statLabel}>FlyGo Miles</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: COLORS.goldTier }]}>{tier}</Text>
        <Text style={styles.statLabel}>Member Tier</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingVertical: 14,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  statLabel: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.borderDivider,
  },
});
