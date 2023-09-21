const express = require('express');

const errorMiddleware = require('./middlewares/error');
const userRoute = require('./routes/user-route');
const todoRoute = require('./routes/todo-route');

const app = express();

app.use(express.json());

// handle feature user
app.use('/user', userRoute);

// handle feature todo
app.use('/todo', todoRoute);

app.use(errorMiddleware);

app.listen(8888, () => console.log('server running on port 8888'));

// register, login, change-password
// /register => /user/register
// /login => /user/login
//  /chage-password => /user/change-password
// create, get, delete todo
// /create-todo => /todo POST
// /delete-todo => /todo/:idToDelete
// /get-todo => /todo GET
