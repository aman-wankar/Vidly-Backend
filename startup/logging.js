const { transports } = require("winston");
const winston = require("winston");
require("express-async-errors");

module.exports = function () {
    winston.exceptions.handle(
        new transports.File({ filename: "exceptions.log" })
    );

    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    winston.add(new winston.transports.File({ filename: "logfile.log" }));
};
