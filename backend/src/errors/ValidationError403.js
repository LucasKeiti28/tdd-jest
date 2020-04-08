/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
module.exports = function ValidationError403(
  message = "You can't access accounts from another user"
) {
  this.name = "ValidationError403";
  this.message = message;
};
