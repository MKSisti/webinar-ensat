import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCCS-8knATLSrKtaiAMqbTvdsqMkQCPv_Q",
  authDomain: "webinarensat.firebaseapp.com",
  databaseURL:
    "https://webinarensat-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "webinarensat",
  storageBucket: "webinarensat.appspot.com",
  messagingSenderId: "42695813244",
  appId: "1:42695813244:web:18b2a700a13fb8f35141f9",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

const posts = firebase.database().ref("posts");
const users = firebase.database().ref("users");
const waiting_Room = firebase.database().ref("waitingRoom");
const waiting_Room_Posts = firebase.database().ref("waitingRoomPosts");

// not a good idea, maybe do not use
const newPostref = posts.push();

export {
  db,
  auth,
  provider,
  posts,
  newPostref,
  users,
  waiting_Room,
  waiting_Room_Posts,
  storage,
};
