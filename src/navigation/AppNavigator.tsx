import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import UserHomeScreen from '../screens/UserHomeScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FlightResultsScreen from '../screens/FlightResultsScreen';
import BookingsScreen from '../screens/BookingsScreen';
import SavedTripsScreen from '../screens/SavedTripsScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import BoardingPassScreen from '../screens/BoardingPassScreen';
import BusResultsScreen from '../screens/BusResultsScreen';

// Define the root stack parameters
export type RootStackParamList = {
  Auth: undefined;
  UserHome: { user: any };
  AdminHome: { user: any };
  FlightResults: { flights: any[]; searchParams: any };
  Profile: { user: any };
  Bookings: { user: any };
  SavedTrips: { user: any };
  SeatSelection: { user?: any; flight?: any; flights?: any[] };
  BoardingPass: { bookingId?: number | string; bookingData?: any };
  BusResults: { buses: any[]; searchParams: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        {/* Dedicated Auth Stack */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="UserHome"
          component={UserHomeScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FlightResults"
          component={FlightResultsScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Bookings"
          component={BookingsScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SavedTrips"
          component={SavedTripsScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SeatSelection"
          component={SeatSelectionScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BoardingPass"
          component={BoardingPassScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen as React.ComponentType<any>}
          options={{ title: 'Admin Dashboard', headerBackVisible: false }}
        />
        <Stack.Screen
          name="BusResults"
          component={BusResultsScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
