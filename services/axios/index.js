const axios = require("axios");
const ApplicationError = require("../../middlewares/applicationError");

/**
 * Process HTTP requests using axios.
 *
 * @param {String} method - HTTP method ('get', 'post', 'put', 'delete', etc.)
 * @param {String} url - The endpoint URL
 * @param {Object} [data] - The request payload (for POST, PUT, etc.)
 * @param {Object} [config] - Additional axios configuration (headers, params, etc.)
 * @returns {Promise} - A promise that resolves to the response data or rejects with an error
 */
const processRequest = async (method, url, data = {}, config = {}) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      console.error("Error Response:", error.response.data);
      throw new ApplicationError(
        `HTTP ${error.response.status}: ${error.response.data}`,
        400
      );
    } else if (error.request) {
      // Request made but no response received
      console.error("Error Request:", error.request);
      throw new ApplicationError("No response received from server", 400);
    } else {
      // Something happened in setting up the request
      console.error("Error Message:", error.message);
      throw new ApplicationError(error.message, 400);
    }
  }
};

module.exports = processRequest;
