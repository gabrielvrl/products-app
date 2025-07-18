import { useEffect } from 'react';
import { useToast } from 'contexts';
import useNetworkStatus from 'hooks/useNetworkStatus';
import { requestPermissions } from 'utils/permissions';

const useAppStartupChecks = () => {
  const isConnected = useNetworkStatus();
  const { show } = useToast();

  useEffect(() => {
    requestPermissions(show);
  }, [show]);

  useEffect(() => {
    if (!isConnected) {
      show({
        title: 'Disconnected',
        message: 'We are unable to connect to internet',
        type: 'without_network',
      });
    }
  }, [isConnected, show]);
};

export default useAppStartupChecks;
