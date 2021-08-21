import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

// createApp(App).mount('#app');

const app = createApp(App);

app.use(router);
app.use(store);

app.mount("#app");

import "./auth";
import register from './service-worker/register-service-worker'
register()

if (process.env.NODE_ENV === 'development' || process.env.VUE_APP_PWA_LOCAL_SERVE === 'true') {
  console.log(`PWA Local Serve: ${process.env.VUE_APP_PWA_LOCAL_SERVE}`) // eslint-disable-line no-console
  console.log(`Node Env: ${process.env.NODE_ENV}`) // eslint-disable-line no-console
}
