const express = require("express");
const winston = require("winston");
const app = express();
const config = require("config");

// Solves cors problem: line no:- 6 to 12
// const cors = require("cors");
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true,
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

const cors = require("cors");
const corsOptions = {
  origin: "https://vidly-zeta.vercel.app",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || config.get("port");

const server = app.listen(port, () => {
  winston.info(`Listening to PORT Number ${port}`);
});

module.exports = server;
