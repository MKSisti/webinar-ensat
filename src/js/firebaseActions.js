import { users, posts, waiting_Room, waiting_Room_Posts, storage } from '../firebase';

import { MongoDriver } from './mongoAtlas';
let titles;
let driver = new MongoDriver();
//this is not great, since we can't have some function that uses titles on a component mount, 
//but for our usecase its fine
(async () => {
  titles = await driver.init();
})();

async function getUser(uid) {
  var user = null;
  await users.child(uid).once('value', async (ds) => {
    user = await ds.val();
  });
  return user; // no checks are needed if user is found then it's an 'object' otherwise it's 'null'
}

const checkUserInwaitingRoom = async (uid) => {
  var e = false;
  await waiting_Room.child(uid).once('value', async (ds) => {
    e = ds.exists();
  });
  return e;
};

const getUserFromWR = async (uid) => {
  var user = null;
  await waiting_Room.child(uid).once('value', async (ds) => {
    user = await ds.val();
  });
  return user;
}

const getInitialPosts = async (n) => {
  var initial = [];
  await posts
    .orderByChild('hosting_date')
    .limitToFirst(n)
    .once('value', async (ds) => {
      // initial = await ds.val();
      ds.forEach((chds) => {
        initial.push(chds.val());
      });
    });
  return initial ? initial : [];
};

const getInitPosDyn = async (n, orderBy) => {
  var initial = [];
  await posts
    .orderByChild(orderBy)
    .limitToFirst(n)
    .once('value', async (ds) => {
      ds.forEach((chds) => {
        initial.push(chds.val());
      });
    });
  return initial ? initial : [];
};

const getExtPosDyn = async (n, orderBy, bot) => {
  var extra = [];
  await posts
    .orderByChild(orderBy)
    .startAfter(bot)
    .limitToFirst(n)
    .once('value', async (ds) => {
      ds.forEach((chds) => {
        extra.push(chds.val());
      });
    });
  return extra ? extra : null;
};

const getPosFromList = async (n, L, offset) => {
  var extra = [];
  var i = L.length - offset > 0 ? Math.min(n, L.length - offset) : -1;
  for (let index = 0; index < i; index++) {
    extra.push(await getPost(L[index + offset].pid));
  }
  return extra;
};

const getUserPosts = async (id) => {
  var ps = [];
  await posts
    .orderByChild('owner')
    .equalTo(id)
    .once('value', async (ds) => {
      ds.forEach((chds) => {
        ps.push(chds.val());
      });
    });
  return ps ? ps : [];
};

const getExtraPosts = async (n, LastDate) => {
  var extra = [];
  await posts
    .orderByChild('hosting_date')
    .startAfter(LastDate)
    .limitToFirst(n)
    .once('value', async (ds) => {
      // extra = await ds.val();
      ds.forEach((chds) => {
        extra.push(chds.val());
      });
    });
  return extra ? extra : null;
};

const getPost = async (pid) => {
  var post = null;
  // this checks if the post is in published and gets it
  await posts.child(pid).once('value', async (ds) => {
    if (ds.exists()) {
      post = await ds.val();
    }
  });
  // if post is not in published this checks draft (waiting room for posts)
  if (post == null) {
    await waiting_Room_Posts.child(pid).once('value', async (ds) => {
      if (ds.exists()) {
        post = await ds.val();
      }
    });
  }
  // by this time if the post is either found and read or it doesn't exist and it's null
  return post;
};

/**
 *
 * @param {object} newPost
 * assumes the uid is provided
 */
const createPost = async (pid, content, owner, hosting_date, title) => {
  //The offset is in minutes -- convert it to ms
  var tmLoc = new Date();
  let t = tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
  await users.child(owner + '/posts/' + pid).set(true);
  await titles.insertOne({
    pid,
    creation_date: t,
    hosting_date,
    content,
    owner,
    title,
    approved:false,
  });
};
const updatePost = async (pid, content, hosting_date, title) => {
  await titles.updateOne({pid},{$set:{
    content,
    hosting_date,
    title,
  }});
};

const getTitles = async (title) => await titles.find({
  title: {'$regex': title, '$options': 'i'}
},{limit:100});

const removePost = async (pid) => {
  var ownerId = null;
  await posts.child(pid).once('value', async (ds) => {
    var val = await ds.val();
    if (val) {
      ownerId = val.owner;
    } else {
      console.error('something went wrong reading owner id while deleting post');
      return;
    }
  });
  await users.child(ownerId + '/posts/' + pid).remove((err) => {
    err ? console.error(err) : null;
  });
  await titles.deleteOne({pid});

  await storage.ref('posters/' + pid).delete();

};

const requestHost = async (uid, uni, number) => {
  let user = await getUser(uid);
  await waiting_Room.child(uid).set({
    request_date: Date.now(),
    uni,
    number,
    ...user,
  });
};

const confirmHost = async (uid) => {
  let user = await getUserFromWR(uid);
  await users.child(uid).update({
    "priv": 1,
    "number": user.number,
    "uni": user.uni,
  })
  await waiting_Room.child(uid).remove((err) => {
    err ? console.error(err) : null;
  });
};

const denyHost = async (uid) => {
  await waiting_Room.child(uid).remove((err) => {
    console.error(err);
  });
};

const getUserInfo = async (uid) => {
  var u = null;
  await users.child(uid).once('value', async (ds) => {
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
  await waiting_Room_Posts.once('value', async (ds) => {
    return await ds.val();
  });
};

const makeUsersMap = async (PostList, oldMap) => {
  let userIds = [];
  let oldIds = [];
  let map = oldMap || new Map();

  for (const key of map.keys()) {
    // no need to test for duplicates cause copying from the map
    oldIds.push(key);
  }

  for (const item of PostList) {
    // getting the userIds from the posts
    userIds.indexOf(item.owner) < 0 ? userIds.push(item.owner) : null;
  }

  for (const id of userIds) {
    // checking if the id from the posts already exists in the map
    oldIds.indexOf(id) < 0 ? map.set(id, await getUserInfo(id)) : null;
  }

  return map;
};

const uploadCover = async (img, pid) => {
  await storage.ref('posters/' + pid).put(img);
};

const updateCover = async (img, pid) => {
  await storage.ref('posters/' + pid).delete();
  await uploadCover(img, pid);
};

/**
 *
 * @param {*} pid
 * @returns actual image downloaded as blob
 */
const getCoverImg = async (pid) => {
  let url = await storage.ref('posters/' + pid).getDownloadURL();
  return await new Promise((res) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      res(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
  });
};

/**
 *
 * @param {*} pid
 * @returns the cover img url
 */
const getCI2 = async (pid) => {
  return await storage.ref('posters/' + pid).getDownloadURL() || await storage.ref('posters/fail.png').getDownloadURL();
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
  makeUsersMap,
  uploadCover,
  getCoverImg,
  getCI2,
  updateCover,
  updatePost,
  getUserPosts,
  getInitPosDyn,
  getExtPosDyn,
  getPosFromList,
  getTitles
};
