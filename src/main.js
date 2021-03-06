import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import localforage from 'localforage';
import driver from './js/mongoAtlas';
import './js/polyfill';
import 'remixicon/fonts/remixicon.css';

// createApp(App).mount('#app');

const app = createApp(App);

app.use(router);
app.use(store);
app.config.globalProperties.$lf = localforage;
app.config.globalProperties.$mongo = driver;

app.mount('#app');

import './auth';

//service worker registration
import register from './service-worker/register-service-worker';

if (process.env.NODE_ENV === 'development') {
  //   console.log(`PWA Local Serve: ${process.env.VUE_APP_PWA_LOCAL_SERVE}`); // eslint-disable-line no-console
  console.log(`Node Env: ${process.env.NODE_ENV}`); // eslint-disable-line no-console
} else {
  register();
}

//failed test :c [exceeds max wake up time of worker]
// (async ()=>{
//     let { wb } = await register();

//     wb.messageSW({
//         type: 'NOTIFICATION',
//         data: {
//             title: '1 hour notification test',
//             options: {
//                 body: '1 hour notification body'
//             },
//             delay: 1 * 60 * 60 * 1000 // 1 hour test
//         }
//     });
// })();
