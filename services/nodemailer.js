const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;
const keys = require("../configs/keys");

const { GOOGLE_CONSOLE, SENDER_EMAIL } = keys;
const { REFRESH_TOKEN, CLIENT_SECRET, CLIENT_ID, PLAYGROUND_URL } =
  GOOGLE_CONSOLE;

const sendEmail = (config) => {
  const { subject = "", to = "", template } = config;

  const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, PLAYGROUND_URL);
  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  const accessToken = oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDER_EMAIL,
      accessToken,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
  });

  const mailOptions = {
    subject,
    to,
    from: SENDER_EMAIL,
    html: template,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    }

    return info;
  });
};

module.exports = sendEmail;
