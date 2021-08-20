import { Email } from './smtp';

/**
 *
 * @param {string} to - who to send to
 * @param {string} subject - subject of the email
 * @param {string} body - body of the email
 * @returns email request success/failure
 */
const sendMail = async (to, subject, body) => {
  if(!(to && subject && body)) throw new Error('incomplete params to, subject and body are required');
  
  const req = {
    Host: 'smtp.gmail.com',
    Username: process.env.VUE_APP_SMTP_USERNAME,
    Password: process.env.VUE_APP_SMTP_PASSWORD,
    To: to,
    From: process.env.VUE_APP_SMTP_FROM,
    Subject: subject,
    Body: body,
  };

  try{
    let res = await Email.send(req);
    return res;
  }
  catch(e){
    throw new Error(e);
  }
  
};

export { sendMail };
