import { NativeModules, Platform, PermissionsAndroid } from 'react-native';

const { CalendarModule, ProductCalendarModule } = NativeModules;

export async function addProductReminderToCalendar(
  title: string,
  description: string,
  timestamp: number,
  calendarId?: number,
): Promise<string> {
  if (Platform.OS === 'android') {
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
  } else if (
    Platform.OS === 'ios' &&
    ProductCalendarModule?.addPurchaseReminder
  ) {
    return ProductCalendarModule.addPurchaseReminder(title, timestamp);
  }
  return Promise.reject('Calendar module not available');
}
