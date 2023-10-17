const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
// const UserDto = require('../dtos/user-dto')

class UserService {

    async registration(email:string, password:string, userName:string, userAge:number, interestsAndPreferences:string[]) {
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hasNameUser = await UserModel.findOne({ userName })
        if (hasNameUser) {
            throw new Error(`Пользователь с именем ${userName} уже существует, необходимо уникальное значение`)
        }
        const hashPassword = await bcrypt.hash(password, 3)

        const user = await UserModel.create({
            userName,
            userAge,
            email,
            password: hashPassword,
            interestsAndPreferences,
        })

        const tokens = tokenService.generateTokens({ user });
        await tokenService.saveToken(user.id, tokens.refreshToken);
        
        return { ...tokens, user }
    }
    async recoverPassword(email:string) {
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

    async deleteUser(email:string) {
        await UserModel.findOneAndDelete({ email });
        return console.log('Пользователь удален!');;
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async login(email:string, password:string) {
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw new Error(`Пользователь ${email} не найден `)
        }
        const isPassEquals = await bcrypt.compare(password, user.password) //расшифровываем пароль и сравниваем с паролем пользователя
        if (!isPassEquals) {
            throw new Error(`Некорректный пароль `)
        }
        // const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ user });
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, user }

    }

    async refresh(refreshToken:string) {
        if (!refreshToken) {
            throw new Error(`Пользователь не авторизован`)
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromOb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromOb) {
            throw new Error( `Пользователь не авторизован`)
        }
        const user = await UserModel.findById(userData.id);
        // const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...user });
        await tokenService.saveToken(user.id, tokens.refreshToken);
        
        return { ...tokens, user: user }
    }

    async getUser(email:string) {
        const user = await UserModel.findOne({ email })

        if (!user) {
            throw new Error(`Пользователь ${email} не найден `)
        }
        return { user }
    }
}

module.exports = new UserService()