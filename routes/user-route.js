const express = require('express');
const db = require('../database/db');
const createError = require('../utils/create-error');

const router = express.Router();

// login
// Method: post, Path: /user/login
// Data: username, password (REQUEST BODY)
router.post('/login', async (req, res, next) => {
  try {
    // READ BODY
    const { username, password } = req.body;
    // find user with username and password
    const result = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (result[0].length === 0) {
      // return res.status(400).json({ message: 'invalid username or password' });
      return next(createError(400, 'invalid username or password'));
    }
    res.status(200).json({ message: 'success login' });
  } catch (err) {
    next(createError(500, 'internal server error'));
    // res.status(500).json({ message: 'internal server error' });
  }
});

// BODY, QUERY, PARAMETER
// register
// Method: post, Path: /user/register
// Data: username, password (REQUEST BODY)
router.post('/register', async (req, res, next) => {
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
router.put('/change-password', async (req, res, next) => {
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

module.exports = router;
