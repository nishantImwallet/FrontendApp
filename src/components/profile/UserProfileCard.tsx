import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../theme';

interface UserProfileCardProps {
  user: any;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const getInitials = () => {
    if (user?.firstName) {
      const first = user.firstName.charAt(0).toUpperCase();
      const last = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
      return `${first}${last}` || 'FG';
    }
    return 'FG';
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'FlyGo Passenger';

  return (
    <View style={styles.profileCard}>
      <View style={styles.userMainRow}>
        <View style={styles.avatarBorder}>
          <Text style={styles.initialsText}>{getInitials()}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@flygo.com'}</Text>
          {user?.phone && (
            <Text style={styles.userPhone}>+91 {user.phone}</Text>
          )}
        </View>
      </View>

      <View style={styles.roleRow}>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {(user?.role || 'passenger').toUpperCase()}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Verified Account</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: SPACING.screenPadding,
    marginBottom: 14,
  },
  userMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarBorder: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  userEmail: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  userPhone: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDivider,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
  },
  roleText: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.successBg,
  },
  statusText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
});
