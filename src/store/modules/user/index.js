import { users } from "../../../firebase";
import {getFollowingList, getFollowersList} from '../../../js/dbActions'

export default {
  namespaced: true,
  state() {
    return {
      //basic user info (name, email, uid, img)
      userInfo: {},
      isLoggedIn: false,
      privLevel: -99,
      token: null,
      followers: [],
      following:[],
    };
  },
  mutations: {
    setUser(state, user) {
      state.isLoggedIn = true;
      state.userInfo = {
        userName: user.displayName,
        email: user.email,
        uid: user.uid,
        img: user.photoURL,
      };
      user?.number ? state.userInfo['number'] = user.number : null;   
      user?.uni ? state.userInfo['uni'] = user.uni : null;   
      state.privLevel = user.priv;
    },

    clearUser(state) {
      state.userInfo = {};
      state.isLoggedIn = false;
      state.privLevel = -99;
    },
    setToken(state, payload) {
      state.token = payload.token;
    },
    setFollow(state, payload){
      state.followers = payload.followers;
      state.following = payload.following;
    },
    pushFollow(state, payload){
      state.following.push(payload.user);
    },
    popFollow(state, payload){
      state.following.splice(state.following.findIndex((f)=>{f.uid == payload.uid}),1);
    },
  },
  actions: {
    addFollow({commit},user){
      commit({
        type:"pushFollow",
        user
      })
    },
    removeFollow({commit},uid){
      commit({
        type:"popFollow",
        uid
      })
    },
    async handleFollow({ commit }, payload){
      let followers = await getFollowersList(payload.uid);
      let following = await getFollowingList(payload.uid);

      commit({
        type: "setFollow",
        followers,
        following,
      })

    },
    updateToken({ commit }, token) {
      commit({
        type: "setToken",
        token,
      });
    },
    async logIn({ commit , dispatch}, user) {
      var p = 0;
      var extraInfo = null;
      await users.child(user.uid).once("value", async (ds) => {
        if (ds.exists()) {
          //user exists in the db already
          //read privilege level
          p = await ds.child("priv").val();
          if (p > 0) {
            var u = await ds.val();
            extraInfo = {
              number: u.number || "0611111111",
              uni: u.uni || "ENSAT",
            };
          }
        } else {
          //first time user logged in
          //create a user entry in db
          var newUser = users.child(user.uid);
          newUser.set({
            priv: p,
            email: user.email,
            userName: user.displayName,
            img: user.photoURL,
          });
        }
        commit({
          type: "setUser",
          priv: p,
          ...extraInfo,
          ...user,
        });
      });
      dispatch({
        type: "handleFollow",
        uid: user.uid,
      })
    },
    logOut({ commit }) {
      commit({
        type: "clearUser",
      });
    },
  },
  getters: {
    getLoggedState(state) {
      return state.isLoggedIn;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getPrivLevel(state) {
      return state.privLevel;
    },
    getToken(state) {
      return state.token;
    },
    getFollowers(state){
      return state.followers;
    },
    getFollowing(state){
      return state.following;
    },
    following: (state)=> (uid)=>{
      return state.following.findIndex((f)=>f.uid == uid) > -1 ? true : false ;
    },
  },
};
