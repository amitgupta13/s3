const express = require("express");
const winston = require("winston");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  winston.info(`Server started on port ${port}`);
});
