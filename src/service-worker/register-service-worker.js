/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Workbox } from 'workbox-window';
import localforage from 'localforage';

// Checks for updates every hour. When an update is found, the app-auto-update component and use-service-worker composable
// handles the actual updating.
const autoUpdate = async (registration) => {
  const updateInterval = 1000 * 60 * 60; // 1 hour
  // const updateInterval = 1000 * 60 // 1 min // for debugging
  setInterval(async () => {
    try {
      /* eslint-disable-next-line no-unused-expressions */
      await registration?.update();
      console.log('sw: registration checked for updates');
    } catch (err) {
      console.log(`sw: registration failed to check for updates with errors: ${err}`);
    }
  }, updateInterval);
};

// Emits an event that the use-service-worker composable is listens to. Then the app-manual-update is controlled by
// a property on the composable and prompts the user to update.
const manualUpdateAvailable = (wb) => {
  // Wires up an event that we can listen to in the app. Example: listen for available update and prompt user to update.
  console.log('sw: manualUpdateAvailable dispatching event');
  document.dispatchEvent(new CustomEvent('swUpdated', { detail: wb }));
};

const register = async () => {
  if ('serviceWorker' in navigator) {
    // Workbox combines the ./src/sw.js file and injected manifest into the servicer-worker.js file in /dist
    // Uses vue.config.js workboxOptions.swSrc for the location of sw.js and swDest for the output location of 'service-worker.js'.
    // You can override the file names and locations by changing the values of workboxOptions in vue.config.js.
    const wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);

    // wire up instance of registration so we can take further action on it.
    const registration = await wb.register();
    console.log('sw: registered');

    autoUpdate(registration);

    wb.addEventListener('activated', async (event) => {
      console.log('sw: activated event listener hit.');
      if (event.isUpdate) {
        // event.isUpdate=true means the service worker was already registered and there is a new version available.
        wb.messageSkipWaiting();
      } else {
        // first time use when event.isUpdate = false
        // service worker should claim the client immediately since its the first install.
        wb.messageSW({ type: 'CLIENTS_CLAIM' });
        console.log('sw: clientsClaim called.');
      }
    });

    wb.addEventListener('installed', (event) => {
      console.log('sw: installed event listener hit.');
    });

    wb.addEventListener('waiting', (event) => {
      console.log('sw: waiting event listener hit.');
      if (event.isUpdate) {
        manualUpdateAvailable(wb);
      }
    });

    wb.addEventListener('controlling', (event) => {
      console.log('sw: controlling event listener hit.');
    });

    Notification.requestPermission(function(result) {
      if (result === 'granted') {
        wb.messageSW({
          type: 'NOTIFICATION_GRANTED',
        });
      }
    });

    //for actions that need service worker registration to be installed, get wether the app
    //is setting up for the first time, if so refreshe app to get the up to date registration
    let firstTime = await localforage.getItem('firstTime');
    
    if(firstTime === 1) await localforage.setItem('firstTime', 2);

    if (firstTime === null) {
      await localforage.setItem('firstTime', 1);
      window.location.reload();
    }

    //get permission to run periodic background sync
    try {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
      });
      if (status.state === 'granted') {
        await registration.periodicSync.register('sync', {
          minInterval: 24 * 60 * 60 * 1000,
        });
        console.log('period background sync active');
      }
    } catch (e) {
      console.warn('Periodic Sync could not be registered!', e);
    }
    return { registration, wb };
  }
};

export default register;
