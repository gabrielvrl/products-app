import { Platform, PermissionsAndroid } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import notifee from '@notifee/react-native';

const requestCalendarPermission = async (show: (params: any) => void) => {
  if (Platform.OS === 'ios') {
    const status = await request(PERMISSIONS.IOS.CALENDARS);
    if (status !== RESULTS.GRANTED) {
      show({
        title: 'Permission denied',
        message: 'Enable calendar access in settings to use reminders.',
        type: 'warning',
      });
      return false;
    }
    return true;
  } else {
    const readGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
    );
    const writeGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
    );
    if (
      readGranted !== PermissionsAndroid.RESULTS.GRANTED ||
      writeGranted !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      show({
        title: 'Permission denied',
        message: 'Enable calendar access in settings to use reminders.',
        type: 'warning',
      });
      return false;
    }
    return true;
  }
};

const requestNotificationPermission = async (show: (params: any) => void) => {
  const current = await notifee.getNotificationSettings();
  if (current.authorizationStatus !== 1) {
    const settings = await notifee.requestPermission();
    if (!settings.authorizationStatus || settings.authorizationStatus !== 1) {
      show({
        title: 'Permission denied',
        message: 'Enable notifications in settings to receive reminders.',
        type: 'warning',
      });
      return false;
    }
    return true;
  }
  return true;
};

export const requestPermissions = async (
  show: (params: any) => void,
): Promise<void> => {
  await requestCalendarPermission(show);
  await requestNotificationPermission(show);
};

export const checkIfNotificationPermissionIsGiven =
  async (): Promise<boolean> => {
    try {
      const settings = await notifee.getNotificationSettings();
      return settings.authorizationStatus === 1;
    } catch (error) {
      return false;
    }
  };
