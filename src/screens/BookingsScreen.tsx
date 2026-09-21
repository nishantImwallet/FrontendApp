import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../services';

export default function BookingsScreen({ navigation, route }: any) {
  const user = route?.params?.user;
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await bookingService.getUserBookings(user.id);
      setBookings(data || []);
    } catch (error) {
      setBookings([]);
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
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {!user?.id ? (
          <Text style={styles.emptyText}>Please log in with email/password to view your bookings.</Text>
        ) : loading ? (
          <ActivityIndicator size="small" color="#0059bb" style={{ marginTop: 30 }} />
        ) : bookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings yet.</Text>
        ) : (
          bookings.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('BoardingPass', {
                  bookingId: item.id,
                  bookingData: {
                    ...item,
                    flight: item.Flight,
                  },
                })
              }
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.cardTitle}>
                  {item.Flight?.airline || 'Flight'} ({item.Flight?.flight_number || 'N/A'})
                </Text>
                <Text style={{ fontSize: 12, color: '#0070ea', fontWeight: '700' }}>View Pass →</Text>
              </View>
              <Text style={styles.cardText}>PNR: {item.pnr} • Seat: {item.seat_number}</Text>
              <Text style={styles.cardText}>Status: {item.booking_status}</Text>
            </TouchableOpacity>
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
