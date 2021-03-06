import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index';
import home from '../views/home';
import profile from '../views/profile';
import post from '../views/post';
import adminUsers from '../views/adminUsers';
import changePriv from '../views/changePriv';
import postsDash from '../views/postsDash';
import dashHome from '../views/dashHome';
import userPosts from '../views/userPosts';
import feed from '../views/feed';
import notFound from '../views/404';
import error from '../views/error';

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
      children: [
        { path: '', component: userPosts, props: true },
        {
          path: 'feed',
          name: 'feed',
          component: feed,
          props: true,
          beforeEnter: (to, from, next) => {
            if (store.getters['user/getuid'] != to.params.uid) {
              next('/profile/' + to.params.uid);
            } else {
              next();
            }
          },
        },
      ],
    },
    {
      path: '/post/:pid',
      name: 'post',
      component: post,
      props: true,
    },
    {
      path: '/adminUsers',
      name: 'adminUsers',
      component: dashHome,
      children: [
        { path: '', meta: { requiresAuth: true }, component: adminUsers },
        {
          path: 'postsDash',
          meta: { requiresAuth: true },
          component: postsDash,
        },
        {
          path: 'changePriv',
          meta: { requiresAuth: true },
          component: changePriv,
        },
      ],
    },
    //TODO: 404 view
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: notFound,
    },
    {
      path: '/error/:err',
      name: 'error',
      component: error,
      props: true,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth) {
    if (store.getters['user/getPrivLevel'] > 1) {
      next();
    } else {
      next({ name: 'home' });
    }
  } else {
    next();
  }
});

export default router;
