import { users } from "../../../firebase";

export default {
  namespaced: true,
  state() {
    return {
      //basic user info (name, email, uid, img)
      userInfo: {},
      isLoggedIn: false,
      privLevel: -99,
      token: null,
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
  },
  actions: {
    updateToken({ commit }, token) {
      commit({
        type: "setToken",
        token,
      });
    },
    async logIn({ commit }, user) {
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
  },
};
