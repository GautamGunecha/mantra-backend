const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const {
  SENDER_EMAIL,
  GOOGLE_CONSOLE_REFRESH_TOKEN,
  GOOGLE_CONSOLE_CLIENT_SECRET,
  GOOGLE_CONSOLE_CLIENT_ID,
  GOOGLE_PLAYGROUND_URL,
} = process.env;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    GOOGLE_CONSOLE_CLIENT_ID,
    GOOGLE_CONSOLE_CLIENT_SECRET,
    GOOGLE_PLAYGROUND_URL
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_CONSOLE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDER_EMAIL,
      accessToken,
      clientId: GOOGLE_CONSOLE_CLIENT_ID,
      clientSecret: GOOGLE_CONSOLE_CLIENT_SECRET,
      refreshToken: GOOGLE_CONSOLE_REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async (config) => {
  const { subject = "", to = "", template } = config;
  const transporter = await createTransporter();

  const mailOptions = {
    subject,
    to,
    from: SENDER_EMAIL,
    html: template,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    }

    return info;
  });
};

module.exports = sendEmail;
