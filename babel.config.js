module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          components: './src/components',
          contexts: './src/contexts',
          hooks: './src/hooks',
          'redux*': './src/redux',
          routes: './src/routes',
          screens: './src/screens',
          setups: './src/setups',
          utils: './src/utils',
        },
      },
    ],
  ],
};
