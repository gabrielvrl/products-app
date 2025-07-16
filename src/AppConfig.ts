import { Platform, PermissionsAndroid } from 'react-native';
import notifee from '@notifee/react-native';
import { request, PERMISSIONS } from 'react-native-permissions';

export async function requestCalendarAndNotificationPermissionsOnStart() {
  const notificationStatus = await notifee.requestPermission();

  if (Platform.OS === 'android') {
    const readGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
      {
        title: 'Permissão de Calendário',
        message:
          'O app precisa acessar seu calendário para funcionar corretamente.',
        buttonPositive: 'OK',
      },
    );
    const writeGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
      {
        title: 'Permissão de Calendário',
        message:
          'O app precisa acessar seu calendário para funcionar corretamente.',
        buttonPositive: 'OK',
      },
    );
    return {
      readGranted,
      writeGranted,
      notificationStatus,
    };
  } else if (Platform.OS === 'ios') {
    const calendarStatus = await request(PERMISSIONS.IOS.CALENDARS);
    return { calendarStatus, notificationStatus };
  }
  return {
    readGranted: 'granted',
    writeGranted: 'granted',
    notificationStatus,
  };
}
