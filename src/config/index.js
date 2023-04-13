const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    mysql: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        debug: false
    }
};
