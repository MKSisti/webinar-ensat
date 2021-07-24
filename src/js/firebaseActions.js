import { users, posts, waiting_Room } from "../firebase";

async function getUser(uid) {
  var user = null;
  await users.child(uid).once("value", async (ds) => {
    user = await ds.val();
    console.log(user);
    console.log(posts);
  });
  return user; // no checks are needed if user is found then it's an 'object' otherwise it's 'null'
}
// const getUser = async (uid) => {

// };

const getInitialPosts = async () => {
  var initial = null;
  await posts
    .orderByChild("hosting_date")
    .limitToFirst(10)
    .once("value", async (ds) => {
      initial = await ds.val();
    });
  return initial ? Object.values(initial) : null;
};

/**
 *
 * @param {Unix timestamp} LastDate
 * @returns 10 more posts from db
 */
const getExtraPosts = async (LastDate) => {
  var extra = null;
  await posts
    .orderByChild("hosting_date")
    .startAfter(LastDate)
    .limitToFirst(10)
    .once("value", async (ds) => {
      extra = await ds.val();
    });
  return extra ? Object.values(extra) : null;
};

const getPost = async (pid) => {
  var post = null;
  await posts.child(pid).once("value", async (ds) => {
    post = await ds.val();
  });
  return post; // same for post as user
};

/**
 *
 * @param {object} newPost
 */
const createPost = async (newPost) => {
  var np = await posts.push();
  var owner = users.child(newPost.uid);
  await owner.child("posts").push(np.key);
  await np.set(newPost);
};

const removePost = async (pid) => {
  var ownerId = null;
  await posts.child(pid).once("value", async (ds) => {
    var val = await ds.val();
    if (val) {
      ownerId = val.uid;
    } else {
      console.error("something went wrong reading owner id while deleting post");
      return;
    }
  });
  await users.child(ownerId + "/posts/" + pid).remove((err) => {
    console.error(err);
  });
  await posts.child(pid).remove((err) => {
    console.error(err);
  });
};

const requestHost = async (user) => {
  await waiting_Room.child(user.uid).set({
    request_date: Date.now(),
    ...user,
  });
};

const confirmHost = async (user) => {
  await users.child(user.uid + "/priv").set(1);
  await users.child(user.uid + "/phone").set(user.phone);
  await users.child(user.uid + "/uni").set(user.uni);
  await waiting_Room.child(user.uid).remove((err) => {
    console.error(err);
  });
};

const denyHost = async (uid) => {
  await waiting_Room.child(uid).remove((err) => {
    console.error(err);
  });
};

export {
  getUser,
  getPost,
  getInitialPosts,
  getExtraPosts,
  createPost,
  removePost,
  requestHost,
  confirmHost,
  denyHost,
};
