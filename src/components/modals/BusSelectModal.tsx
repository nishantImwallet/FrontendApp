import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { busService } from '../../services';

export interface BusSelectModalProps {
  visible: boolean;
  target: 'FROM' | 'TO';
  selectedCity: string;
  onClose: () => void;
  onSelectCity: (city: string) => void;
}

const DEFAULT_POPULAR_CITIES = [
  'Delhi',
  'Jaipur',
  'Bengaluru',
  'Goa',
  'Mumbai',
  'Pune',
  'Manali',
  'Agra',
];

export const BusCitySelectModal: React.FC<BusSelectModalProps> = ({
  visible,
  target,
  selectedCity,
  onClose,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<string[]>(DEFAULT_POPULAR_CITIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      fetchCities('');
    }
  }, [visible]);

  const fetchCities = async (query: string) => {
    setLoading(true);
    try {
      const fetchedCities = await busService.searchCities(query);
      if (fetchedCities && fetchedCities.length > 0) {
        setCities(fetchedCities);
      } else {
        // Fallback to filtering the local list
        const filtered = DEFAULT_POPULAR_CITIES.filter((c) =>
          c.toLowerCase().includes(query.toLowerCase())
        );
        setCities(filtered);
      }
    } catch (err) {
      console.log('[BusCitySelectModal]: Falling back to default cities', err);
      const filtered = DEFAULT_POPULAR_CITIES.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase())
      );
      setCities(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (city: string) => {
    onSelectCity(city);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.bottomSheetContainer}>
          {/* Drag Handle Bar */}
          <View style={styles.dragHandleBar} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>
                Select {target === 'FROM' ? 'Boarding' : 'Destination'} City
              </Text>
              <Text style={styles.sheetSub}>Choose an intercity bus terminal</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input Box */}
          <View style={styles.searchBoxWrapper}>
            <Text style={{ fontSize: 16 }}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city (Delhi, Jaipur, Goa...)"
              placeholderTextColor="#717786"
              value={searchQuery}
              onChangeText={(t) => {
                setSearchQuery(t);
                fetchCities(t);
              }}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  fetchCities('');
                }}
              >
                <Text style={{ fontSize: 14, color: '#717786' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Filter Chips */}
          <View style={styles.chipsRow}>
            {DEFAULT_POPULAR_CITIES.slice(0, 5).map((chipCity) => {
              const isActive =
                selectedCity?.toLowerCase() === chipCity.toLowerCase() ||
                searchQuery.toLowerCase() === chipCity.toLowerCase();
              return (
                <TouchableOpacity
                  key={chipCity}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => {
                    setSearchQuery(chipCity);
                    fetchCities(chipCity);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {chipCity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Results List */}
          <ScrollView
            style={styles.resultsScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="small" color="#0070ea" />
              </View>
            ) : cities.length === 0 ? (
              <View style={styles.centerBox}>
                <Text style={styles.emptyText}>No bus routes found for this query.</Text>
              </View>
            ) : (
              cities.map((item) => {
                const isSelected =
                  selectedCity?.toLowerCase() === item.toLowerCase();
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.cityRowItem, isSelected && styles.cityRowSelected]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cityRowLeft}>
                      <View
                        style={[
                          styles.busIconBadge,
                          isSelected && styles.busIconBadgeSelected,
                        ]}
                      >
                        <Text style={{ fontSize: 16 }}>🚌</Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.cityNameText,
                            isSelected && styles.cityNameSelected,
                          ]}
                        >
                          {item}
                        </Text>
                        <Text style={styles.citySubText}>Popular Intercity Hub</Text>
                      </View>
                    </View>

                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>
                          ✓
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: '80%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    paddingHorizontal: 20,
    elevation: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c1c6d7',
    alignSelf: 'center',
    marginVertical: 6,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  sheetTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#121c2a',
  },
  sheetSub: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: '#565e74',
    fontWeight: '600',
  },
  searchBoxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f4fb',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#121c2a',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f4fb',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
  },
  chipActive: {
    backgroundColor: '#0070ea',
    borderColor: '#0070ea',
  },
  chipText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#565e74',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  resultsScroll: {
    flex: 1,
  },
  cityRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  cityRowSelected: {
    backgroundColor: '#eff4ff',
  },
  cityRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  busIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f4fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busIconBadgeSelected: {
    backgroundColor: '#dae2fd',
  },
  cityNameText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: '#121c2a',
  },
  cityNameSelected: {
    color: '#0059bb',
    fontWeight: '700',
  },
  citySubText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#717786',
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0070ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#717786',
  },
});

export default BusCitySelectModal;
