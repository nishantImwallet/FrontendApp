import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../theme';

export interface MenuItem {
  label: string;
  desc: string;
  onPress: () => void;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface ProfileMenuListProps {
  sections: MenuSection[];
}

export const ProfileMenuList: React.FC<ProfileMenuListProps> = ({ sections }) => {
  return (
    <>
      {sections.map(sec => (
        <View key={sec.title} style={styles.sectionGroup}>
          <Text style={styles.sectionHeader}>{sec.title}</Text>
          <View style={styles.cardContainer}>
            {sec.items.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuRow,
                  idx === sec.items.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  sectionGroup: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  cardContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: SPACING.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDivider,
  },
  menuLabel: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  menuDesc: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  chevron: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
});
