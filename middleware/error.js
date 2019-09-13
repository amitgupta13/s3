const winston = require("winston");

module.exports = function(err, req, res, next) {
  winston.error(err.message, err);

  res.status(500).json({
    message: "Something Failed",
    error: err.message
  });
};
