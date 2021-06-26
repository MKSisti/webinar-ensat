import { createRouter, createWebHistory } from "vue-router";
// import store from "../store";
import home from "../views/home.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: home,
    },
  ],
});

// router.beforeEach((to, from, next) => {
// });

export default router;
