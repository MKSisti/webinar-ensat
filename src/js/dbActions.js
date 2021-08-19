import { users, posts, waiting_Room, waiting_Room_Posts, storage } from '../firebase';

import { MongoDriver } from './mongoAtlas';
let titles;
let driver = new MongoDriver();
//this is not great, since we can't have some function that uses titles on a component mount, 
//but for our usecase its fine
(async () => {
  titles = await driver.init('titles');
  driver.on('titles',(op,change) => console.log(op,change));
  let postss = await driver.get('titles');
  console.log('test ',postss);

  // await driver.insert('titles',{
  //   poopoo:'peepee'
  // });

  // driver.delete('titles',{
  //   title: 'webinar'
  // });

  
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
//------------------------------ old gets here -----------------------------------------------
//dep
// const getInitialPosts = async (n) => {
//   var initial = [];
//   await posts
//     .orderByChild('hosting_date')
//     .limitToFirst(n)
//     .once('value', async (ds) => {
//       // initial = await ds.val();
//       ds.forEach((chds) => {
//         initial.push(chds.val());
//       });
//     });
//   return initial ? initial : [];
// };

//the getter used right now takes the number to get and by what to order, since we are gonna use mongo it can take 
//      the direction asc or desc and maybe the search term too if supplied 
//      afrer we add the admin logic we will need to check if the posts are approved 
//      I already added a new field for that to make it easy to check called "approved" will be a simple boolean 
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
// if you make the search very general you can add the uid as a variable passed too and if it's upplied narrow the search by user too
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
// dep
// const getExtraPosts = async (n, LastDate) => {
//   var extra = [];
//   await posts
//     .orderByChild('hosting_date')
//     .startAfter(LastDate)
//     .limitToFirst(n)
//     .once('value', async (ds) => {
//       // extra = await ds.val();
//       ds.forEach((chds) => {
//         extra.push(chds.val());
//       });
//     });
//   return extra ? extra : null;
// };

// this is the method that loads the posts from firebase when provided a list
// after making the new getPosts methods this will be rendered useless too
const getPosFromList = async (n, L, offset) => {
  var extra = [];
  var i = L.length - offset > 0 ? Math.min(n, L.length - offset) : -1;
  for (let index = 0; index < i; index++) {
    extra.push(await getPost(L[index + offset].pid));
  }
  return extra;
};

// this is the old method that gets the post from firebase will be rendered useless after making the new getPosts mehods
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


//------------------------------------------------------------------------------------------------------

// already updated to put the posts in mongo still saves the necessary data to the user in firebase
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
// updated as well
const updatePost = async (pid, content, hosting_date, title) => {
  await titles.updateOne({pid},{$set:{
    content,
    hosting_date,
    title,
  }});
};
// your fancy get titles
const getTitles = async (title, owner, sortKey, dir, limit) => {
  let filter = {};

  if(owner) filter.owner = {'$regex': owner, '$options': 'i'};
  if(title) filter.title = {'$regex': title, '$options': 'i'};
  if(Object.keys(filter) < 1) filter = null;

  let sort = {};
  if(sort) sort[sortKey] = dir;
  else sort = null;

  let posts = await titles.find(filter,{
    limit: limit ? limit : 100,
    sort
  });

  console.log(posts);
  return posts;

};
// updated tp remove from mongo still has logic to change what needs to be changed in firebase for the user
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

// this is the user request host priv method makes an entry in waiting_room 
const requestHost = async (uid, uni, number) => {
  let user = await getUser(uid);
  await waiting_Room.child(uid).set({
    request_date: Date.now(),
    uni,
    number,
    ...user,
  });
};

// confirms the request for host priv
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

// denies the host priv request to a user and removes the request 
// might add a new data to the user called denied to prevent users from requesting multiple times 
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
