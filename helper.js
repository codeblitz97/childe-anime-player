/**
 *
 * @param {import("express").Response} res The response object
 * @param {string} message The message
 * @param {object | null} result
 */
const sendSuccessResponse = (res, message, result) => {
  return res.status(200).json({
    status: res.statusCode,
    message,
    result,
  });
};

module.exports = { sendSuccessResponse };
