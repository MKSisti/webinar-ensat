import { auth } from "./firebase";
import store from "./store";
// import router from "./router";

auth.onAuthStateChanged(async function (user) {
  if (user) {
    //user logged in
    await store.dispatch("user/logIn", user);
  } else {
    //user is not logged in (error or logged out)
    await store.dispatch("user/logOut");
  }
});
