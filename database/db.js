const mysql2 = require('mysql2/promise');

const db = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mysql_todo_list',
  connectionLimit: 20
});

module.exports = db;
