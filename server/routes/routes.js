const { Router } = require('express')
const userController = require('../controllers/userController')
const eventController = require('../controllers/eventController')
const { check, body } = require("express-validator")
const authMiddleware = require("../middlewares/authMiddleware")
const imageMiddlware = require('../middlewares/imageUploads')
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const routes = new Router()

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
routes.get('/getUser', userController.getUserinDatabase)
// routes.post('/api/upload', upload.single('avatar'), userController.setAvatar)

// routes.post('/newevent', eventController.addEvent)
routes.post('/newevent', upload.single('image'), eventController.addEvent)
routes.delete('/deleteEvent', eventController.deleteEvents)
routes.get('/events', eventController.getAllEvents)
routes.post('/addUserEvent', eventController.addUserToEvent)
routes.put('/updateEvent', eventController.updateEvent)
routes.post('/search', eventController.searchEvents);
routes.post('/addUserToEvent', eventController.addUserToEvent)
routes.post('/addFeedbackToEvent', eventController.addFeedbackToEvent)
routes.post('/removeUserFromEvent', eventController.removeUserFromEvent)
routes.post('/getEventsByUserId', eventController.getEventsByUserId)

module.exports = routes