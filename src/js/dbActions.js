import { users, waiting_Room, storage } from '../firebase';

import { sendMail } from './emailClient';

import driver from './mongoAtlas';

async function getUser(uid) {
  var user = null;
  await users.child(uid).once('value', async (ds) => {
    user = await ds.val();
  });
  return user; // no checks are needed if user is found then it's an 'object' otherwise it's 'null'
}

const getAdminEmails = async () => {
  var l = [];
  await users
    .orderByChild('priv')
    .equalTo(2)
    .once('value', async (ds) => {
      ds.forEach((chds) => {
        l.push(chds.val().email);
      });
    });
  return l;
};

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
};

const getPosts = async (filter, sort, limit, last) => {
  return (await driver.get('posts', filter, sort, limit, last)) || null;
};
const getPost = async (pid) => {
  let l = await driver.get('posts', { pid: pid }, null, 1);
  return l[0] || null;
};

//------------------------------------------------------------------------------------------------------
// already updated to put the posts in mongo still saves the necessary data to the user in firebase
const createPost = async (pid, content, owner, hosting_date, title) => {
  //The offset is in minutes -- convert it to ms
  var tmLoc = new Date();
  let t = tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
  await users.child(owner + '/posts/' + pid).set(true);
  await driver.insert('posts', {
    pid,
    creation_date: t,
    hosting_date,
    content,
    owner,
    title,
    approved: false,
  });
};
// updated as well
const updatePost = async (pid, content, hosting_date, title) => {
  await driver.update(
    'posts',
    { pid },
    {
      content,
      hosting_date,
      title,
    }
  );
};

const updateUser = async (uid, userName, uni, number) => {
  await users.child(uid).update({
    number,
    uni,
    userName,
  });
};

const confirmPost = async (pid) => {
  await driver.update(
    'posts',
    { pid },
    {
      approved: true,
    }
  );
};
const denyPost = async (pid, uid) => {
  await removePost(pid, uid);
};

// updated tp remove from mongo still has logic to change what needs to be changed in firebase for the user
const removePost = async (pid, uid) => {
  await users.child(uid + '/posts/' + pid).remove((err) => {
    err ? console.error(err) : null;
  });
  await driver.delete('posts', { pid });

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
  let to = await getAdminEmails();
  await sendMail(
    to,
    `NEW USER REQUESTING HOST ${user.userName}`,
    `
      <h1 style="text-align:center; font-size: 32px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> User ${user.userName} requesting hosting privileges <h1>
      <ul style="list-style-type: none; margin: 0; padding: 0;font-size: 20px; font-weight:normal;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <li><strong>Username:</strong> ${user.userName}</li>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Phone:</strong> (+212) - ${number}</li>
      <li><strong>University:</strong> ${uni}</li>
      </ul>
      <h1 style="text-align:center; font-size: 26px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> Visit the admin panel to take action <h1>
    `
  );
};
const getUsersInWaitingRoom = async () => {
  let l = [];
  await waiting_Room.once('value', async (ds) => {
    ds.forEach((dsch) => {
      l.push({
        uid: dsch.key,
        ...dsch.val(),
      });
    });
  });
  return l;
};

const getUsersFromSearch = async (text) => {
  let l = [];
  console.log(text.toUpperCase());
  await users
    .orderByChild('userName')
    .startAt(text.toUpperCase())
    .endAt(text.toLowerCase() + '\uf8ff')
    .once('value', async (ds) => {
      ds.forEach((dsch) => {
        l.push({
          uid: dsch.key,
          ...dsch.val(),
        });
      });
    });
  return l;
};

// confirms the request for host priv
const confirmHost = async (uid) => {
  let user = await getUserFromWR(uid);
  await users.child(uid).update({
    priv: 1,
    number: user.number,
    uni: user.uni,
  });
  await waiting_Room.child(uid).remove((err) => {
    err ? console.error(err) : null;
  });

  await sendMail(
    user.email,
    `HOST REQUEST APPROVER FOR ${user.userName}`,
    `<p style="font-size: 32px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;">
      Your request to become a host has been approved, you can start posting right away. Please be respectful or you will be blocked.
    </p>
    `
  );
};

