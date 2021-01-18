const Pool = require("mysql");
const fs = require("fs");
const util = require("util");

const pool = Pool.createPool({
  user: "root",
  password: "agf1rst",
  //online
  // host: "34.116.124.231",
  host: "127.0.0.1",
  port: 3306,
  //online
  database: "agfirst_livestock",

  // ssl: {
  //   ca: fs.readFileSync(__dirname + `\\certs\\server-ca (3).pem`),
  //   key: fs.readFileSync(__dirname + `\\certs\\client-key.pem`),
  //   cert: fs.readFileSync(__dirname + "\\certs\\client-cert.pem"),
  // },
});

pool.query = util.promisify(pool.query);
module.exports = pool;
