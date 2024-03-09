const mysql = require('mysql2');
require('dotenv').config();
const Password = process.env.DB_PASSWORD;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: Password,
    database: 'employee_db'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database.');
});
module.exports = connection;