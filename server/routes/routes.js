const { Router } = require('express')
const userController = require('../controllers/userController')
const eventController = require('../controllers/eventController')
const { check, body } = require("express-validator")
const authMiddleware = require("../middlewares/authMiddleware")

const routes = new Router()

// routes.post('/registration', [
//     check("username", "Имя пользователя не может быть пустым").notEmpty(),
//     check("password", "Пароль должен быть не меньше 4 и не больше 10 символов").isLength({min:4, max:10})
// ], userController.registrationUser)
// routes.post('/login', userController.login) 
routes.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 20 }),
    userController.registration)
routes.post('/login', userController.loginTwo)
routes.post('/logout', userController.logout)
routes.get('/activate/:link', userController.activate)  
routes.get('/refresh', userController.refresh)
// routes.get('/users', userController.getUsers)

routes.post('/newevent', eventController.addEvent)
routes.get('/events', eventController.getAllEvents)
routes.post('/filterevents', eventController.filterEvents)

module.exports = routes