const express = require('express');

const db = require('../database/db');

const router = express.Router();

// create todo
// Method: post, Path: /create-todo
// Data: title, userId, completed
router.post('/', async (req, res, next) => {
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
router.get('/', async (req, res, next) => {
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
router.delete('/:idToDelete', async (req, res, next) => {
  try {
    // READ PATH PARAMETER
    const { idToDelete } = req.params; // { idTodDelete: 4 }
    // find todo exist
    const result = await db.query('SELECT * FROM todos WHERE id = ?', [idToDelete]);
    if (result[0].length === 0) {
      // return res.status(400).json({ message: 'todo with ths id not found' });

      return next(createError(400, 'todo with ths id not found'));
    }
    await db.query('DELETE FROM todos WHERE id = ?', [idToDelete]);
    res.status(200).json({ message: 'delete successfully' });
  } catch (err) {
    // res.status(500).json({ message: 'internal server error' });

    next(createError(500, 'internal server error'));
  }
});

module.exports = router;
