module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/*.spec.ts?(x)'],
  moduleNameMapper: {
    '^components$': '<rootDir>/src/components/index.ts',
    '^contexts$': '<rootDir>/src/contexts/index.ts',
    '^styles$': '<rootDir>/src/styles/index.ts',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-native-permissions' +
      '|react-native-reanimated' +
      '|react-native-gesture-handler' +
      '|react-native-webview' +
      '|react-native-collapsible' +
      '|react-native-modal' +
      '|react-native-linear-gradient' +
      '|react-native-animatable' +
      '|react-clone-referenced-element' +
      '|framework-ui' +
      ')/)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
