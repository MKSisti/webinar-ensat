const WorkboxPlugin = require('workbox-webpack-plugin');
var WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

if (process.env.NODE_ENV === 'production')
  module.exports = {
    pwa: {
      name: 'Webinar Ensat',
      themeColor: '#ffffff',
      msTileColor: '#000000',
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      manifestOptions: {
        start_url: '/',
      },
    },
    configureWebpack: {
      plugins: [
        new WorkboxPlugin.InjectManifest({
          swDest: 'service-worker.js',
          swSrc: './src/sw.js',
          exclude: [/\.map$/, /manifest$/, /\.htaccess$/, /service-worker\.js$/, /sw\.js$/, /ads\.txt$/],
          mode: 'production',
        }),
        new WebpackPwaManifest({
          name: 'Webinar ENSAT',
          short_name: 'Web ENSAT',
          description: 'Post and follow webinars',
          background_color: '#ffffff',
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
