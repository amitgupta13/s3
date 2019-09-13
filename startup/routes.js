const bodyParser = require("body-parser");
const error = require("../middleware/error");
const cors = require("cors");
const morgan = require("morgan");
const healthRoute = require("../routes/health");

module.exports = function(app) {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(morgan("tiny"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(healthRoute);
  app.use(error);
};
