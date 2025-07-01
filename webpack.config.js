// @ts-nocheck
/* eslint-disable @typescript-eslint/no-require-imports */
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Set the public path for GitHub Pages
  config.output.publicPath = '/light-up/';

  return config;
};
