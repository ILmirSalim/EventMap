const { Router } = require('express')
const userController = require('../controllers/userController')
const eventController = require('../controllers/eventController')
const { body } = require("express-validator")
const multer = require('multer');
const path = require('path');
// const { Request } = require('express');
// const { DiskStorageOptions } = require('multer');
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

// const storage: DiskStorageOptions = {
//   destination: (req: Request, file: Express.Multer.File, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req: Request, file: Express.Multer.File, cb) => {
//     const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
//     cb(null, uniqueFilename);
//   },
// };
// Инициализация multer с указанием хранилища
const upload = multer({ storage });

routes.post('/registration',
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
routes.post('/upload', upload.single('avatar'), userController.setAvatar)

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