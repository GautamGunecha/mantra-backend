const _ = require("lodash");
const ejs = require("ejs");

const ApplicationError = require("../middlewares/applicationError");
const sendEmail = require("../services/nodemailer");

const triggerEmailNotification = (config) => {
  const { NODE_ENV } = process.env;
  if (_.isEmpty(NODE_ENV) || _.isEqual(NODE_ENV, "development")) {
    return {};
  }

  if (_.isEmpty(config)) {
    throw new ApplicationError("Configs required to trigger notification", 400);
  }

  const { source = "" } = config;
  if (_.isEmpty(source)) {
    throw new ApplicationError(
      "Required config source to generate required template",
      400
    );
  }

  switch (source) {
    case "NEW_USER_REGISTRATION":
      const { firstName = "", verificationUrl = "", lastName = "" } = config;

      const fileName = _.toLower(source) + ".ejs";
      const filePath = "../utilities/templates/" + fileName;
      const templateFilePath = path.resolve(__dirname, filePath);
      const templateContent = fs.readFileSync(templateFilePath, "utf8");

      const template = ejs.render(templateContent, {
        firstName,
        verificationUrl,
        lastName,
      });
      config.template = template;
      sendEmail(config);
      break;
    default:
      break;
  }
};

module.exports = { triggerEmailNotification };
