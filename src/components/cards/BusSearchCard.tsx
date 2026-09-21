import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../common/AppButton';

export interface BusSearchCardProps {
  fromCity: string;
  toCity: string;
  onSelectFrom: () => void;
  onSelectTo: () => void;
  onSwapRoute: () => void;
  travelDate?: { day: string; date: string; year: string };
  onSelectDate?: () => void;
  onSearch: () => void;
  isSearching?: boolean;
}

export const BusSearchCard: React.FC<BusSearchCardProps> = ({
  fromCity,
  toCity,
  onSelectFrom,
  onSelectTo,
  onSwapRoute,
  travelDate = { day: 'Today', date: '18 Sep', year: '2026' },
  onSelectDate,
  onSearch,
  isSearching = false,
}) => {
  return (
    <View style={styles.wrapper}>

          <View style={styles.searchCard}>
        <TouchableOpacity
          style={styles.cityRow}
          activeOpacity={0.7}
          onPress={onSelectFrom}
        >
          <View style={styles.cityLeft}>
            {/* <View style={styles.busIconBox}>
              <Text style={{ fontSize: 18 }}>📍</Text>
            </View> */}
            <View>
              <Text style={styles.fieldLabel}>FROM</Text>
              <Text style={styles.cityName}>{fromCity || 'Select Source City'}</Text>
              <Text style={styles.subText}>Boarding Point</Text>
            </View>
           </View>
          {/* <Text style={styles.actionTag}>Change</Text> */}
        
        </TouchableOpacity>
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
          <TouchableOpacity
          style={styles.cityRow}
          activeOpacity={0.7}
        //   onPress={onSelectTo}
        >
          <View style={styles.cityLeft}>
            {/* <View style={styles.busIconBox}>
              <Text style={{ fontSize: 18 }}>🏁</Text>
            </View> */}
            <View>
              <Text style={styles.fieldLabel}>TO</Text>
              <Text style={styles.cityName}>{toCity || 'Select Destination'}</Text>
              <Text style={styles.subText}>Dropping Point</Text>
            </View>
          </View>
          <Text style={styles.actionTag}>Change</Text>
        </TouchableOpacity>
        {/* this is the date of the journey here */}
           {/* <TouchableOpacity
          style={styles.dateCard}
          activeOpacity={0.7}
          onPress={onSelectDate}
        >
          <View style={styles.dateHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 14 }}>📅</Text>
              <Text style={styles.fieldLabel}>JOURNEY DATE</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>{travelDate.day}</Text>
            </View>
          </View>
          <View style={styles.dateRowBottom}>
            <Text style={styles.dateVal}>{travelDate.date}</Text>
            <Text style={styles.dateYear}>{travelDate.year}</Text>
          </View>
        </TouchableOpacity> */}
        /* Search Buses CTA Button */
        <AppButton
          title="Search Buses"
          onPress={onSearch}
          loading={isSearching}
          icon="🚌 "
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
  cityRow: {
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
  cityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  busIconBox: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    color: '#565e74',
    letterSpacing: 0.5,
  },
  cityName: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    color: '#121c2a',
    marginTop: 2,
  },
  subText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#717786',
  },
  actionTag: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#0059bb',
    fontWeight: '600',
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
    elevation: 5,
  },
  dateCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0059bb',
    backgroundColor: '#eff4ff',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#dae2fd',
  },
  dayBadgeText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#0059bb',
  },
  dateRowBottom: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  dateVal: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#121c2a',
  },
  dateYear: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
  },
  
});

export default BusSearchCard;