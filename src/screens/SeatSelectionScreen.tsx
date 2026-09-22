import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../services';
import AppButton from '../components/common/AppButton';

const SEAT_ROWS = [1, 2, 3, 4, 5, 6, 7, 8];
const OCCUPIED_SEATS = ['1A', '1B', '2E', '3C', '4F', '5A', '6D', '7B'];

export default function SeatSelectionScreen({ navigation, route }: any) {
  const { flight, user } = route?.params || {};

  // Form State
  const [selectedSeat, setSelectedSeat] = useState<string>('3A');
  const [passengerName, setPassengerName] = useState(
    user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Nishant Tyagi'
  );
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Seat Type Helper
  const getSeatType = (seat: string) => {
    const col = seat.slice(-1);
    if (col === 'A' || col === 'F') return 'Window Seat';
    if (col === 'C' || col === 'D') return 'Aisle Seat';
    return 'Middle Seat';
  };

  const handleSeatPress = (seatId: string) => {
    if (OCCUPIED_SEATS.includes(seatId)) {
      Alert.alert('Seat Unavailable', `Seat ${seatId} is already occupied by another passenger.`);
      return;
    }
    setSelectedSeat(seatId);
  };

  const handleConfirmBooking = async () => {
    if (!user?.id) {
      Alert.alert('Login Required', 'Please log in to confirm flight booking.');
      return;
    }
    if (!passengerName.trim()) {
      Alert.alert('Missing Info', 'Please enter passenger name.');
      return;
    }
    if (!selectedSeat) {
      Alert.alert('Select Seat', 'Please choose a seat to continue.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await bookingService.createBooking({
        user_id: user.id,
        flight_id: flight.id,
        passenger_name: passengerName.trim(),
        seat_number: selectedSeat,
      });

      if (res.ok) {
        Alert.alert(
          '🎉 Booking Confirmed!',
          `PNR: ${res.data?.booking?.pnr || 'N/A'}\nSeat: ${selectedSeat}\nPassenger: ${passengerName}`,
          [
            {
              text: 'View Boarding Pass 🎫',
              onPress: () =>
                navigation.navigate('BoardingPass', {
                  bookingId: res.data?.booking?.id,
                  bookingData: {
                    ...res.data?.booking,
                    flight,
                  },
                }),
            },
            {
              text: 'My Bookings',
              onPress: () => navigation.navigate('Bookings', { user }),
            },
          ]
        );
      } else {
        Alert.alert('Booking Failed', res.data?.error || 'Unable to book seat.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Cannot connect to server. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Ultra Simple Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Seat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Seats Section */}
        <Text style={styles.sectionTitle}>Tap a Seat:</Text>

        <View style={styles.grid}>
          {SEAT_ROWS.map((row) => (
            <View key={row} style={styles.row}>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((col, idx) => {
                const seatId = `${row}${col}`;
                const isSelected = selectedSeat === seatId;
                const isOccupied = OCCUPIED_SEATS.includes(seatId);

                return (
                  <React.Fragment key={seatId}>
                    {idx === 3 && <View style={{ width: 14 }} />}
                    <TouchableOpacity
                      style={[
                        styles.seat,
                        isSelected && styles.seatSelected,
                        isOccupied && styles.seatOccupied,
                      ]}
                      onPress={() => handleSeatPress(seatId)}
                      disabled={isOccupied}
                    >
                      <Text style={[styles.seatText, isSelected && styles.seatTextWhite]}>
                        {seatId}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
          ))}
        </View>

        {/* Selected Seat Text */}
        <Text style={styles.infoText}>
          Selected Seat: <Text style={{ fontWeight: 'bold' }}>{selectedSeat}</Text> (₹{flight?.price ? Number(flight.price).toLocaleString() : '4,500'})
        </Text>

        <View style={styles.line} />

        {/* Passenger Form */}
        <Text style={styles.sectionTitle}>Passenger Info:</Text>

        <TextInput
          style={styles.input}
          value={passengerName}
          onChangeText={setPassengerName}
          placeholder="Passenger Name"
        />

        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          keyboardType="numeric"
        />

        {/* Gender Selection */}
        <View style={styles.genderRow}>
          {(['Male', 'Female', 'Other'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
              onPress={() => setGender(g)}
            >
              <Text style={gender === g ? styles.genderTextActive : styles.genderText}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleConfirmBooking}
          disabled={bookingLoading}
        >
          <Text style={styles.submitText}>
            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    gap: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  linkText: {
    color: '#0066cc',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  grid: {
    alignItems: 'center',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  seat: {
    width: 40,
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  seatSelected: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  seatOccupied: {
    backgroundColor: '#eee',
    borderColor: '#ddd',
  },
  seatText: {
    fontSize: 11,
    color: '#000',
  },
  seatTextWhite: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  genderBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  genderBtnActive: {
    borderColor: '#0066cc',
    backgroundColor: '#e6f0fa',
  },
  genderText: {
    fontSize: 13,
    color: '#444',
  },
  genderTextActive: {
    fontSize: 13,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#0066cc',
    padding: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});