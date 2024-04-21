const _ = require("lodash");
const ejs = require("ejs");

const ApplicationError = require("../middlewares/applicationError");
const sendEmail = require("../services/nodemailer");
const keys = require("../configs/keys");

const triggerEmailNotification = (config) => {
  // const { NODE_ENV } = keys;
  // if (_.isEmpty(NODE_ENV) || _.isEqual(NODE_ENV, "development")) {
  //   return {};
  // }

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

  const template = generateTemplate(config);
  config.template = template;

  sendEmail(config);
  return {};
};

const generateTemplate = (config) => {
  const { source = "" } = config;
  const fileName = _.toLower(source) + ".ejs";
  const filePath = "../utilities/templates/" + fileName;

  const templateFilePath = path.resolve(__dirname, filePath);
  const templateContent = fs.readFileSync(templateFilePath, "utf8");

  const template = ejs.render(templateContent, { config });
  return template;
};

module.exports = { triggerEmailNotification };
