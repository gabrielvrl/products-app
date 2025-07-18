import notifee from '@notifee/react-native';
import { checkIfNotificationPermissionIsGiven } from './permissions';

export async function showProductNotification(
  productTitle: string,
  productId: string | number,
) {
  const response = await checkIfNotificationPermissionIsGiven();
  if (!response) {
    return;
  }
  await notifee.displayNotification({
    title: 'Featured Product',
    body: `Check it out: ${productTitle}`,
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
    data: { productId: String(productId) },
  });
}
