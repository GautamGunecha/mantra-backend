const responder = (info = "", data = {}) => {
  const responseBuilder = {
    success: true,
    info,
    data,
  };
  return responseBuilder;
};

module.exports = responder;
