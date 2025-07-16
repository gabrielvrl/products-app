import { NativeModules, Platform, PermissionsAndroid } from 'react-native';

const { CalendarModule } = NativeModules;

export function addProductReminderToCalendar(
  title: string,
  description: string,
  timestamp: number,
  calendarId?: number,
): Promise<string> {
  if (calendarId !== undefined) {
    return CalendarModule.addProductReminderToCalendar(
      title,
      description,
      timestamp,
      calendarId,
    );
  }
  return CalendarModule.addProductReminderToCalendar(
    title,
    description,
    timestamp,
  );
}

export async function getAvailableCalendars(): Promise<
  { id: number; name: string; accountName: string; accountType: string }[]
> {
  if (Platform.OS === 'android') {
    const readGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
      {
        title: 'Calendar Permission',
        message:
          'App needs access to your calendar to list available calendars.',
        buttonPositive: 'OK',
      },
    );
    const writeGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
      {
        title: 'Calendar Permission',
        message: 'App needs access to your calendar to add reminders.',
        buttonPositive: 'OK',
      },
    );
    console.log('readGranted:', readGranted, 'writeGranted:', writeGranted); // <-- Adicione aqui

    if (
      readGranted !== PermissionsAndroid.RESULTS.GRANTED ||
      writeGranted !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      throw new Error('Permission to access calendar was denied.');
    }
  }
  return CalendarModule.getAvailableCalendars();
}
