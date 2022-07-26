
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.plugins = [];
      return webpackConfig;
    },
  },
};