const blockUser = async (uid) => {
  await users.child(uid).update({
    priv: -1,
  });
  let userInfo = await getUserInfo(uid);
  await sendMail(
    userInfo.email,
    `HI ${userInfo.userName},`,
    `<p style="font-size: 32px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;">
      We are sorry to inform you that your account is blocked, you can still browse the website but you can no longer post.
      Contact an admin for more information.
    </p>
    `
  );
};
const unblockUser = async (uid) => {
  await users.child(uid).update({
    priv: 1,
  });
  let userInfo = await getUserInfo(uid);
  await sendMail(
    userInfo.email,
    `HI ${userInfo.userName},`,
    `<p style="font-size: 32px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;">
      We are happy to inform you that your account is unlocked again, you can start posting right away.
      Contact an admin for more information.
    </p>
    `
  );
};
const makeAdmin = async (uid) => {
  await users.child(uid).update({
    priv: 2,
  });
  let userInfo = await getUserInfo(uid);
  await sendMail(
    userInfo.email,
    `HI ${userInfo.userName},`,
    `<p style="font-size: 32px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;">
      We are happy to inform you that your account is upgraded to admin status, you have all the admin privileges now.
      Contact an admin for more information.
    </p>
    `
  );
};

const makeHost = async (uid) => {
  await users.child(uid).update({
    priv: 1,
  });
  let userInfo = await getUserInfo(uid);
  await sendMail(
    userInfo.email,
    `HI ${userInfo.userName},`,
    `<p style="font-size: 32px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;">
      We are happy to inform you that your account is upgraded to host status.
      Contact an admin for more information.
    </p>
    `
  );
};

const makeRegular = async (uid) => {
  await users.child(uid).update({
    priv: 0,
  });
  let userInfo = await getUserInfo(uid);
  await sendMail(
    userInfo.email,
    `HI ${userInfo.userName},`,
    `<p style="font-size: 32px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;">
      Your account has been turned into a regular account.
      Contact an admin for more information.
    </p>
    `
  );
};

const updatePriv = async (uid, val) => {
  //these force a value should only used by admins
  switch (val) {
    case -1:
      await blockUser(uid);
      break;

    case 0:
      await makeRegular(uid);
      break;

    case 1:
      //this forces an account into being a host
      await makeHost(uid);
      break;

    case 2:
      await makeAdmin(uid);
      break;

    default:
      console.error('unsopported action');
      break;
  }
};

// denies the host priv request to a user and removes the request
// might add a new data to the user called denied to prevent users from requesting multiple times
const denyHost = async (uid) => {
  await waiting_Room.child(uid).remove((err) => {
    console.error(err);
  });
  let userInfo = await getUserInfo(uid);
  await sendMail(
    userInfo.email,
    `HOST REQUEST DENIED FOR ${userInfo.userName}`,
    `<p style="font-size: 32px; font-weight:bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;">
      we are sorry to inform you that your request to become a host has been denied.
    </p>
    `
  );
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
  return (await storage.ref('posters/' + pid).getDownloadURL()) || (await storage.ref('posters/fail.png').getDownloadURL());
};

export {
  getUser,
  getPosts,
  getPost,
  createPost,
  removePost,
  requestHost,
  blockUser,
  unblockUser,
  confirmHost,
  makeAdmin,
  denyHost,
  getUsersData,
  getUserInfo,
  checkUserInwaitingRoom,
  makeUsersMap,
  uploadCover,
  getCoverImg,
  getCI2,
  updateCover,
  updatePost,
  getAdminEmails,
  getUsersInWaitingRoom,
  getUsersFromSearch,
  confirmPost,
  denyPost,
  updatePriv,
  updateUser,
};
