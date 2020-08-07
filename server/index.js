const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const router = require('./router');
const {
  users,
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./users');

io.on('connection', (socket) => {
  console.log('we have a new connection');

  socket.on('joined', ({ name, room }, callback) => {
    console.log(name, room);
    const { user, error } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }
    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room, ${user.room}!`,
    });

    socket.broadcast.to(user.room).emit('message', {
      admin: 'admin',
      text: `${user.name} has joined the chat!`,
    });

    socket.join(user.room);

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const userIndex = getUser(socket.id);

    io.to(users[userIndex].room).emit('message', {
      user: users[userIndex].name,
      text: message,
    });
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left the chat`,
      });
    }
  });
});

server.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);

app.use(router);
app.use(cors());
