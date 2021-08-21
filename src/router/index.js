import { createRouter, createWebHistory } from 'vue-router';
// import store from "../store/index";
import home from '../views/home';
import profile from '../views/profile';
import post from '../views/post';
import adminUsers from '../views/adminUsers';

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
    {
      path: '/adminUsers',
      name: 'adminUsers',
      component: adminUsers
    },
    // //TODO: 404 view
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: '404',
    //   redirect: {name: 'home'}
    // }
  ],
});

// router.beforeEach((to, from, next) => {
//   // if (to.name == "post" ) {
//   //   if (store.getters['user/getPrivLevel'] > 0) {
//   //   next();
//   //   }
//   //   else{
//   //     router.push({name:"home"});
//   //   }
//   // }else{
//   //   next();
//   // }
//   next();
// });

export default router;
