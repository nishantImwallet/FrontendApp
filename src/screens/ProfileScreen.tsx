import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../theme';
import {
  UserProfileCard,
  ProfileStatsCard,
  ProfileMenuList,
  MenuSection,
} from '../components/profile';

export default function ProfileScreen({ navigation, route }: any) {
  const user = route?.params?.user;

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out from FlyGo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const comingSoon = (label: string) =>
    Alert.alert(label, `${label} feature is coming soon!`);

  const menuSections: MenuSection[] = [
    {
      title: 'TRAVEL & BOOKINGS',
      items: [
        {
          label: 'My Bookings',
          desc: 'Flights, boarding passes & history',
          onPress: () => navigation.navigate('Bookings', { user }),
        },
        {
          label: 'Saved Trips',
          desc: 'Wishlist & planned itineraries',
          onPress: () => navigation.navigate('SavedTrips', { user }),
        },
      ],
    },
    {
      title: 'ACCOUNT & SECURITY',
      items: [
        {
          label: 'Payment Methods',
          desc: 'Cards, UPI & saved wallets',
          onPress: () => comingSoon('Payment Methods'),
        },
        {
          label: 'Notifications',
          desc: 'Flight alerts & booking status',
          onPress: () => comingSoon('Notifications'),
        },
        {
          label: 'Privacy & Security',
          desc: 'Biometric login & device sessions',
          onPress: () => comingSoon('Privacy & Security'),
        },
      ],
    },
    {
      title: 'SUPPORT & PREFERENCES',
      items: [
        {
          label: 'Help & 24/7 Helpline',
          desc: 'Call 1800-FLY-GO or live chat',
          onPress: () =>
            Alert.alert(
              'FlyGo Support',
              '24/7 Helpline: 1800-FLY-GO\nEmail: support@flygo.com',
            ),
        },
        {
          label: 'About FlyGo',
          desc: 'App v1.0.0 • Terms & Policies',
          onPress: () => comingSoon('About FlyGo'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header Bar without icons */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>Back</Text>
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>Profile</Text>
        </View>

        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() =>
            Alert.alert('Help', 'FlyGo 24/7 Helpline: 1800-FLY-GO')
          }
          activeOpacity={0.7}
        >
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modular User Profile Card */}
        <UserProfileCard user={user} />

        {/* Modular Travel Stats Card */}
        <ProfileStatsCard />

        {/* Modular Categorized Menu Groups */}
        <ProfileMenuList sections={menuSections} />

        {/* Logout CTA */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log out of FlyGo</Text>
        </TouchableOpacity>

        <Text style={styles.footerAppVersion}>
          FlyGo Travel App v1.0.0 (Secure Build)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDivider,
    backgroundColor: COLORS.cardBg,
  },
  backButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  helpBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.cardBg,
  },
  helpText: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.screenPadding,
    paddingBottom: 40,
  },
  logoutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    marginTop: 10,
    marginBottom: SPACING.screenPadding,
  },
  logoutText: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.error,
  },
  footerAppVersion: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: COLORS.textPlaceholder,
    textAlign: 'center',
    marginBottom: 10,
  },
});

