const axios = require('axios').default;

// var data = JSON.stringify({
//   Messages: [
//     {
//       From: {
//         Email: 'gharbaoui94@gmail.com', //only one available for now, i can add a domain address when we get a domain
//         Name: 'maxx', //sender's name duh
//       },
//       To: [
//         {
//           Email: 'gharbaoui94@gmail.com', // array of ppl to send to
//           Name: 'maxx',
//         },
//       ],
//       Subject: 'My first Mailjet email', //email subject
//       TextPart: 'Greetings from Mailjet.', //email title
//       HTMLPart: '<h3>Dear passenger 1, welcome to <a href=https://www.mailjet.com/>Mailjet</a>!</h3><br />May the delivery force be with you!', //email body
//       CustomID: 'AppGettingStartedTest', //email id
//     },
//   ],
// });

async function sendMail(data) {

  let res = await axios({
    method: 'post',
    url: 'https://api.mailjet.com/v3.1/send',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic NDQxYTk4NjJmOGIwMTczMTQ2ZjAwZGYwOTQyNjQ3Yzg6NDRlODUzZWNjMzFiOWM1YjJjOWQ4YWNmYzQyNmM2ZjU=',
    },
    data: JSON.stringify(data),
  });
  return res;

}

export {
  sendMail
}

