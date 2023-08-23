const { Router } = require('express')
const userController = require('../controllers/userController')
const eventController = require('../controllers/eventController')
const { check, body } = require("express-validator")
const authMiddleware = require("../middlewares/authMiddleware")
const imageMiddlware = require('../middlewares/imageUploads')
const multer = require('multer');
const path = require('path');
const routes = new Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // папка, куда будут сохраняться аватары
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}.${path.extname(file.originalname)}`); // уникальное имя файла с расширением
    }
  });
  
  // Инициализация multer с указанием хранилища
  const upload = multer({ storage });

routes.post('/registration',
    imageMiddlware.single('avatar'),
    body('userName').not().isEmpty(),
    body('userAge').not().isEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 20 }),
    userController.registration)
routes.post('/login', userController.loginTwo)
routes.post('/logout', userController.logout)
routes.post('/recoverPassword', userController.recoverPassword)
routes.delete('/deleteUser', userController.deleteUser)
// routes.post('/api/upload', upload.single('avatar'), userController.setAvatar)

routes.post('/newevent', eventController.addEvent)
routes.delete('/deleteEvent', eventController.deleteEvents)
routes.get('/events', eventController.getAllEvents)
routes.post('/addUserEvent', eventController.addUserToEvent)
routes.post('/search', eventController.searchEvents);
routes.post('/addUserToEvent', eventController.addUserToEvent)
routes.post('/addFeedbackToEvent', eventController.addFeedbackToEvent)
routes.post('/removeUserFromEvent', eventController.removeUserFromEvent)
routes.post('/getEventsByUserId', eventController.getEventsByUserId)

module.exports = routes