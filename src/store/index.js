import { createStore } from "vuex";
import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";
import user from "./modules/user/index.js"

const store = createStore({
  state() {
    return {
      
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
  modules: {
    user,
  },
});

export default store;