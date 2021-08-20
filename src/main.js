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

import "./js/emailClient"