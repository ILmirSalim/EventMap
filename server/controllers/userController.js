const userService = require('../service/user-service')
// const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')

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
            const { email, password, userName, userAge, interestsAndPreferences} = req.body;
            const userData = await userService.registration(email, password, userName, userAge, interestsAndPreferences );
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)


        } catch (e) {
            console.log(e)
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

    async registrationUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким именем существует' })
            }
            const hashPassword = await bcrypt.hash(password, 7)
            const user = new User({ username, password: hashPassword })
            await user.save()
            return res.json({ message: 'Пользователь успешно зарегистрирован' })
        } catch (e) {
            console.log(e)
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
            return res.json({token})
        } catch (e) {
            console.log(e)
        }
    };

    async logout(req, res, next) {
        try {
          const {refreshToken} = req.cookies;
          const token = await userService.logout(refreshToken)
          res.clearCookie('refreshToken')
          return res.json(token)
        } catch (e) {
          next(e)
        }
      };

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            console.log(e);

        }
    };

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            console.log(e);
        }
    };

    async getUsers(req, res, next) {
        try {

        } catch (e) {


        }
    };

}
module.exports = new UserController()