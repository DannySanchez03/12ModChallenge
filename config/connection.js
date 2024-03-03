const mysql = require('mysql2');
require('dotenv').config();
const mysqlPassword = process.env.MYSQL_PASSWORD;
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: mysqlPassword,
        database: 'employee_db'
    },
    console.log('Connected to the database.')
);
module.exports = connection;