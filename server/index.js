const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser')
const fileRouter = require('./routes/file.routes')
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/user-model')

require('dotenv').config()

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

app.use(express.static('public'));

const usersOnl = []
io.on('connection', function (socket) {
  console.log(`${socket.id} пользователь подключен`);

  socket.on('disconnect', function () {
    console.log(`${socket.id} пользователь отключился`);
    // usersOnl = usersOnl.filter((user) => user.socketID !== socket.id);
    // io.emit('responseNewUser', usersOnl);
  });

  socket.on('chat message', function (data) {
    if (data.userId) {
      // Отправляем сообщение конкретному пользователю
      socket.to(data.userId).emit('response', data); // Используем socket.to вместо io.to
    } else {
      // Рассылаем сообщение всем подключенным пользователям
      io.emit('response', data);
    }

  });

  socket.on('newUser', (data) => {
    usersOnl.push(data)
    io.emit('responseNewUser', usersOnl)
  })

});
// //   socket.on('create event', function (event) {

// //     io.emit('responceEvent', event);

// //   });

//   // socket.on('authenticate', (data) => {
//   //   const user = {
//   //       id: socket.id,
//   //       name: data.name,
//   //   };

//   //   users.push(user);
// });

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api', routes)
app.use('/api/files', fileRouter)
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}.${path.extname(file.originalname)}`
    cb(null, uniqueFilename);
  },
})
// Инициализация multer с указанием хранилища
const upload = multer({ storage });

app.post('/api/upload', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.body._id;
    const file = req.file;
    const { path } = file;
    if (!file) {
      throw new Error('Файл не загружен');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: path,
        avatarPath: path
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('Пользователь не найден');
    }

    await updatedUser.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера',
    });
  }
});

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