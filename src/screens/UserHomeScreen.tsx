import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { airportService, flightService, bookingService, Airport, busService } from '../services';
import { FlightSearchCard, AirportSelectModal, BusCitySelectModal } from '../components';
import { BusSearchCard } from '../components/cards/BusSearchCard';


export default function UserHomeScreen({ navigation, route }: any) {

  const user = route?.params?.user;
  const [userName, setUserName] = useState(user?.firstName || user?.name || 'Nishant Tyagi');
    const [tripType, setTripType] = useState<'round' | 'oneWay' | 'multi'>('round');
  const defaultFrom: Airport = { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' };
  const defaultTo: Airport = { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', country: 'India' };

  const [fromAirport, setFromAirport] = useState<Airport>(defaultFrom);
  const [toAirport, setToAirport] = useState<Airport>(defaultTo);
  const [isSearching, setIsSearching] = useState(false);
   
  
  // Bottom Sheet Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingTarget, setSelectingTarget] = useState<'FROM' | 'TO'>('FROM');
  const [selectedAirport, setSelectedAirport] = useState<any>(null);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  //state variable related to the bus search card.
   const [travelMode, setTravelMode] = useState<'flight' | 'bus'>('bus');
   const [fromBusCity, setFromBusCity] = useState('Delhi');
   const [toBusCity, setToBusCity] = useState('Jaipur');
   const [isBusModalOpen, setIsBusModalOpen] = useState(false);
   const [busModalTarget, setBusModalTarget] = useState<'FROM' | 'TO'>('FROM')
   const [isSearchingBus, setIsSearchingBus] = useState(false);



  useEffect(() => {
    loadInitialAirports();
  }, []);

  const loadInitialAirports = async () => {
    try {
      const [listDel, listBom] = await Promise.all([
        airportService.searchAirports('DEL'),
        airportService.searchAirports('BOM'),
      ]);

      if (listDel.length > 0) {
        setFromAirport({
          code: listDel[0].code || 'DEL',
          name: listDel[0].name || 'Indira Gandhi International Airport',
          city: listDel[0].city || 'Delhi',
          country: listDel[0].country || 'India',
        });
      }
      if (listBom.length > 0) {
        setToAirport({
          code: listBom[0].code || 'BOM',
          name: listBom[0].name || 'Chhatrapati Shivaji Maharaj Intl',
          city: listBom[0].city || 'Mumbai',
          country: listBom[0].country || 'India',
        });
      }
    } catch (err) {
      console.error('[BACKEND AIRPORT FETCH ERROR]', err);
    }
  };

  const openModalFor = (target: 'FROM' | 'TO') => {
    setSelectingTarget(target);
    setSelectedAirport(target === 'FROM' ? fromAirport : toAirport);
    setIsModalOpen(true);
  };

  const handleSelectAirport = (airport: any) => {
    const formatted: Airport = {
      code: airport.code || 'DEL',
      name: airport.name || airport.city,
      city: airport.city || airport.name,
      country: airport.country || 'India',
    };
    setSelectedAirport(formatted);
    if (selectingTarget === 'FROM') {
      setFromAirport(formatted);
    } else {
      setToAirport(formatted);
    }
    setIsModalOpen(false);
  };
  const openBusModalFor = (target: 'FROM' | 'TO') => {
    setBusModalTarget(target);
    setIsBusModalOpen(true);
  };

  const handleSelectBusCity = (city: string) => {
    if (busModalTarget === 'FROM') {
      setFromBusCity(city);
    } else {
      setToBusCity(city);
    }
    setIsBusModalOpen(false);
  };



  const handleSwapRoute = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
};

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const handleSearchFlight = async () => {
    if (!fromAirport.code || !toAirport.code) {
      Alert.alert('Missing Input', 'Please select both departure and arrival airports.');
      return;
    }
    setIsSearching(true);
    try {
      const originCode = fromAirport.code;
      const destinationCode = toAirport.code;
      const flightDate = '2026-10-15';

      const flightList = await flightService.searchFlights({
        origin: originCode,
        destination: destinationCode,
        date: flightDate,
      });

      console.log('[FLIGHT SEARCH RESULTS TOTAL]:', flightList.length);

      // Navigate to FlightResults dummy screen with payload
      navigation.navigate('FlightResults', {
        flights: flightList,
        user,
        searchParams: {
          origin: originCode,
          destination: destinationCode,
          date: flightDate,
          tripType,
        },
      });
    } catch (error) {
      console.error('Error fetching flight data:', error);
      Alert.alert('Error', 'Unable to fetch flight data from backend.');
    } finally {
      setIsSearching(false);
    }
  };
  const handleSwapBusRoute = () => {
  const temp = fromBusCity;
  setFromBusCity(toBusCity);
  setToBusCity(temp);
  };




const handleSearchBus = async() => {
   if (!fromBusCity || !toBusCity) {
    Alert.alert('Selection Required', 'Please select both source and destination cities.');
    return;
  }

  
  if (fromBusCity.toLowerCase() === toBusCity.toLowerCase()) {
    Alert.alert('Invalid Route', 'Source and Destination cannot be the same city.');
    return;
  }
  
  const travelDate = '2026-10-20';
  
  try{
    const buslist = await busService.searchBuses({
     origin:fromBusCity,
     destination:toBusCity,
     date:travelDate
     })

console.log("This is the respone coming from the bus search api",buslist.length);
navigation.navigate('BusResults', {
        buses: buslist,
        user,
        searchParams: {
          origin: fromBusCity,
          destination: toBusCity,
          date: travelDate,
          tripType,
        },
      });

  }
  catch(error)
  {
 console.log("Error in searching the bus here",error);
  }
};


// const handleSearchBus = async () => {
  // 1. Validation check
  // if (!fromBusCity || !toBusCity) {
  //   Alert.alert('Selection Required', 'Please select both source and destination cities.');
  //   return;
  // }

  // if (fromBusCity.toLowerCase() === toBusCity.toLowerCase()) {
  //   Alert.alert('Invalid Route', 'Source and Destination cannot be the same city.');
  //   return;
  // }

  // try {
  //   // 2. Loading state on karo
  //   setIsSearchingBus(true);

  //   const travelDate = '2026-10-15'; // Ya jo state me selected date ho

  //   // 3. API Call karo
  //   const busList = await busService.searchBuses({
  //     origin: fromBusCity,
  //     destination: toBusCity,
  //     date: travelDate,
  //   });

  //   console.log('[BUS SEARCH RESULTS TOTAL]:', busList.length);

    // 4. Result Screen par navigate karo data pass karke
    // navigation.navigate('BusResults', {
    //   buses: busList,
    //   user,
    //   searchParams: {
    //     origin: fromBusCity,
    //     destination: toBusCity,
    //     date: travelDate,
    //   },
    // });

//   } catch (error) {
//     console.error('Error fetching bus data:', error);
//     Alert.alert('Error', 'Unable to fetch bus data from backend.');
//   } finally {
//     // 5. Loading band karo
//     setIsSearchingBus(false);
//   }
// };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Text style={styles.title}>Welcome to your user dashboard</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
        <Text style={styles.logoutText}>Logout</Text> */}

         <View style={styles.header}>
        <View style={styles.userInfoRow}>
          <View style={styles.avatarBorder}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMNPLod4bURb0NrSRB-i5seZ_D_OGnCKQl4gaeGbltiOs8ucUmlKqOD-apO9YzaBX3z-oramzHabXOggqok8bZMLuMSv95G8D8tyn8ITaCT8rwPZlKKUAOnS-5tKJ-LmTyCpQxgu9nU613TH_o-u32mWBCJfdnzDVWaWrN9RfXZ7lCPPgNwRMmys7BXzdcAliwOKcITqWUcgcmKDLduY9etCoKkwQwENq9i1uWk7OymJDJUye62RrL' }}
              style={styles.avatarImg}
            />
          </View>
          <Text style={styles.brandTitle}>FlyGo</Text>
        </View>
         <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Text style={{ fontSize: 18, color: '#121c2a' }}>🔔</Text>
          <View style={styles.notifDot} />
        </TouchableOpacity>
        </View>
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
         <View style={styles.greetingSection}>
          <Text style={styles.greetingSub}>Good afternoon, {userName}</Text>
          <Text style={styles.greetingTitle}>
            {travelMode === 'flight' ? 'Where will you fly?' : 'Want to book bus?'}
          </Text>
          <Text style={styles.greetingDesc}>
            {travelMode === 'flight' ? 'Find and book your perfect flight' : 'Book comfortable intercity bus tickets'}
          </Text>
        </View>
        <View style={styles.modeSwitchRow}>
          <TouchableOpacity
            style={styles.modeBtn}
            onPress={() => setTravelMode('flight')}
            activeOpacity={0.6}
          >
            <Text style={[styles.modeBtnText, travelMode === 'flight' && styles.modeBtnTextActive]}>
              Flights
            </Text>
          </TouchableOpacity>
          <Text style={styles.tabDivider}>|</Text>
          <TouchableOpacity
            style={styles.modeBtn}
            onPress={() => setTravelMode('bus')}
            activeOpacity={0.6}
          >
            <Text style={[styles.modeBtnText, travelMode === 'bus' && styles.modeBtnTextActive]}>
              Buses
            </Text>
          </TouchableOpacity>
        </View>
        {/* 🌟 2. YAHAN CARD SWITCH HOGA (Conditional Rendering) */}
        {travelMode === 'flight' ? (
          <FlightSearchCard
            tripType={tripType}
            onChangeTripType={setTripType}
            fromAirport={fromAirport}
            toAirport={toAirport}
            onSelectFrom={() => openModalFor('FROM')}
            onSelectTo={() => openModalFor('TO')}
            onSwapRoute={handleSwapRoute}
            onSearch={handleSearchFlight}
            isSearching={isSearching}
          />
        ) : (
           <BusSearchCard
              fromCity={fromBusCity}
              toCity={toBusCity}
              onSelectFrom={() => openBusModalFor('FROM')}
              onSelectTo={() => openBusModalFor('TO')}
              onSwapRoute={handleSwapBusRoute}
              onSearch={handleSearchBus}
              isSearching={isSearchingBus}
          />
         )}

        </ScrollView>

        {/* Fixed Bottom Tab Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={{ fontSize: 18, color: '#0059bb' }}>🧭</Text>
            <Text style={[styles.navLabel, { color: '#0059bb', fontWeight: '700' }]}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Bookings', { user })}>
            <Text style={{ fontSize: 18, color: '#565e74' }}>🎟</Text>
            <Text style={styles.navLabel}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SavedTrips', { user })}>
            <Text style={{ fontSize: 18, color: '#565e74' }}>🔖</Text>
            <Text style={styles.navLabel}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile', { user })}>
            <Text style={{ fontSize: 18, color: '#565e74' }}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

      {/* AIRPORT SELECTOR BOTTOM SHEET MODAL */}
      <AirportSelectModal
        visible={isModalOpen}
        target={selectingTarget}
        selectedAirport={selectedAirport}
        onClose={() => setIsModalOpen(false)}
        onSelectAirport={handleSelectAirport}
      />

      {/* BUS CITY SELECTOR BOTTOM SHEET MODAL */}
      <BusCitySelectModal
        visible={isBusModalOpen}
        target={busModalTarget}
        selectedCity={busModalTarget === 'FROM' ? fromBusCity : toBusCity}
        onClose={() => setIsBusModalOpen(false)}
        onSelectCity={handleSelectBusCity}
      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    marginTop: 30,
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#f8f9ff',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBorder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#0059bb',
    borderWidth: 1,
    borderColor: '#121c2a',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    color: '#0059bb',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121c2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ba1a1a',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  greetingSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  greetingSub: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
  },
  greetingTitle: {
    fontFamily: 'Inter',
    fontSize: 26,
    fontWeight: '700',
    color: '#121c2a',
    marginTop: 2,
  },
  greetingDesc: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
    marginTop: 2,
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
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
    padding: 8,
    borderRadius: 12,
  },
  airportLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  planeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    color: '#717786',
  },
  swapDividerRow: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.5)',
    backgroundColor: '#ffffff',
  },
  departureDatePill: {
    borderColor: 'rgba(0, 112, 234, 0.4)',
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
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#eff4ff',
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
  searchBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0070ea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    elevation: 4,
  },
  searchBtnText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.5)',
  },
  filterText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: '#121c2a',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#121c2a',
  },
  viewAllText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#0070ea',
  },
  destinationsScroll: {
    gap: 14,
  },
  destCard: {
    width: 240,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
  },
  destImgWrapper: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  destImg: {
    width: '100%',
    height: '100%',
  },
  badgePill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(39, 49, 63, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: '#ffffff',
  },
  destMetaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  destTitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '700',
    color: '#121c2a',
  },
  destSub: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#565e74',
  },
  fromText: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: '#565e74',
  },
  priceText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#0070ea',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    marginBottom:10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
  },
  navLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#565e74',
  },
  // Bottom Sheet Modal Styles
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
    borderColor: 'rgba(193, 198, 215, 0.7)',
    borderRadius: 12,
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
  sheetSectionHeader: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 2,
  },
  sheetSectionTitle: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#565e74',
    letterSpacing: 0.8,
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
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.6)',
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
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
    marginBottom: 8,
    overflow: 'hidden',
  },
  resultCardSelected: {
    backgroundColor: '#eff4ff',
    borderWidth: 2,
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
    backgroundColor: '#dbeafe',
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
  dockConfirmBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0059bb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
  },
  dockConfirmText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  modeSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  modeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tabDivider: {
    fontSize: 16,
    color: '#c1c6d7',
    fontWeight: '300',
    marginHorizontal: 4,
  },
  modeBtnText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: '#717786',
  },
  modeBtnTextActive: {
    color: '#0059bb',
    fontWeight: '700',
  },
});

