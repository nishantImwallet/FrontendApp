import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ navigation, route }: any) {
  const user = route?.params?.user;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
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

  const comingSoon = (label: string) => Alert.alert(label, 'Coming soon!');

  const menuItems = [
    { icon: '🎫', label: 'My Bookings', onPress: () => navigation.navigate('Bookings', { user }) },
    { icon: '🔖', label: 'Saved Trips', onPress: () => navigation.navigate('SavedTrips', { user }) },
    { icon: '💳', label: 'Payment Methods', onPress: () => comingSoon('Payment Methods') },
    { icon: '🔔', label: 'Notifications', onPress: () => comingSoon('Notifications') },
    { icon: '❓', label: 'Help & Support', onPress: () => comingSoon('Help & Support') },
    { icon: 'ℹ️', label: 'About FlyGo', onPress: () => comingSoon('About FlyGo') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.banner} />

        <View style={styles.headerCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>{user?.firstName || 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || 'Not logged in'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{(user?.role || 'user').toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>FlyGo Miles</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Gold</Text>
            <Text style={styles.statLabel}>Tier</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, idx === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9ff' },
  scrollContent: { paddingBottom: 40 },
  backBtn: { marginLeft: 16, marginTop: 8, marginBottom: 4, zIndex: 2 },
  backText: { fontSize: 14, color: '#ffffff', fontWeight: '700' },
  banner: {
    height: 110,
    backgroundColor: '#0059bb',
    marginTop: -32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerCard: {
    alignItems: 'center',
    marginTop: -50,
    paddingHorizontal: 16,
  },
  avatarBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#eff4ff',
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 38 },
  name: { fontSize: 20, fontWeight: '700', color: '#121c2a' },
  email: { fontSize: 13, color: '#565e74', marginTop: 2 },
  roleBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#eff4ff',
  },
  roleBadgeText: { fontSize: 11, fontWeight: '700', color: '#0059bb', letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(193, 198, 215, 0.5)' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#121c2a' },
  statLabel: { fontSize: 11, color: '#565e74', marginTop: 2 },
  menuCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(193, 198, 215, 0.3)',
  },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 14, color: '#121c2a', fontWeight: '600' },
  menuChevron: { fontSize: 18, color: '#c1c6d7' },
  logoutBtn: {
    marginTop: 24,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  logoutText: { color: '#dc3545', fontSize: 15, fontWeight: '700' },
});
