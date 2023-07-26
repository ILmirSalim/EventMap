const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const fileService = require('../service/fileService')
const file = require('../models/avatar-model')

class UserService {

    async registration(email, password, userName, userAge, interestsAndPreferences) {
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3)

        const user = await UserModel.create({
            userName,
            userAge,
            email,
            password: hashPassword,
            interestsAndPreferences,
        })
        // await fileService.createDir(new File({ user: user.id }))
        // const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ user });
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, user }
    }
    async recoverPassword(email) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`Пользователь с почтовым адресом ${email} не найден`);
        }

        const newPassword = Math.random().toString(36).substring(2, 10); // генерация случайного нового пароля

        const hashPassword = await bcrypt.hash(newPassword, 3);
        user.password = hashPassword;
        await user.save();

        console.log(`Восстановленный пароль для пользователя ${user.email}: ${newPassword}`);

        return newPassword;
    }

    async deleteUser(email) {
        const user = await UserModel.findOneAndDelete({ email });
        console.log('emai -', email);
       
        return console.log('Пользователь удален!');;
    }

    async updateUserAvatar(email) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { email: email },
                { avatar: url },
                { new: true }
            );
            return updatedUser
        } catch (error) {
            console.error('Произошла ошибка при сохранении аватара:', error);
        }
    }

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