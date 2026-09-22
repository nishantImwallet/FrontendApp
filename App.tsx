import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UserHomeScreen from './src/screens/UserHomeScreen';
import AdminHomeScreen from './src/screens/AdminHomeScreen';
import LoginWithOtpScreen from './src/screens/LoginWithOtpScreen';
import OtpLoginScreen from './src/screens/OtpLoginScreen';
import VerifyOtpScreen from './src/screens/VerifyOtpScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FlightResultsScreen from './src/screens/FlightResultsScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import SavedTripsScreen from './src/screens/SavedTripsScreen';
import SeatSelectionScreen from './src/screens/SeatSelectionScreen';
import BoardingPassScreen from './src/screens/BoardingPassScreen';
import BusResultsScreen from './src/screens/BusResultsScreen';


//Define the type of the navigation stack parameters
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Otp: undefined;
  VerifyOtp: { phoneNumber?: string } | undefined;
  UserHome: { user: any };
  AdminHome: { user: any };
  FlightResults: { flights: any[]; searchParams: any };
  Profile: { user: any };
  Bookings: { user: any };
  SavedTrips: { user: any };
  SeatSelection: { user?: any; flight?: any; flights?: any[] };
  BoardingPass: { bookingId?: number | string; bookingData?: any };
  BusResults:{buses:any[];searchParams:any}


};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BoardingPass">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen as React.ComponentType<any>} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Otp"
          component={OtpLoginScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOtp"
          component={VerifyOtpScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen as React.ComponentType<any>} 
          options={{ headerShown: false }} 
        />
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
           options={{headerShown:false}}
           />
        <Stack.Screen
          name="AdminHome"
          //headerBackVisible is set to false so that the admin cannot go back to the login screen after logging in
          //title is set to admin dashboard so that the admin knows that he is on the admin dashboard
          component={AdminHomeScreen as React.ComponentType<any>} 
          options={{ title: 'Admin Dashboard', headerBackVisible: false }} 
        />

        <Stack.Screen
        name="BusResults"
        component={BusResultsScreen as React.ComponentType<any>}
                   options={{headerShown:false}}

        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
