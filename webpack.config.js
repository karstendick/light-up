// @ts-nocheck
/* eslint-disable @typescript-eslint/no-require-imports */
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Set the public path for GitHub Pages
      locations: {
        ...env.locations,
        publicPath: '/light-up/',
      },
    },
    argv
  );

  return config;
};
