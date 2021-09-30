/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precacheAndRoute(self.__WB_MANIFEST);

// cleans up cache that is outdated because of a previous version of Workbox.
cleanupOutdatedCaches();

// Get index.html from network first.
registerRoute(
  /(\/|\.html)$/,
  new NetworkFirst({
    cacheName: 'html',
  })
);

// Cache CSS and JS requests with a Stale While Revalidate strategy
registerRoute(
  // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  // Use a Stale While Revalidate caching strategy
  new StaleWhileRevalidate({
    // Put all cached files in a cache named 'assets'
    cacheName: 'assets',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/img/icons/'),
  new CacheFirst({
    cacheName: 'icons',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// //Cache images with a Cache First strategy
// registerRoute(
//   // Check to see if the request's destination is style for an image
//   ({ request }) => request.destination === 'image',
//   // Use a Cache First caching strategy
//   new CacheFirst({
//     // Put all cached files in a cache named 'images'
//     cacheName: 'images',
//     plugins: [
//       // Ensure that only requests that result in a 200 status are cached
//       new CacheableResponsePlugin({
//         statuses: [200]
//       }),
//       // Don't cache more than 50 items, and expire them after 30 days
// new ExpirationPlugin({
//   maxEntries: 50,
//   maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
// })
//     ]
//   })
// )

registerRoute(
  ({ url }) => url.origin.includes('googleusercontent.com'),
  new CacheFirst({
    cacheName: 'avatar-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 15, // 15 Days
      }),
    ],
  })
);

self.addEventListener('message', async (event) => {
  //console.log('sw root: message event listener hit.');
  switch (event.data && event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      // console.log('sw root: message SKIP_WAITING called.');
      break;
    case 'NOTIFICATION_GRANTED':
      //console.log('sw root: notification permission granted');
      break;
    case 'NOTIFICATION':
      // console.log('sw root: dispatching notification');
      event.waitUntil(dispatchNotification(event.data.data.title, event.data.data.options, event.data.data.delay));
      break;
  }
});

self.addEventListener('fetch', (event) => {
  //console.log('sw root: fetch event listener hit.');
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag == 'sync') {
    event.waitUntil(() => {});
  }
});

//sw utils
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dispatchNotification(title, options, delay) {
  const timestamp = new Date().getTime() + delay;
  if ('showTrigger' in Notification.prototype) {
    options.tag = timestamp;
    options.showTrigger = new TimestampTrigger(timestamp);
    self.registration.showNotification(title, options);
    return true;
  } else {
    // console.log('dispatching notification in:', delay + 'ms');
    await wait(delay);
    await self.registration.showNotification(title, options);
    return true;
  }
}
