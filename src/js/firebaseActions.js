import { users, posts, waiting_Room, waiting_Room_Posts } from "../firebase";

async function getUser(uid) {
  var user = null;
  await users.child(uid).once("value", async (ds) => {
    user = await ds.val();
    console.log(user);
    console.log(posts);
  });
  return user; // no checks are needed if user is found then it's an 'object' otherwise it's 'null'
}

const checkUserInwaitingRoom = async (uid) => {
  var e = false;
  await waiting_Room_Posts.child(uid).once("value",async (ds)=>{
    e = ds.exists();
  })
  return e;
}

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
  // this checks if the post is in published and gets it
  await posts.child(pid).once("value", async (ds) => {
    if (ds.exists()) {
      post = await ds.val();
    }
  });
  // if post is not in published this checks draft (waiting room for posts)
  if (post == null) {
    await waiting_Room_Posts.child(pid).once("value",async (ds)=>{
      if (ds.exists()) {
        post = await ds.val();
      }
    })
  }
  // by this time if the post is either found and read or it doesn't exist and it's null
  return post; 
};


/**
 *
 * @param {object} newPost
 * assumes the uid is provided
 */
const createPost = async (pid, content, owner, hosting_date) => {
  //The offset is in minutes -- convert it to ms
  var tmLoc = new Date();
  let t = tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
  await users.child(owner+"/posts/"+pid).set(true);
  await posts.child(pid).set({
    pid,
    creation_date: t,
    hosting_date,
    content,
    owner,
  });
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

const getUserInfo = async (uid) => {
  var u = null;
  await users.child(uid).once("value", async (ds) => {
    var data = await ds.val();
    u = {
      uid: ds.key,
      email: data.email,
      img: data.img,
      userName: data.userName,
    };
  });
  return u;
};

const getUsersData = async (List) => {
  var l = [];
  for (const p in List) {
    l.findIndex((a) => a.uid == p.uid) == -1 ? l.push(await getUserInfo(p.uid)) : null;
  }
  return l;
};

const getPostsAwaitingApproval = async () => {
  await waiting_Room_Posts.once("value", async (ds) => {
    return await ds.val();
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
  getUsersData,
  getPostsAwaitingApproval,
  getUserInfo,
  checkUserInwaitingRoom,
};
