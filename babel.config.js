module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Plugin 1: react-native-dotenv
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }], // <-- The missing comma is added here!

      // Plugin 2: react-native-reanimated
      'react-native-reanimated/plugin',
    ]
  };
};

