import { Button } from 'react-native';

import { act, fireEvent, render } from '@testing-library/react-native';
import { ToastProvider, useToast } from 'contexts';

const TestComponent = ({
  isDismissible,
  autoDismiss,
  position,
}: {
  isDismissible: boolean;
  autoDismiss: boolean;
  position: 'top' | 'bottom';
}) => {
  const { show } = useToast();

  return (
    <Button
      title="Show Toast"
      onPress={() =>
        show({
          title: `Test Title - ${position}`,
          message: `This is a test toast at ${position}`,
          position,
          autoDismiss,
          isDismissible,
          type: 'success',
        })
      }
    />
  );
};

describe('ToastProvider', () => {
  jest.useFakeTimers();

  it('renders toast when show is called', () => {
    const { getByText, queryByText } = render(
      <ToastProvider>
        <TestComponent
          isDismissible={true}
          autoDismiss={false}
          position="top"
        />
      </ToastProvider>,
    );

    expect(queryByText('Test Title - top')).toBeNull();

    fireEvent.press(getByText('Show Toast'));

    expect(getByText('Test Title - top')).toBeTruthy();
    expect(getByText('This is a test toast at top')).toBeTruthy();
  });

  it('hides toast when dismiss button is pressed', async () => {
    const { getByText, queryByText, queryByTestId } = render(
      <ToastProvider>
        <TestComponent
          isDismissible={true}
          autoDismiss={false}
          position="bottom"
        />
      </ToastProvider>,
    );

    fireEvent.press(getByText('Show Toast'));

    expect(getByText('Test Title - bottom')).toBeTruthy();

    const closeButton = queryByTestId('toastCloseButtonTestID');
    if (closeButton) {
      fireEvent.press(closeButton);
    }

    await act(async () => {
      jest.runAllTimers();
    });

    expect(queryByText('Test Title - bottom')).toBeNull();
  });

  it('auto-dismisses toast after timeout', async () => {
    const { getByText, queryByText } = render(
      <ToastProvider>
        <TestComponent
          isDismissible={false}
          autoDismiss={true}
          position="top"
        />
      </ToastProvider>,
    );

    fireEvent.press(getByText('Show Toast'));

    expect(getByText('Test Title - top')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(8000);
    });

    expect(queryByText('Test Title - top')).toBeNull();
  });
});
