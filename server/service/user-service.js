const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const fileService = require('../service/fileService')
const file = require('../models/avatar-model')

class UserService {

    async registration(email, password, userName, userAge, interestsAndPreferences, avatar) {
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        
        // const activationLink = uuid.v4()
        // const user = await UserModel.create({ email, password: hashPassword,})
        const user = await UserModel.create({ 
            userName,
            userAge,
            email, 
            password: hashPassword,
            interestsAndPreferences,
          })
        // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        // console.log(`${process.env.API_URL}/api/activate/${activationLink}`);
          await fileService.createDir(new File({user: user.id}))
        // const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ user });
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, user}
    }

    // async activate(activationLink) {
    //     const user = await UserModel.findOne({activationLink})
    //     if(!user) {
    //         throw new Error('Некорректная ссылка активации')
    //     }
    //     user.isActivated = true;
    //     await user.save()
    // }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: `Пользователь ${email} не найден ` })
        }
        const isPassEquals = await bcrypt.compare(password, user.password) //расшифровываем пароль и сравниваем с паролем пользователя
        if (!isPassEquals) {
            return res.status(400).json({ message: `Некорректный пароль ` })
        }
        // const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ user });
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, user }

    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            return res.status(400).json({ message: `Пользователь не авторизован` })
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromOb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromOb) {
            return res.status(400).json({ message: `Пользователь не авторизован` })
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

}

module.exports = new UserService()