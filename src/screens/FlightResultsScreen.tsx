import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../services';

export default function FlightResultsScreen({ navigation, route }: any) {
  const { flights = [], searchParams = {}, user } = route?.params || {};

  console.log("This is the route params",route?.params);

  const [bookingLoadingId, setBookingLoadingId] = useState<number | string | null>(null);

  const handleBookFlight = async (flight: any) => {
    if (!user?.id) {
      Alert.alert('Login Required', 'Please log in with email/password to book a flight.');
      return;
    }

    setBookingLoadingId(flight.id);
    try {
      const res = await bookingService.createBooking({
        user_id: user.id,
        flight_id: flight.id,
        passenger_name: user.firstName || user.email || 'Passenger',
        seat_number: 'A1',
      });

      if (res.ok) {
        Alert.alert('Booking Confirmed!', `PNR: ${res.data?.booking?.pnr || 'N/A'}`);
      } else {
        Alert.alert('Booking Failed', res.data?.error || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Cannot connect to server.');
    } finally {
      setBookingLoadingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flight Results</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Search Info Card */}
        <View style={styles.card}>
          <Text style={styles.rowText}>
            <Text style={styles.bold}>Route: </Text>
            {searchParams.origin || 'DEL'} → {searchParams.destination || 'BOM'}
          </Text>
          <Text style={styles.rowText}>
            <Text style={styles.bold}>Date: </Text>
            {searchParams.date || '2026-10-15'}
          </Text>
          <Text style={styles.rowText}>
            <Text style={styles.bold}>Total Flights: </Text>
            {flights.length}
          </Text>
        </View>

        {/* Flight Items: Just 2-3 essential fields */}
        {flights.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.rowText}>No flights found for this route.</Text>
          </View>
        ) : (
          flights.map((item: any, idx: number) => (
            <View key={item.id || idx} style={styles.flightCard}>
              <Text style={styles.flightTitle}>
                {item.airline || 'Flight'} ({item.flight_number || 'N/A'})
              </Text>
              <Text style={styles.rowText}>
                <Text style={styles.bold}>Price: </Text>₹{item.price}
              </Text>
              <Text style={styles.rowText}>
                <Text style={styles.bold}>Seats: </Text>{item.available_seats ?? item.total_seats} available
              </Text>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => {
                  if (!user?.id) {
                    Alert.alert('Login Required', 'Please log in with email/password to book a flight.');
                    return;
                  }
                  navigation.navigate('SeatSelection', { flight: item, user });
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.bookBtnText}>Select Seat & Book →</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
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
  backText: {
    fontSize: 20,
    color: '#0059bb',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121c2a',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#121c2a',
    gap: 6,
  },
  flightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  flightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0059bb',
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    color: '#121c2a',
  },
  rowText: {
    fontSize: 14,
    color: '#475569',
  },
  bookBtn: {
    marginTop: 10,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#0059bb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
