let notifee: any = null;
let AndroidImportance: any = null;

try {
  const notifeeModule = require('@notifee/react-native');
  notifee = notifeeModule.default || notifeeModule;
  AndroidImportance = notifeeModule.AndroidImportance;
} catch (e) {
  console.warn('[NotificationService] Notifee native module not linked yet. Please rebuild the app with npm run android.');
}

export const notificationService = {
  // 1. Notification Permission
  async requestPermission() {
    try {
      if (notifee && typeof notifee.requestPermission === 'function') {
    await notifee.requestPermission();
      }
    } catch (error) {
      console.warn('[Notification Permission Warning]: Native module not built yet.', error);
    }
  },

  // 2. Flight Booking Confirm hone par Status Bar me Push Notification
  async sendFlightBookingNotification(pnr: string, seat: string, flightNumber: string) {
    try {
      if (!notifee) {
        console.warn('[Notification Warning] App needs to be rebuilt with "npm run android" for status bar notifications.');
        return;
      }

      // Android Notification Channel banate hain
    const channelId = await notifee.createChannel({
        id: 'flight_bookings_channel',
        name: 'Flight Bookings',
        importance: AndroidImportance?.HIGH ?? 4,
      sound: 'default',
      vibration: true,
    });

      // Mobile ke Status Bar me notification phenkte hain
    await notifee.displayNotification({
      title: '✈️ Flight Booking Confirmed!',
        body: `Flight ${flightNumber} confirmed! Seat: ${seat} | PNR: ${pnr}`,
      android: {
        channelId,
          smallIcon: 'ic_launcher',
        color: '#0059bb',
        pressAction: {
            id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });
    } catch (error) {
      console.warn('[Send Notification Warning]:', error);
    }
  },
};
