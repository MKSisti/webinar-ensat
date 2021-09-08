import { users, waiting_Room, storage } from "../firebase";
import { sendMail } from "./emailClient";
import { formatDate } from "../utils";
import driver from "./mongoAtlas";
import Compressor from "compressorjs";

async function getUser(uid) {
  var user = null;
  await users.child(uid).once("value", async (ds) => {
    user = await ds.val();
    user = {
      uid: ds.key,
      ...user,
    };
  });
  return user; // no checks are needed if user is found then it's an 'object' otherwise it's 'null'
}

const getAdminEmails = async () => {
  var l = [];
  await users
    .orderByChild("priv")
    .equalTo(2)
    .once("value", async (ds) => {
      ds.forEach((chds) => {
        l.push(chds.val().email);
      });
    });
  return l;
};

const checkUserInwaitingRoom = async (uid) => {
  var e = false;
  await waiting_Room.child(uid).once("value", async (ds) => {
    e = ds.exists();
  });
  return e;
};

const getUserFromWR = async (uid) => {
  var user = null;
  await waiting_Room.child(uid).once("value", async (ds) => {
    user = await ds.val();
  });
  return user;
};

const getPosts = async (filter, sort, limit, last) => {
  return (await driver.get("posts", filter, sort, limit, last)) || null;
};
const getPost = async (pid) => {
  let l = await driver.get("posts", { pid: pid }, null, 1);
  return l[0] || null;
};

//------------------------------------------------------------------------------------------------------
// already updated to put the posts in mongo still saves the necessary data to the user in firebase
const createPost = async (pid, content, owner, hosting_date, title) => {
  //The offset is in minutes -- convert it to ms
  var tmLoc = new Date();
  let t = tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
  await users.child(owner + "/posts/" + pid).set(true);
  await driver.insert("posts", {
    pid,
    creation_date: t,
    hosting_date,
    content,
    owner,
    title,
    approved: false,
  });
  const formattedDate = formatDate(hosting_date);
  let user = await getUser(owner);
  let to = await getAdminEmails();
  await sendMail(
    to,
    `NEW POST FROM ${user.userName}`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          <h1 style="text-align:center; font-size: 28px; font-weight:600;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> ${user.userName} has a new post </h1>
          <ul style="list-style-type: none;text-align:center; margin: 0; padding: 0;font-size: 18px; font-weight:normal;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Hosting Date:</strong> ${formattedDate.date} at ${formattedDate.time}</li>
          </ul>
          <h1 style="text-align:center; font-size: 24px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> Visit the admin panel to take action </h1>
        </td>
      </tr>
    </table>
      `
  );
};
// updated as well
const updatePost = async (pid, content, hosting_date, title, uid) => {
  var tmLoc = new Date();
  let t = tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
  await driver.update(
    "posts",
    { pid },
    {
      content,
      hosting_date,
      title,
      approved: false,
      last_updated: t,
    }
  );
  const formattedDate = formatDate(hosting_date);
  let user = await getUser(uid);
  let to = await getAdminEmails();
  await sendMail(
    to,
    `UPDATED POST FROM ${user.userName}`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          <h1 style="text-align:center; font-size: 28px; font-weight:600;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> ${user.userName} has updated their post </h1>
          <ul style="list-style-type: none;text-align:center; margin: 0; padding: 0;font-size: 18px; font-weight:normal;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Hosting Date:</strong> ${formattedDate.date} at ${formattedDate.time}</li>
          </ul>
          <h1 style="text-align:center; font-size: 24px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> Visit the admin panel to take action </h1>
        </td>
      </tr>
    </table>
      `
  );
};

const updateUser = async (uid, userName, uni, number, priv) => {
  let o = {};
  userName ? (o["userName"] = userName) : null;
  uni ? (o["uni"] = uni) : null;
  number ? (o["number"] = number) : null;
  await users.child(uid).update(o);
  await updatePriv(uid, priv);
};

