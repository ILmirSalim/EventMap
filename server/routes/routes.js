const { Router } = require('express')
const userController = require('../controllers/userController')
const eventController = require('../controllers/eventController')
const { check, body } = require("express-validator")
const authMiddleware = require("../middlewares/authMiddleware")
const imageMiddlware = require('../middlewares/imageUploads')

const routes = new Router()

routes.post('/registration',
    imageMiddlware.single('avatar'),
    body('userName').not().isEmpty(),
    body('userAge').not().isEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 20 }),
    userController.registration)
routes.post('/login', userController.loginTwo)
routes.post('/logout', userController.logout)
// routes.get('/users', userController.getUsers)

routes.post('/newevent', eventController.addEvent)
routes.get('/events', eventController.getAllEvents)
routes.post('/addUserEvent', eventController.addUserToEvent)
// routes.get('/searchevents', eventController.searchEvents);
routes.post('/search', eventController.searchEventsByCategory);
routes.post('/filterevents', eventController.filterEvents)
routes.post('/addUserToEvent', eventController.addUserToEvent)
routes.post('/addFeedbackToEvent', eventController.addFeedbackToEvent)
routes.post('/removeUserFromEvent', eventController.removeUserFromEvent)
routes.post('/getEventsByUserId', eventController.getEventsByUserId)

module.exports = routes