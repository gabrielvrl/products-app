import React from 'react';
import RootNavigator from 'routes/RootNavigator';
import useAppStartupChecks from 'utils/useAppStartupChecks';

const AppConfig: React.FC = () => {
  useAppStartupChecks();
  return <RootNavigator />;
};

export default AppConfig;
