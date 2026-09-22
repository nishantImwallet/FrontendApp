import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';

export default function BusResultsScreen({ navigation, route }: any) {
  const { buses = [], searchParams = {}, user } = route?.params || {};
  console.log('nishant2', buses);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="red" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bus Results</Text>
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
            <Text style={styles.bold}>Total Buses: </Text>
            {buses.length}
          </Text>
        </View>
        {buses.map((item: any, idx: any) => (
          <View style={styles.BusCard}>
            <Text style={styles.flightTitle}>
              {item.operator_name || 'Flight'} ({item.bus_number || 'N/A'})
            </Text>
            <Text style={styles.rowText}>
              <Text style={styles.bold}>Price: </Text>₹{item.price}
            </Text>
            <Text style={styles.rowText}>
              <Text style={styles.bold}>Seats: </Text>
              {item.available_seats ?? item.total_seats} available
            </Text>

            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => {
                if (!user?.id) {
                  Alert.alert(
                    'Login Required',
                    'Please log in with email/password to book a flight.',
                  );
                  return;
                }
                navigation.navigate('SeatSelection', { bus: item, user });
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.bookBtnText}>Select Seat & Book →</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Flight Items: Just 2-3 essential fields */}
      </ScrollView>
    </View>
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
    marginTop: 20,
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
  BusCard: {
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
