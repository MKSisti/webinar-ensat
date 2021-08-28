const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  pwa: {
    name: 'Webinar Ensat',
    shortName: 'Web Ensat',
    themeColor: '#ffffff',
    msTileColor: '#000000',
    manifestOptions: {
      start_url: '/',
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
  },
  configureWebpack: {
    plugins: [
      new WebpackPwaManifest({
        name: 'Webinar ENSAT',
        short_name: 'Web ENSAT',
        description: 'Post and follow webinars',
        background_color: defaultTheme.colors.gray[50],
        theme_color: defaultTheme.colors.red[300],
        crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
        icons: [
          {
            src: path.resolve('./public/img/icons/icon.png'),
            sizes: [16, 32, 60, 76, 120, 144, 150, 152, 180, 192, 512], // multiple sizes
          },
          {
            src: path.resolve('./public/img/icons/maskable-icon.png'),
            size: '512x512',
            purpose: 'maskable',
          },
        ],
      }),
    ],
  },
};
