const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    resolveRequest: (context, moduleName, platform) => {
      // rpc-websockets only declares browser/node exports. Native uses the
      // browser implementation so Metro never pulls in a Node WebSocket server.
      if (moduleName === "rpc-websockets") {
        return context.resolveRequest(
          { ...context, unstable_conditionNames: ["browser", "import"] },
          moduleName,
          platform
        );
      }
      // Noble 1.x browser mappings reference crypto.js outside its exports.
      if (moduleName === "@noble/hashes/crypto" || moduleName === "@noble/hashes/crypto.js") {
        return context.resolveRequest(
          { ...context, unstable_enablePackageExports: false },
          moduleName,
          platform
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
    extraNodeModules: {
      stream: require.resolve("readable-stream"),
    },
  };

  return config;
})();
