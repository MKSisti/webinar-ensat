import { createRouter, createWebHistory } from 'vue-router';
import store from "../store/index";
import home from '../views/home';
import profile from '../views/profile';
import post from '../views/post';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
    },
    {
      path: '/profile/:uid',
      name: 'profile',
      component: profile,
      props: true,
    },
    {
      path: '/post/:pid',
      name: 'post',
      component: post,
      props: true,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name == "post" ) {
    if (store.getters['user/getPrivLevel'] > 0) {
    next();
    }
    else{
      router.push({name:"home"});
    }
  }else{
    next();
  }
});

export default router;
