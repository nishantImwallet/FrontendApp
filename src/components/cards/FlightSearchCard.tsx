import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Airport } from '../../services';
import AppButton from '../common/AppButton';

export interface FlightSearchCardProps {
  tripType: 'round' | 'oneWay' | 'multi';
  onChangeTripType: (type: 'round' | 'oneWay' | 'multi') => void;
  fromAirport: Airport;
  toAirport: Airport;
  onSelectFrom: () => void;
  onSelectTo: () => void;
  onSwapRoute: () => void;
  departureDate?: { day: string; date: string; year: string };
  returnDate?: { day: string; date: string; year: string };
  passengerText?: string;
  onPressPassengers?: () => void;
  onSearch: () => void;
  isSearching?: boolean;
}

export const FlightSearchCard: React.FC<FlightSearchCardProps> = ({
  tripType,
  onChangeTripType,
  fromAirport,
  toAirport,
  onSelectFrom,
  onSelectTo,
  onSwapRoute,
  departureDate = { day: 'Fri', date: '18 Sep', year: '2025' },
  returnDate = { day: 'Tue', date: '22 Sep', year: '2025' },
  passengerText = '1 Passenger · Economy',
  onPressPassengers,
  onSearch,
  isSearching = false,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Trip Type Tabs */}
      {/* <View style={styles.tabList}>
        <TouchableOpacity
          style={[styles.tabBtn, tripType === 'round' && styles.activeTabBtn]}
          onPress={() => onChangeTripType('round')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tripType === 'round' && styles.activeTabText]}>
            Round trip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tripType === 'oneWay' && styles.activeTabBtn]}
          onPress={() => onChangeTripType('oneWay')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tripType === 'oneWay' && styles.activeTabText]}>
            One way
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tripType === 'multi' && styles.activeTabBtn]}
          onPress={() => onChangeTripType('multi')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tripType === 'multi' && styles.activeTabText]}>
            Multi-city
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* Main Card */}
      <View style={styles.searchCard}>
        {/* FROM Field */}
        <TouchableOpacity
          style={styles.airportRow}
          activeOpacity={0.7}
          onPress={onSelectFrom}
        >
          <View style={styles.airportLeft}>
            {/* <View style={styles.planeIconBox}>
              <Text style={{ fontSize: 16, color: '#0059bb' }}>🛫</Text>
            </View> */}
            <View>
              <Text style={styles.fieldLabel}>FROM</Text>
              <Text style={styles.airportCode}>{fromAirport.code || 'DEL'}</Text>
              <Text style={styles.airportCity} numberOfLines={1}>
                {fromAirport.city || fromAirport.name}
              </Text>
            </View>
          </View>
          <Text style={styles.countryTag}>{fromAirport.country || 'India'}</Text>
        </TouchableOpacity>

        {/* Swap Divider */}
        <View style={styles.swapDividerRow}>
          {/* <View style={styles.dashedLine} /> */}
          <TouchableOpacity
            style={styles.swapBtn}
            onPress={onSwapRoute}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, color: '#0070ea' }}>⇅</Text>
          </TouchableOpacity>
        </View>

        {/* TO Field */}
        <TouchableOpacity
          style={styles.airportRow}
          activeOpacity={0.7}
          onPress={onSelectTo}
        >
          <View style={styles.airportLeft}>
            {/* <View style={styles.planeIconBox}>
              <Text style={{ fontSize: 16, color: '#0059bb' }}>🛬</Text>
            </View> */}
            <View>
              <Text style={styles.fieldLabel}>TO</Text>
              <Text style={styles.airportCode}>{toAirport.code || 'BOM'}</Text>
              <Text style={styles.airportCity} numberOfLines={1}>
                {toAirport.city || toAirport.name}
              </Text>
            </View>
          </View>
          <Text style={styles.countryTag}>{toAirport.country || 'India'}</Text>
        </TouchableOpacity>

        {/* Dates Grid */}
        {/* <View style={styles.datesGrid}>
          {/* Departure Date */}
          {/* <View style={[styles.datePill, styles.departureDatePill]}>
            <View style={styles.dateHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 12, color: '#0070ea' }}>📅</Text>
                <Text style={styles.dateLabel}>DEPARTURE</Text>
              </View>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{departureDate.day}</Text>
              </View>
            </View>
            <Text style={styles.dateVal}>{departureDate.date}</Text>
            <Text style={styles.dateYear}>{departureDate.year}</Text>
          </View> */}

          {/* Return Date (only if not one way) */}
          {/* <View style={[styles.datePill, tripType === 'oneWay' && { opacity: 0.45 }]}>
            <View style={styles.dateHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 12, color: '#565e74' }}>📅</Text>
                <Text style={styles.dateLabel}>RETURN</Text>
              </View>
              <View style={[styles.dayBadge, { backgroundColor: '#d9e3f6' }]}>
                <Text style={[styles.dayBadgeText, { color: '#565e74' }]}>{returnDate.day}</Text>
              </View>
            </View>
            <Text style={styles.dateVal}>{returnDate.date}</Text>
            <Text style={styles.dateYear}>{returnDate.year}</Text>
          </View> */}
        {/* </View> */}

        {/* Passenger Selector */}
        {/* <TouchableOpacity
          style={styles.passengerSelector}
          activeOpacity={0.7}
          onPress={onPressPassengers}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.groupIconBox}>
              <Text style={{ fontSize: 14, color: '#3f465c' }}>👥</Text>
            </View>
            <View>
              <Text style={styles.passengerLabel}>Passengers & Class</Text>
              <Text style={styles.passengerVal}>{passengerText}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 16, color: '#717786' }}>›</Text>
        </TouchableOpacity> */}

        {/* Search Action Button */}
        <AppButton
          title="Search Flights"
          onPress={onSearch}
          loading={isSearching}
          icon="🔍 "
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#dee9fc',
    borderRadius: 24,
    padding: 3,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTabBtn: {
    backgroundColor: '#0070ea',
  },
  tabText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: '#565e74',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 18,
    borderWidth: 1,
    borderColor: '#121c2a',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  airportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    // borderColor: '#e2e8f0',
      borderColor: '#121c2a',
    backgroundColor: '#ffffff',
  },
  airportLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  planeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  fieldLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    color: '#565e74',
    letterSpacing: 0.5,
  },
  airportCode: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: '#121c2a',
  },
  airportCity: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#565e74',
    maxWidth: 180,
  },
  countryTag: {
    fontFamily: 'Inter',
    fontSize: 11,
    // color: '#717786',
     color: '#121c2a',
  },
  swapDividerRow: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
    borderStyle: 'dashed',
  },
  swapBtn: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121c2a',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    // elevation: 5,
  },
  datesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.3)',
  },
  datePill: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  departureDatePill: {
    borderColor: '#0059bb',
    backgroundColor: '#eff4ff',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: '600',
    color: '#565e74',
  },
  dayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#dae2fd',
  },
  dayBadgeText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    color: '#0059bb',
  },
  dateVal: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#121c2a',
    marginTop: 4,
  },
  dateYear: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#565e74',
  },
  passengerSelector: {
    marginTop: 12,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d9e3f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#565e74',
  },
  passengerVal: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#121c2a',
  },
});

export default FlightSearchCard;
