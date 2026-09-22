import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../services';

const DEFAULT_DUMMY_PASS = {
  pnr: '4B9E2A',
  passenger_name: 'Nishant Tyagi',
  seat_number: '3A',
  booking_status: 'CONFIRMED',
  flight: {
    airline: 'IndiGo',
    flight_number: '6E-204',
    origin: 'DEL',
    destination: 'BOM',
    departure_time: '2026-10-15T06:00:00.000Z',
    arrival_time: '2026-10-15T08:15:00.000Z',
    terminal: 'T3',
    gate: '12B',
  },
  qr_code_data: 'BOARDING_PASS|PNR:4B9E2A|SEAT:3A',
};

export default function BoardingPassScreen({ navigation, route }: any) {
  const { bookingId, bookingData } = route?.params || {};
  const [ticket, setTicket] = useState<any>(bookingData || DEFAULT_DUMMY_PASS);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
        if (bookingId && !bookingData) {
      fetchBoardingPass(bookingId);
    }
  }, [bookingId]);

  const fetchBoardingPass = async (id: number | string) => {
    setLoading(true);
    try {
      const res = await bookingService.getBoardingPass(id);
       if (res.ok && res.data?.boardingPass) {
        setTicket(res.data.boardingPass);
       }
    } catch (err) {
      console.error('Fetch boarding pass error:', err);
    } finally {
    setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `FlyGo Boarding Pass\nFlight: ${flight.airline} (${flight.flight_number})\nRoute: ${flight.origin} → ${flight.destination}\nPNR: ${ticket.pnr} | Seat: ${ticket.seat_number}\nPassenger: ${ticket.passenger_name}`,
      });
    } catch (error) {
      Alert.alert('Share Failed', 'Unable to share boarding pass.');
    }
  }; 

  const flight = ticket?.flight || ticket?.Flight || DEFAULT_DUMMY_PASS.flight;
  const departureDate = new Date(flight?.departure_time || Date.now()).toDateString();
  const departureTime = new Date(flight?.departure_time || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Basic Title Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Boarding Pass</Text>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#000" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Airline</Text>
              <Text style={styles.value}>{flight.airline} ({flight.flight_number})</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{ticket.booking_status || 'CONFIRMED'}</Text>
            </View>

            <View style={styles.line} />

            <View style={styles.row}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.value}>{flight.origin} - {departureTime}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.value}>{flight.destination} - 08:15 AM</Text>
            </View>

            <View style={styles.line} />

            <View style={styles.row}>
              <Text style={styles.label}>Passenger</Text>
              <Text style={styles.value}>{ticket.passenger_name || 'Nishant Tyagi'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{departureDate}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Seat</Text>
              <Text style={styles.value}>{ticket.seat_number || '3A'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Gate / Terminal</Text>
              <Text style={styles.value}>{flight.gate || '12B'} / {flight.terminal || 'T3'}</Text>
            </View>

            <View style={styles.line} />

            <View style={styles.row}>
              <Text style={styles.label}>PNR</Text>
              <Text style={[styles.value, styles.pnr]}>{ticket.pnr || '4B9E2A'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('UserHome')}
          >
            <Text style={styles.btnPrimaryText}>Go to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('Bookings')}
          >
            <Text style={styles.btnSecondaryText}>View Bookings</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {
    fontSize: 16,
    color: '#0066cc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareText: {
    fontSize: 16,
    color: '#0066cc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    color: '#666',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  pnr: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  btnPrimary: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#333',
    fontSize: 15,
  },
});