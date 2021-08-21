const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  pwa: {
    name: 'Webinar Ensat',
    themeColor: '#ffffff',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },
  configureWebpack: {
    plugins: [
      new WorkboxPlugin.InjectManifest({
        swDest: 'service-worker.js',
        swSrc: './src/sw.js',
        exclude: [/\.map$/, /manifest$/, /\.htaccess$/, /service-worker\.js$/, /sw\.js$/, /ads\.txt$/],
      }),
    ],
  },
};
