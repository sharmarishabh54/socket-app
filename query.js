// const config = require('./src/config');
const MysqlManager = require('./libs/mysql.manager');
// const mysqlManager = MysqlManager(config.mysql);
const test = async () => {
    const query = `SELECT * FROM USERS where id=?`;
    const params = [3];
    const [rows] = await MysqlManager.execute(query, params);
    return rows;
};

test().then((res) => {
    console.log(res);
}).catch((error) => {
    console.log(error);
})