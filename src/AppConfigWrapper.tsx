import React from 'react';
import RootNavigator from 'routes/RootNavigator';
import useAppStartupChecks from 'hooks/useAppStartupChecks';

const AppConfig: React.FC = () => {
  useAppStartupChecks();
  return <RootNavigator />;
};

export default AppConfig;
