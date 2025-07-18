import { NativeModules } from 'react-native';

const { ProductCalendarModule } = NativeModules;

export function addPurchaseReminder(
  title: string,
  date: number,
): Promise<string> {
  return ProductCalendarModule.addPurchaseReminder(title, date);
}
