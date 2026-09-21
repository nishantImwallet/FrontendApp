import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../services';

export default function SavedTripsScreen({ navigation, route }: any) {
  const user = route?.params?.user;
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingTrips();
  }, []);

  const fetchUpcomingTrips = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const bookings = await bookingService.getUserBookings(user.id);
      const now = new Date();
      const filtered = (bookings || []).filter(
        (b: any) => b.booking_status === 'CONFIRMED' && b.Flight && new Date(b.Flight.departure_time) > now
      );
      setTrips(filtered);
    } catch (error) {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upcoming Trips</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {!user?.id ? (
          <Text style={styles.emptyText}>Please log in with email/password to view saved trips.</Text>
        ) : loading ? (
          <ActivityIndicator size="small" color="#0059bb" style={{ marginTop: 30 }} />
        ) : trips.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming trips.</Text>
        ) : (
          trips.map((item: any) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.Flight?.airline || 'Flight'} ({item.Flight?.flight_number || 'N/A'})
              </Text>
              <Text style={styles.cardText}>PNR: {item.pnr} • Seat: {item.seat_number}</Text>
              <Text style={styles.cardText}>
                Departs: {new Date(item.Flight?.departure_time).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { flex: 1, backgroundColor: '#f8f9ff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20, color: '#0059bb', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#121c2a' },
  content: { padding: 16, gap: 12 },
  emptyText: { textAlign: 'center', fontSize: 13, color: '#565e74', marginTop: 30 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0059bb', marginBottom: 4 },
  cardText: { fontSize: 13, color: '#475569' },
});