const confirmPost = async (pid, uid, title) => {
  await driver.update(
    "posts",
    { pid },
    {
      approved: true,
    }
  );
  let to = await getFollowersListEmails(uid);
  let user = await getUser(uid);
  await sendMail(
    to,
    `NEW POST FROM ${user.userName}`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr style="text-align: center;" align="center">
      <img style="max-width:192px; padding: 5px 0px;" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
    </tr>
    <tr>
    <td style="text-align: center;">
      <h1 style="text-align:center; font-size: 28px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> ${user.userName} just posted a new post with title <strong>${title}</strong> </h1>
    </td>
    </tr>
  </table>
    `
  );
};
const denyPost = async (pid, uid) => {
  await removePost(pid, uid);
};

// updated tp remove from mongo still has logic to change what needs to be changed in firebase for the user
const removePost = async (pid, uid) => {
  await users.child(uid + "/posts/" + pid).remove((err) => {
    err ? console.error(err) : null;
  });
  await driver.delete("posts", { pid });

  await storage.ref("posters/" + pid).delete();
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
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
      <td style="text-align: center;">
        <h1 style="text-align:center; font-size: 28px; font-weight: 600; padding: 0;font-size: 18px; font-weight:normal;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <li><strong>Username:</strong> ${user.userName}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Phone:</strong> (+212) - ${number}</li>
          <li><strong>University:</strong> ${uni}</li>
        </ul>
        <h1 style="text-align:center; font-size: 24px; font-weight: 400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> Visit the admin panel to take action </h1>
      </td>
      </tr>
    </table>
      `
  );
};
const getUsersInWaitingRoom = async () => {
  let l = [];
  await waiting_Room.once("value", async (ds) => {
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
  let re = new RegExp(`.*${text}.*`,'i');
  await users
    .orderByChild("userName")
    .startAt(text.toUpperCase())
    .endAt(text.toLowerCase() + "\uf8ff")
    .once("value", async (ds) => {
      let v = ds.val();
      for (const key of Object.keys(v)) {
        if (re.test(v[key].userName)) {
          l.push({
            uid: key,
            ...v[key],
          });
        }
      }
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
    `USER ${user.userName} WAS ACCEPTED AS A HOST`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
      <td style="text-align: center;">
        <h1 style="text-align:center; font-size: 28px; font-weight:600;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> User ${user.userName} has been given the privilege to host </h1>
        <ul style="list-style-type: none;text-align:center; margin: 0; padding: 0;font-size: 18px; font-weight:normal;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <li><strong>Username:</strong> ${user.userName}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Phone:</strong> (+212) - ${user.number}</li>
          <li><strong>University:</strong> ${user.uni}</li>
        </ul>
      </td>
      </tr>
    </table>
      `
  );
};

const blockUser = async (uid) => {
  await users.child(uid).update({
    priv: -1,
  });
  let user = await getUserInfo(uid);
  await sendMail(
    userInfo.email,
    `${user.userName}, YOUR ACCOUNT HAS BEEN BLOCKED`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
      <td style="text-align: center;">
      <h1 style="text-align:center; font-size: 28px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> User ${user.userName}, you have been blocked from hosting by an administrator, please contact them to resolve this issue.</h1>
      </td>
      </tr>
    </table>
    `
  );
};
const unblockUser = async (uid) => {
  await users.child(uid).update({
    priv: 1,
  });
  let user = await getUserInfo(uid);
  await sendMail(
    user.email,
    `${user.userName}, YOUR ACCOUNT HAS BEEN UNBLOCKED`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
      <td style="text-align: center;">
        <h1 style="text-align:center; font-size: 28px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> User ${user.userName}, you have been blocked from hosting by an administrator, please contact them to resolve this issue.</h1>
      </td>
      </tr>
    </table>
      `
  );
};
const makeAdmin = async (uid) => {
  await users.child(uid).update({
    priv: 2,
  });
  let user = await getUserInfo(uid);
  await sendMail(
    user.email,
    `${user.userName}, YOUR ACCOUNT HAS BEEN UPGRADED TO ADMIN`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
      <td style="text-align: center;">
        <h1 style="text-align:center; font-size: 28px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> User ${user.userName}, your account has been given <strong>administrative</strong> privileges, you can now access the admin panel in the app</h1>
      </td>
      </tr>
    </table>
      `
  );
};

const makeHost = async (uid) => {
  await users.child(uid).update({
    priv: 1,
  });
  let user = await getUserInfo(uid);
  await sendMail(
    user.email,
    `${user.userName}, YOUR ACCOUNT HAS BEEN UPGRADED TO HOST`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
      <td style="text-align: center;">
        <h1 style="text-align:center; font-size: 28px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> User ${user.userName}, your account has been given <strong>hosting</strong> privileges, you can now post in the app</h1>
      </td>
      </tr>
    </table>
      `
  );
};

const makeRegular = async (uid) => {
  await users.child(uid).update({
    priv: 0,
  });
  let user = await getUserInfo(uid);
  await sendMail(
    user.email,
    `${user.userName}, YOUR ACCOUNT WAS REVERTED TO A REGULAR USER`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          <h1 style="text-align:center; font-size: 28px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> User ${user.userName}, your account has been given <strong>viewing</strong> privileges, you can't create post in the app</h1>
        </td>
      </tr>
    </table>
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
      console.error("unsopported action");
      break;
  }
};

// denies the host priv request to a user and removes the request
// might add a new data to the user called denied to prevent users from requesting multiple times
const denyHost = async (uid) => {
  await waiting_Room.child(uid).remove((err) => {
    console.error(err);
  });
  let user = await getUserInfo(uid);
  await sendMail(
    user.email,
    `${user.userName}, YOUR ACCOUNT WAS DENIED HOSTING`,
    `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr style="text-align: center;" align="center">
        <td style="padding:0px;margin:0px; width="350">
          <img style="margin: 0px auto; border: 0; padding: 0; display: block;" width="192" height="192" src="https://spotlightensat.netlify.app/img/icons/icon_192x192.png" alt=""/>
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
        <h1 style="text-align:center; font-size: 28px; font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:1rem 2rem;"> User ${user.userName}, your account was deinied <strong>hosting</strong> privileges, contact an admin for more info</h1>
        </td>
      </tr>
    </table>
      `
  );
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
  await storage.ref("posters/" + pid).put(img);
};

const updateCover = async (img, pid) => {
  await storage.ref("posters/" + pid).delete();
  await uploadCover(img, pid);
};

/**
 *
 * @param {*} pid
 * @returns actual image downloaded as blob
 */
const getCoverImg = async (pid) => {
  let url = await storage.ref("posters/" + pid).getDownloadURL();
  return await new Promise((res) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      res(xhr.response);
    };
    xhr.open("GET", url);
    xhr.send();
  });
};

/**
 *
 * @param {*} pid
 * @returns the cover img url
 */
const getCI2 = async (pid) => {
  return (await storage.ref("posters/" + pid).getDownloadURL()) || (await storage.ref("posters/fail.png").getDownloadURL());
};

const fileHandler = async (f, q = 1) => {
  return new Promise((res) => {
    if (f[0] && f[0].type.split("/")[0] == "image") {
      var fileToUpload = null;
      var reader = new FileReader();
      new Compressor(f[0], {
        convertSize: 0,
        quality: Math.max(Math.min((f[0].size / 1049000) * -0.1 * q + 0.99, 1), 0.1),
        success(result) {
          reader.readAsDataURL(result);
          fileToUpload = result;
        },
      });
      reader.onload = (e) => {
        res([fileToUpload, e.target.result]);
      };
    }
  });
};

const follow = async (uid, email, hostuid, hostemail) => {
  await users.child(uid + "/following/" + hostuid).set({
    uid: hostuid,
    email: hostemail,
  });
  await users.child(hostuid + "/followers/" + uid).set({
    uid: uid,
    email: email,
  });
};

const unfollow = async (uid, hostuid) => {
  await users.child(uid + "/following/" + hostuid).remove();
  await users.child(hostuid + "/followers/" + uid).remove();
};

const getFollowersList = async (uid) => {
  var l = [];
  await users.child(uid + "/followers").once("value", async (ds) => {
    ds.forEach((dsch) => {
      l.push(dsch.val());
    });
  });
  return l;
};
const getFollowersListEmails = async (uid) => {
  var l = [];
  await users.child(uid + "/followers").once("value", async (ds) => {
    ds.forEach((dsch) => {
      l.push(dsch.val().email);
    });
  });
  return l;
};
const getFollowingList = async (uid) => {
  var l = [];
  await users.child(uid + "/following").once("value", async (ds) => {
    ds.forEach((dsch) => {
      l.push(dsch.val());
    });
  });
  return l;
};
const getFollowingListIds = async (uid) => {
  var l = [];
  await users.child(uid + "/following").once("value", async (ds) => {
    ds.forEach((dsch) => {
      l.push(dsch.val().uid);
    });
  });
  return l;
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
  fileHandler,
  follow,
  unfollow,
  getFollowersList,
  getFollowingList,
  getFollowingListIds,
};
