import { users, posts } from "../firebase";

async function getUser(uid) {
  var user = null;
  await users.child(uid).once("value", async (ds) => {
    user = await ds.val();
  });
  return user; // no checks are needed if user is found then it's an 'object' otherwise it's 'null'
}
// const getUser = async (uid) => {

// };

const getInitialPosts = async () => {
  var all = null;
  await posts
    .orderByChild("hosting_date")
    .limitToFirst(10)
    .once("value", async (ds) => {
      all = await ds.val();
    });
  return all;
};

const getExtraPosts = async (LastDate) => {
  var extra = null;
  await posts
    .orderByChild("hosting_date")
    .startAfter(LastDate)
    .limitToFirst(10)
    .once("value", async (ds) => {
      extra = await ds.val();
    });
  return extra;
};

const getPost = async (pid) => {
  var post = null;
  await posts.child(pid).once("value", async (ds) => {
    post = await ds.val();
  });
  return post; // same for post as user
};

export {
  getUser,
  getPost,
  getInitialPosts,
  getExtraPosts,
};
