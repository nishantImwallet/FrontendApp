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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Select Seat & Passenger</Text>
          <Text style={styles.headerSub}>
            {flight?.airline || 'Airline'} ({flight?.flight_number || 'FL-000'}) • {flight?.origin || 'DEL'} → {flight?.destination || 'BOM'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cabin Map Card */}
        <View style={styles.sectionCard}>
          <View style={styles.planeNose}>
            <Text style={{ fontSize: 18 }}>✈️</Text>
            <Text style={styles.cockpitText}>Front of Aircraft (Cockpit)</Text>
          </View>

          {/* Seat Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatAvailable]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatSelected]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatOccupied]} />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
          </View>

          {/* Column Letters */}
          <View style={styles.columnsHeader}>
            <View style={styles.seatGroupHeader}>
              <Text style={styles.colLetter}>A</Text>
              <Text style={styles.colLetter}>B</Text>
              <Text style={styles.colLetter}>C</Text>
            </View>
            <Text style={styles.aisleLabel}>AISLE</Text>
            <View style={styles.seatGroupHeader}>
              <Text style={styles.colLetter}>D</Text>
              <Text style={styles.colLetter}>E</Text>
              <Text style={styles.colLetter}>F</Text>
            </View>
          </View>

          {/* Seat Rows */}
          {SEAT_ROWS.map((row) => (
            <View key={row} style={styles.rowWrapper}>
              {/* Left Group (A, B, C) */}
              <View style={styles.seatGroup}>
                {['A', 'B', 'C'].map((col) => {
                  const seatId = `${row}${col}`;
                  const isSelected = selectedSeat === seatId;
                  const isOccupied = OCCUPIED_SEATS.includes(seatId);

                  return (
                    <TouchableOpacity
                      key={seatId}
                      style={[
                        styles.seatBtn,
                        isSelected && styles.seatSelected,
                        isOccupied && styles.seatOccupied,
                      ]}
                      onPress={() => handleSeatPress(seatId)}
                      activeOpacity={isOccupied ? 1 : 0.7}
                    >
                      <Text style={[styles.seatBtnText, isSelected && styles.seatTextSelected, isOccupied && styles.seatTextOccupied]}>
                        {seatId}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Row Number in Aisle */}
              <View style={styles.aisleBox}>
                <Text style={styles.rowNumberText}>{row}</Text>
              </View>

              {/* Right Group (D, E, F) */}
              <View style={styles.seatGroup}>
                {['D', 'E', 'F'].map((col) => {
                  const seatId = `${row}${col}`;
                  const isSelected = selectedSeat === seatId;
                  const isOccupied = OCCUPIED_SEATS.includes(seatId);

                  return (
                    <TouchableOpacity
                      key={seatId}
                      style={[
                        styles.seatBtn,
                        isSelected && styles.seatSelected,
                        isOccupied && styles.seatOccupied,
                      ]}
                      onPress={() => handleSeatPress(seatId)}
                      activeOpacity={isOccupied ? 1 : 0.7}
                    >
                      <Text style={[styles.seatBtnText, isSelected && styles.seatTextSelected, isOccupied && styles.seatTextOccupied]}>
                        {seatId}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Passenger Details Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.formSectionTitle}>Passenger Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name (as on ID)</Text>
            <TextInput
              style={styles.inputField}
              value={passengerName}
              onChangeText={setPassengerName}
              placeholder="e.g. John Doe"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.inputField}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="25"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderPill, gender === g && styles.genderPillActive]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Dock */}
      <View style={styles.bottomDock}>
        <View style={styles.dockPriceRow}>
          <View>
            <Text style={styles.dockSeatLabel}>
              Selected Seat: <Text style={{ color: '#0059bb', fontWeight: '800' }}>{selectedSeat}</Text>
            </Text>
            <Text style={styles.dockSeatSub}>{getSeatType(selectedSeat)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.dockFareLabel}>Total Fare</Text>
            <Text style={styles.dockFareVal}>₹{flight?.price ? Number(flight.price).toLocaleString() : '4,500'}</Text>
          </View>
        </View>

        <AppButton
          title="Confirm & Book Flight"
          onPress={handleConfirmBooking}
          loading={bookingLoading}
          rightIcon={<Text style={{ fontSize: 16, color: '#ffffff' }}>→</Text>}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#121c2a' },
  headerSub: { fontSize: 12, color: '#565e74', marginTop: 2 },
  scroll: { flex: 1, backgroundColor: '#f8f9ff' },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 32 },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  planeNose: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    backgroundColor: '#eff4ff',
    borderRadius: 10,
    marginBottom: 12,
  },
  cockpitText: { fontSize: 11, fontWeight: '600', color: '#0059bb', marginTop: 2 },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendBox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1 },
  legendText: { fontSize: 11, color: '#64748b' },
  columnsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  seatGroupHeader: { flexDirection: 'row', gap: 8 },
  colLetter: { width: 38, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  aisleLabel: { fontSize: 9, fontWeight: '800', color: '#cbd5e1', letterSpacing: 1 },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  seatGroup: { flexDirection: 'row', gap: 8 },
  seatBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatAvailable: { backgroundColor: '#ffffff', borderColor: '#cbd5e1' },
  seatSelected: {
    backgroundColor: '#0070ea',
    borderColor: '#0070ea',
    shadowColor: '#0070ea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  seatOccupied: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  seatBtnText: { fontSize: 11, fontWeight: '700', color: '#334155' },
  seatTextSelected: { color: '#ffffff' },
  seatTextOccupied: { color: '#cbd5e1' },
  aisleBox: { width: 28, alignItems: 'center', justifyContent: 'center' },
  rowNumberText: { fontSize: 11, fontWeight: '600', color: '#94a3b8' },
  formSectionTitle: { fontSize: 15, fontWeight: '700', color: '#121c2a', marginBottom: 12 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 11, fontWeight: '600', color: '#64748b', marginBottom: 6 },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#121c2a',
    backgroundColor: '#f8f9ff',
  },
  genderRow: { flexDirection: 'row', gap: 6 },
  genderPill: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderPillActive: {
    backgroundColor: '#eff4ff',
    borderColor: '#0070ea',
  },
  genderText: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  genderTextActive: { color: '#0070ea', fontWeight: '700' },
  bottomDock: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 16,
    gap: 12,
  },
  dockPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dockSeatLabel: { fontSize: 13, color: '#121c2a' },
  dockSeatSub: { fontSize: 11, color: '#64748b', marginTop: 1 },
  dockFareLabel: { fontSize: 10, color: '#64748b' },
  dockFareVal: { fontSize: 18, fontWeight: '800', color: '#0059bb' },
});