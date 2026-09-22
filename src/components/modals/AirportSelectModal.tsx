import React, { useState, useEffect, useRef } from 'react';
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
import { airportService, Airport } from '../../services';
import AppButton from '../common/AppButton';

export interface AirportSelectModalProps {
  visible: boolean;
  target: 'FROM' | 'TO';
  selectedAirport: Airport | null;
  onClose: () => void;
  onSelectAirport: (airport: Airport) => void;
}

const QUICK_CHIPS = [
  { code: 'DEL', city: 'Delhi' },
  { code: 'BOM', city: 'Mumbai' },
  { code: 'DXB', city: 'Dubai' },
  { code: 'BLR', city: 'Bengaluru' },
  { code: 'LHR', city: 'London' },
  { code: 'SIN', city: 'Singapore' },
];

export const AirportSelectModal: React.FC<AirportSelectModalProps> = ({
  visible,
  target,
  selectedAirport,
  onClose,
  onSelectAirport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [airportResults, setAirportResults] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const resultsScrollRef = useRef<ScrollView>(null);

  // Fetch initial airports when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      fetchAirports('');
    }
  }, [visible]);

  const fetchAirports = async (query: string) => {
    setLoading(true);
    resultsScrollRef.current?.scrollTo({ y: 0, animated: false });
    try {
      const list = await airportService.searchAirports(query);
      setAirportResults(list);
    } catch (err) {
      console.error('[AirportSelectModal Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: Airport) => {
    onSelectAirport({
      code: item.code || 'DEL',
      name: item.name || item.city,
      city: item.city || item.name,
      country: item.country || 'India',
    });
    onClose();
  };

  const getTerminalInfo = (code: string) => {
    switch (code) {
      case 'DEL':
        return 'Terminal 3 • International & Domestic';
      case 'BOM':
        return 'Terminal 2 • Hub';
      case 'BLR':
        return 'Terminal 1, 2';
      case 'DXB':
        return 'Terminal 3 • Emirates Concourse';
      case 'LHR':
        return 'Terminal 2, 5';
      case 'SIN':
        return 'Jewel & Terminal 3';
      default:
        return 'Terminal 1 • Domestic & Intl';
    }
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
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandleBar} />
          </View>

          {/* Header Row */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>
                Select {target === 'FROM' ? 'Departure' : 'Arrival'} Airport
              </Text>
              <Text style={styles.sheetSubtitle}>Choose city or IATA code</Text>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: '#121c2a'}}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input Bar */}
          <View style={styles.sheetSearchContainer}>
            <View style={styles.sheetInputBox}>
              {/* <Text style={{ fontSize: 16, color: '#0059bb', marginRight: 8 }}>🔍</Text> */}
              <TextInput
                style={styles.sheetInput}
                placeholder="Search city or IATA code (DEL, BOM, DXB)"
                placeholderTextColor="#565e74"
                value={searchQuery}
                onChangeText={(t) => {
                  setSearchQuery(t);
                  fetchAirports(t);
                }}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    fetchAirports('');
                  }}
                  style={styles.clearBtn}
                >
                  <Text style={{ fontSize: 12, color: '#414754' }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Location Auto-detect Pill */}
            {/* <TouchableOpacity
              style={styles.locationPill}
              onPress={() => {
                fetchAirports('DEL');
                setSearchQuery('DEL');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.locationLeft}>
                <View style={styles.locationIconBox}>
                  <Text style={{ fontSize: 14, color: '#0059bb' }}>📍</Text>
                </View>
                <View>
                  <Text style={styles.locationTitle}>Use Current Location</Text>
                  <Text style={styles.locationSub}>Near Indira Gandhi Intl • DEL</Text>
                </View>
              </View>
              <Text style={styles.detectText}>Detect ›</Text>
            </TouchableOpacity> */}
          </View>

          {/* Quick Select Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0, marginBottom: 4 }}
            contentContainerStyle={styles.chipsScroll}
          >
            {QUICK_CHIPS.map((chip) => {
              const isActive =
                searchQuery.toUpperCase() === chip.code ||
                selectedAirport?.code === chip.code;
              return (
                <TouchableOpacity
                  key={chip.code}
                  style={[styles.chipBtn, isActive && styles.chipBtnActive]}
                  onPress={() => {
                    setSearchQuery(chip.code);
                    fetchAirports(chip.code);
                  }}
                  activeOpacity={0.75}
                >
                  {/* <Text style={{ fontSize: 12, color: isActive ? '#0059bb' : '#565e74' }}>
                    🛫
                  </Text> */}
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {chip.code} - {chip.city}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Live Autocomplete Results List */}
          <ScrollView
            ref={resultsScrollRef}
            style={styles.resultsList}
            contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#0059bb" style={{ marginVertical: 20 }} />
            ) : airportResults.length === 0 ? (
              <Text style={styles.emptyText}>No matching airports found.</Text>
            ) : (
              airportResults.map((item, idx) => {
                const isSelected = selectedAirport?.code === item.code;

                return (
                  <TouchableOpacity
                    key={item.code || idx}
                    style={[
                      styles.resultCard,
                      isSelected && styles.resultCardSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.8}
                  >
                    {/* {isSelected && <View style={styles.activeStrip} />} */}

                    <View style={styles.resultLeft}>
                      {/* <View
                        style={[
                          styles.resultIconBox,
                          isSelected && { backgroundColor: '#0059bb' },
                        ]} */}
                      
                        {/* <Text style={{ fontSize: 18, color: isSelected ? '#ffffff' : '#0059bb' }}>
                          🛫
                        </Text> */}
                      {/* </View> */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={styles.cityName}>
                            {item.city || item.name}, {item.country || 'India'}
                          </Text>
                          {/* {isSelected && (
                            <View style={styles.checkCircleBox}>
                              <Text style={{ fontSize: 10, color: '#ffffff', fontWeight: '900' }}>
                                ✓
                              </Text>
                            </View>
                          )} */}
                        </View>
                        <Text style={styles.airportName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={styles.terminalTagPill}>
                          <Text style={styles.terminalTagText}>
                            {getTerminalInfo(item.code)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                      <View style={[styles.codePill, isSelected && styles.codePillSelected]}>
                        <Text style={[styles.codeText, isSelected && styles.codeTextSelected]}>
                          {item.code}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 }}>
                        <Text style={styles.countryIsoText}>
                          {item.country === 'India' || item.code === 'DEL' || item.code === 'BOM'
                            ? 'IN'
                            : item.country === 'UAE' || item.code === 'DXB'
                            ? 'AE'
                            : 'UK'}
                        </Text>
                        <Text style={styles.countrySub}>{item.country || 'India'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Confirmation Dock */}
          {selectedAirport && (
            <View style={styles.sheetDock}>
              <View style={styles.dockRecapRow}>
                <Text style={styles.recapLabel}>
                  Selected:{' '}
                  <Text style={{ color: '#121c2a', fontWeight: '700' }}>
                    {selectedAirport.city} ({selectedAirport.code})
                  </Text>
                </Text>
                <Text style={{ fontFamily: 'Inter', fontSize: 11, color: '#0059bb', fontWeight: '600' }}>
                  {target === 'FROM' ? 'Origin Airport' : 'Destination Airport'}
                </Text>
              </View>

              <AppButton
                title="Confirm Airport Selection"
                onPress={onClose}
                variant="dock"
                rightIcon={<Text style={{ fontSize: 16, color: '#ffffff' }}>→</Text>}
              />
            </View>
          )}
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
    height: '86%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    elevation: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  dragHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  sheetTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#121c2a',
  },
  sheetSubtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(217, 227, 246, 0.6)', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetSearchContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 4,
  },
  sheetInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#121c2a',
    
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  sheetInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#121c2a',
    padding: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: 'rgba(0, 89, 187, 0.2)',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 89, 187, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#0059bb',
  },
  locationSub: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#565e74',
  },
  detectText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#0059bb',
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingTop: 2,
    paddingBottom: 4,
  },
  chipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121c2a',
  },
  chipBtnActive: {
    backgroundColor: '#ebf5ff',
    borderColor: '#0059bb',
  },
  chipText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextActive: {
    color: '#0059bb',
    fontWeight: '700',
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 2,
    paddingTop: 0,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#565e74',
    marginTop: 20,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121c2a',
    marginBottom: 8,
    overflow: 'hidden',
  },
  resultCardSelected: {
    // backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: '#0059bb',
  },
  activeStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#0059bb',
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingLeft: 4,
  },
  resultIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0059bb',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  cityName: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#121c2a',
  },
  airportName: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#717786',
    marginTop: 1,
  },
  terminalTagPill: {
    alignSelf: 'flex-start',
    // backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 5,
  },
  terminalTagText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#0284c7',
  },
  codePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#e6eeff',
  },
  codePillSelected: {
    backgroundColor: '#0059bb',
    borderColor: '#0059bb',
  },
  codeText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '800',
    color: '#121c2a',
  },
  codeTextSelected: {
    color: '#ffffff',
  },
  countryIsoText: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  countrySub: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#717786',
  },
  sheetDock: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.3)',
    padding: 16,
    gap: 10,
  },
  dockRecapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recapLabel: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#565e74',
  },
});

export default AirportSelectModal;
