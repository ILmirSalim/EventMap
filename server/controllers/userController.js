const userService = require('../service/user-service')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const fileSerevice = require('../service/fileService')
const file = require('../models/avatar-model')

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

class UserController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }
            const { email, password, userName, userAge, interestsAndPreferences } = req.body;

            const userData = await userService.registration(email, password, userName, userAge, interestsAndPreferences);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)

        } catch (e) {
            console.log(e)
            res.send({ message: "Server error" })
        }
    };

    async setAvatar(req, res) {
        try {
            const { email } = req.body.email
            const user = await userService.updateUserAvatar(email)
            return res.json(user)
        } catch (error) {
            console.log(error)
            res.send({ message: "Error set avatar" })
        }
    }

    async deleteUser(req, res) {
        try {
            const { email } = req.body
            await userService.deleteUser(email)
            
        } catch (error) {
            console.log(error)
            res.send({ message: "Error delete user" })
        }
    }

    async recoverPassword(req, res) {
        try {

            const { email } = req.body;

            const newPassord = await userService.recoverPassword(email);

            return res.json(newPassord)

        } catch (e) {
            console.log(e)
            res.send({ message: "Server error" })
        }
    };

    async loginTwo(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)

        } catch (error) {

        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден ` })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: `Введен неверный пароль ` })
            }
            const token = generateAccessToken(user._id)
            return res.json({ token })
        } catch (e) {
            console.log(e)
        }
    };

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    };
    
    async getUserinDatabase(req, res, next) {
        try {
            const { email } = req.body;
            console.log(email);
            const userData = await userService.getUser(email);
            console.log(userData);
            return res.json(userData)
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    };




}
module.exports = new UserController()