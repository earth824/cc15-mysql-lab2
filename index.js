const express = require('express');
const mysql2 = require('mysql2/promise');

const app = express();

const db = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mysql_todo_list',
  connectionLimit: 20
});

app.use(express.json());

// validate exist email
// app.get('/validate-email', (req,res,next) => {

// })

// login
// Method: post, Path: /login
// Data: username, password (REQUEST BODY)
app.post('/login', async (req, res, next) => {
  try {
    // READ BODY
    const { username, password } = req.body;
    // find user with username and password
    const result = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (result[0].length === 0) {
      return res.status(400).json({ message: 'invalid username or password' });
    }
    res.status(200).json({ message: 'success login' });
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
});

// BODY, QUERY, PARAMETER
// register
// Method: post, Path: /register
// Data: username, password (REQUEST BODY)
app.post('/register', async (req, res, next) => {
  try {
    // READ BODY
    const { username, password } = req.body;
    // VALIDATE DATA eg. PASSWORD must contain at least one uppercase

    // find exist username
    //[el1,el2]
    // el1 [ { id:7, username: 'leo', password: '123456' } ]
    const result = await db.query('SELECT * FROM users WHERE username = ?', [username]); // [[{id: , username}], []]
    console.log(result);
    if (result[0].length > 0) {
      return res.status(400).json({ message: 'username already in use' });
    }
    // VALIDATE FAil
    // res.status(400).json({ message: 'PASSWORD must contain at least one uppercase' });
    // END VALIDATE

    // SAVE DATA TO DATABASE
    // mysql2 Connect to MySQL server and persist data to user table

    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ message: 'success registration' });
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
});

// change password
// Method: put, Path /change-password
// Data: username, newPassword
app.put('/change-password', async (req, res, next) => {
  try {
    // READ BODY
    const { username, newPassword } = req.body;
    // VALIDATE username exist
    const result = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (result[0].length === 0) {
      return res.status(400).json({ message: 'username not found' });
    }

    await db.query('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
    res.status(200).json({ message: 'success update password' });
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
});

// create todo
// Method: post, Path: /create-todo
// Data: title, userId, completed
app.post('/create-todo', async (req, res, next) => {
  try {
    // READ BODY
    const { title, userId, completed } = req.body;
    // VALDIATE
    const result = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (result[0].length === 0) {
      return res.status(400).json({ message: 'user with this id not found' });
    }
    await db.query('INSERT INTO todos (title, completed, user_id) VALUES (?, ?, ?)', [title, completed, userId]);
    res.status(200).json({ message: 'create todo successfully' });
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
});

// get todo
// Method: get, Path: /get-todo
// Data: searchTitle, userId (QUERY)
app.get('/get-todo', async (req, res, next) => {
  try {
    // READ QUERY
    const { searchTitle, userId } = req.query;
    if (searchTitle !== undefined && userId !== undefined) {
      const result = await db.query('SELECT * FROM todos WHERE title = ? AND user_id = ?', [searchTitle, userId]);
      return res.status(200).json({ resultTodo: result[0] });
    }
    if (searchTitle !== undefined) {
      const result = await db.query('SELECT * FROM todos WHERE title = ?', [searchTitle]);
      return res.status(200).json({ resultTodo: result[0] });
    }
    if (userId !== undefined) {
      const result = await db.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
      return res.status(200).json({ resultTodo: result[0] });
    }

    const result = await db.query('SELECT * FROM todos');
    res.status(200).json({ resultTodo: result[0] });
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
});

// dlete todo
// Method: delete, path: /delete-todo/:idToDelete
// DAta: idToDelete
app.delete('/delete-todo/:idToDelete', async (req, res, next) => {
  try {
    // READ PATH PARAMETER
    const { idToDelete } = req.params; // { idTodDelete: 4 }
    // find todo exist
    const result = await db.query('SELECT * FROM todos WHERE id = ?', [idToDelete]);
    if (result[0].length === 0) {
      return res.status(400).json({ message: 'todo with ths id not found' });
    }
    await db.query('DELETE FROM todos WHERE id = ?', [idToDelete]);
    res.status(200).json({ message: 'delete successfully' });
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
});

app.listen(8888, () => console.log('server running on port 8888'));
