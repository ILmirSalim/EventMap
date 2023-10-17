const userService = require('../service/user-service.ts')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('../config.ts')
const User = require('../models/user-model.ts')
import { Response } from 'express';

const generateAccessToken = (id:string) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

type RegistrationRequestBody = {
    _id?: string,
    email: string;
    password: string;
    userName: string;
    userAge: number;
    interestsAndPreferences: string[];
   
};

type ReqFile = Express.Multer.File & { path: string };

export interface TypedRequestBody<T> extends Express.Request {
    body: T
    file?: ReqFile
    query?: any
    cookies: string
    
}

class UserController {

    async registration(req: TypedRequestBody<RegistrationRequestBody>, res: Response, next: Function) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return console.log('Ошибка при регистрации')
            }

            if (req.body) {
                const { email, password, userName, userAge, interestsAndPreferences } = req.body;
                const userData = await userService.registration(email, password, userName, userAge, interestsAndPreferences);

                return res.json(userData)          
            }
        } catch (e) {
            console.log(e)
        }
    };

    async setAvatar(req: TypedRequestBody<RegistrationRequestBody>, res:Response) {
        try {
            const userId = req.body._id;
            const file = req.file;
            if (file) {
                const { path } = file;
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        avatar: path,
                        avatarPath: path
                    },
                    { new: true }
                );
    
                if (!updatedUser) {
                    throw new Error('Пользователь не найден');
                }
    
                await updatedUser.save();
    
                res.json(updatedUser);
            }
            // const { path } = file;
            if (!file) {
                throw new Error('Файл не загружен');
            }
            
        } catch (error) {
            console.error('Произошла ошибка при сохранении аватара:', error);
        }
    }

    async deleteUser(req: TypedRequestBody<{ email: string }>, res: Response) {
        try {
            if (req.body) {
                const { email } = req.body
                await userService.deleteUser(email)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async recoverPassword(req: TypedRequestBody<{ email: string }>, res: Response) {
        try {
            const { email } = req.body;
            const newPassord = await userService.recoverPassword(email);

            return res.json(newPassord)
        } catch (e) {
            console.log(e)
            res.send({ message: "Server error" })
        }
    };

    async loginTwo(req: TypedRequestBody<{ email: string, password: string }>, res: Response, next:Function) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (error) {

        }
    }

    async login(req: TypedRequestBody<{ username: string, password: string }>, res: Response, next:Function) {
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

    async logout(req: TypedRequestBody<{ refreshToken: string }>, res: Response) {
        try {
            const refreshToken  = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            console.log(e);
        }
    };

    async getUserinDatabase(req: TypedRequestBody<{ email: string, password: string }>, res: Response) {
        try {
            const email = req.query.email;
            console.log('email in getUser', email);
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