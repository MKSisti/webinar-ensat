import { users } from "../../../firebase";

export default {
  namespaced: true,
  state() {
    return {
      //basic user info (name, email, uid, img)
      userInfo: {},
      //extra info collected for hosts (uni, profession, phone ...)
      extraInfo: {},
      isLoggedIn: false,
      privLevel: -99,
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
      state.extraInfo = user.extra;
      state.privLevel = user.priv;
    },

    clearUser(state) {
      state.userInfo = {};
      state.isLoggedIn = false;
      state.privLevel = -99;
    },
  },
  actions: {
    async logIn({ commit }, user) {
      var p = 0;
      var extraInfo = null;
      await users.child(user.uid).once("value", (ds) => {
          
        if (ds.val()) {
          //user exists in the db already
          //read privilege level
          console.log("old user");
          p = ds.child("priv").val();
          console.log(p);
          if (p > 0) {
            var u = ds.val();
            
            extraInfo = {
              phone: u.phone,
              uni: u.uni,
              proffession: u.proffession,
            };
          }
        }
        else{
            //first time user logged in
            //create a user entry in db
            console.log("first time");
            var newUser = users.child(user.uid);
            newUser.set({
                priv: 0,
                email: user.email,
                userName: user.displayName,
            })
        }
      });
      commit({
        type: "setUser",
        priv: p,
        extra: extraInfo,
        ...user,
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
  },
};
