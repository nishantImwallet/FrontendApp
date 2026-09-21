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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Boarding Pass</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={{ fontSize: 16 }}>📤</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#0070ea" />
          <Text style={styles.loadingText}>Generating Boarding Pass...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Ticket Card */}
          <View style={styles.ticketCard}>
            {/* Top Airline Banner */}
            <View style={styles.ticketTopBanner}>
    <View>
                <Text style={styles.airlineName}>{flight.airline || 'IndiGo'}</Text>
                <Text style={styles.flightNumber}>{flight.flight_number || '6E-204'} • Airbus A320</Text>
    </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{ticket.booking_status || 'CONFIRMED'}</Text>
              </View>
            </View>

            {/* Route & Timeline Section */}
            <View style={styles.routeSection}>
              <View style={styles.routeCol}>
                <Text style={styles.airportCode}>{flight.origin || 'DEL'}</Text>
                <Text style={styles.cityName}>Delhi</Text>
                <Text style={styles.flightTime}>{departureTime}</Text>
              </View>

              <View style={styles.flightVisual}>
                <Text style={styles.flightDuration}>2h 15m</Text>
                <View style={styles.planeLine}>
                  <View style={styles.lineDot} />
                  <View style={styles.lineBar} />
                  <Text style={{ fontSize: 14, color: '#0070ea' }}>✈️</Text>
                  <View style={styles.lineBar} />
                  <View style={styles.lineDot} />
                </View>
                <Text style={styles.nonStopText}>Non-stop</Text>
              </View>

              <View style={[styles.routeCol, { alignItems: 'flex-end' }]}>
                <Text style={styles.airportCode}>{flight.destination || 'BOM'}</Text>
                <Text style={styles.cityName}>Mumbai</Text>
                <Text style={styles.flightTime}>08:15 AM</Text>
              </View>
            </View>

            {/* 2x2 Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>PASSENGER</Text>
                <Text style={styles.detailVal} numberOfLines={1}>
                  {ticket.passenger_name || 'Nishant Tyagi'}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>DATE</Text>
                <Text style={styles.detailVal}>{departureDate}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>SEAT</Text>
                <Text style={[styles.detailVal, { color: '#0070ea', fontWeight: '800' }]}>
                  {ticket.seat_number || '3A'}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>GATE / TERMINAL</Text>
                <Text style={styles.detailVal}>
                  {flight.gate || '12B'} • {flight.terminal || 'T3'}
                </Text>
              </View>
            </View>

            {/* Perforated Divider with Circular Notches */}
            <View style={styles.perforatedSection}>
              <View style={[styles.circleNotch, styles.leftNotch]} />
              <View style={styles.dashedDivider} />
              <View style={[styles.circleNotch, styles.rightNotch]} />
            </View>

            {/* Bottom Barcode / PNR Section */}
            <View style={styles.ticketBottomSection}>
              <View style={styles.pnrRow}>
                <Text style={styles.pnrLabel}>BOOKING REFERENCE (PNR)</Text>
                <Text style={styles.pnrCode}>{ticket.pnr || '4B9E2A'}</Text>
              </View>

              {/* Barcode Visual Representation */}
              <View style={styles.barcodeWrapper}>
                <View style={styles.barcodeLines}>
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1].map((w, i) => (
                    <View
                      key={i}
                      style={{
                        width: w * 2.2,
                        height: 52,
                        backgroundColor: '#121c2a',
                        marginHorizontal: 1.5,
                      }}
                    />
                  ))}
                </View>
                <Text style={styles.barcodeSubText}>
                  {ticket.pnr || '4B9E2A'} • SEAT {ticket.seat_number || '3A'} • FLYGO-ETICKET
                </Text>
              </View>

              <Text style={styles.gateNoticeText}>
                ⚠️ Gate closes 25 minutes prior to departure. Please show this screen at Security & Boarding.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => navigation.navigate('UserHome')}
              activeOpacity={0.8}
            >
              <Text style={styles.doneBtnText}>Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.myBookingsBtn}
              onPress={() => navigation.navigate('Bookings')}
              activeOpacity={0.8}
            >
              <Text style={styles.myBookingsBtnText}>View All Bookings →</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    fontSize: 17,
    fontWeight: '700',
    color: '#121c2a',
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748b',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  ticketTopBanner: {
    backgroundColor: '#0059bb',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  airlineName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  flightNumber: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  routeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  routeCol: {
    width: 80,
  },
  airportCode: {
    fontSize: 28,
    fontWeight: '900',
    color: '#121c2a',
  },
  cityName: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  flightTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0059bb',
    marginTop: 4,
  },
  flightVisual: {
    alignItems: 'center',
    flex: 1,
  },
  flightDuration: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
  },
  planeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lineBar: {
    width: 24,
    height: 1.5,
    backgroundColor: '#cbd5e1',
  },
  lineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0070ea',
  },
  nonStopText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  detailItem: {
    width: '45%',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  detailVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#121c2a',
    marginTop: 4,
  },
  perforatedSection: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  circleNotch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8f9ff',
    position: 'absolute',
    top: 4,
  },
  leftNotch: {
    left: -12,
  },
  rightNotch: {
    right: -12,
  },
  dashedDivider: {
    flex: 1,
    height: 1,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  ticketBottomSection: {
    padding: 20,
    paddingTop: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  pnrRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pnrLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  pnrCode: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0059bb',
    marginTop: 4,
    letterSpacing: 2,
  },
  barcodeWrapper: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  barcodeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeSubText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 8,
    letterSpacing: 1,
  },
  gateNoticeText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  doneBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0059bb',
  },
  myBookingsBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0070ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myBookingsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});