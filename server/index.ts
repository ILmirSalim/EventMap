const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser')
import * as SocketIO from 'socket.io';

require('dotenv').config()

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

app.use(express.static('public'));
interface IUserOnlain {
  user: string,
  socketID: string;
  email: string;
}
const usersOnl: IUserOnlain[] = [];
io.on('connection', function ( socket: SocketIO.Socket) {
  console.log(`${socket.id} пользователь подключен`);

  socket.on('disconnect', function () {
    console.log(`${socket.id} пользователь отключился`);
    // usersOnl = usersOnl.filter((user) => user.socketID !== socket.id);
    // io.emit('responseNewUser', usersOnl);
  });

  socket.on('chat message', function (data) {
      io.emit('response', data);
  });

  socket.on('newUser', (data:IUserOnlain) => {
    usersOnl.push(data)
    io.emit('responseNewUser', usersOnl)
  })
  
  socket.on('create event', function (event) {
    io.emit('responceEvent', event);
  });

  socket.on('update event', function (updateEvent) {
    io.emit('set update event', updateEvent);
  });
});

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api', routes)
app.use(express.static('uploads'));

const PORT = process.env.PORT || 3001

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT)
    http.listen(PORT, () => console.log(`Server started on port - ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()