import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyCCS-8knATLSrKtaiAMqbTvdsqMkQCPv_Q",
    authDomain: "webinarensat.firebaseapp.com",
    databaseURL: "https://webinarensat-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "webinarensat",
    storageBucket: "webinarensat.appspot.com",
    messagingSenderId: "42695813244",
    appId: "1:42695813244:web:18b2a700a13fb8f35141f9"
  };

  firebase.initializeApp(firebaseConfig);

  const db = firebase.database();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  const posts = firebase.database().ref("posts");
  const users = firebase.database().ref("users");

  export {db, auth, provider, posts, users}
