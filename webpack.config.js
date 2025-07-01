// @ts-nocheck
/* eslint-disable @typescript-eslint/no-require-imports */
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Only set the public path for production builds (GitHub Pages)
  if (process.env.NODE_ENV === 'production') {
    config.output.publicPath = '/light-up/';
  }

  return config;
};
