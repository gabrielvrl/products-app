import notifee from '@notifee/react-native';

export async function showProductNotification(
  productTitle: string,
  productId: string | number,
) {
  await notifee.requestPermission();
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
