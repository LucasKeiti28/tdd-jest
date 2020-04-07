/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
module.exports = function ValidationError(message) {
  this.name = "ValidationError";
  this.message = message;
};
