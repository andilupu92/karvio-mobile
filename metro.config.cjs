// Learn more: https://docs.expo.dev/guides/customizing-metro/
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Provide a tiny shim for `react-dom` so packages that import `flushSync`
// (e.g. `@react-aria/utils`) can be resolved by Metro in React Native.
config.resolver = {
  ...(config.resolver || {}),
  extraNodeModules: {
    ...(config.resolver && config.resolver.extraNodeModules
      ? config.resolver.extraNodeModules
      : {}),
    // point `react-dom` imports to a local shim file
    'react-dom': path.resolve(__dirname, 'react-dom-shim.js'),
  },
};

// Ensure Metro watches project root (where the shim will live)
config.watchFolders = [...(config.watchFolders || []), path.resolve(__dirname)];

module.exports = withNativeWind(config, {
  input: './global.css',
});
