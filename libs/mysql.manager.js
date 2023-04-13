const mysql = require('mysql2');
const config = require('../src/config');
const pool = mysql.createPool(config.mysql);


module.exports = pool.promise();
