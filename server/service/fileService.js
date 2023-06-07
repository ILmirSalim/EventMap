const fs = require('fs')
const file = require('../models/avatar-model')
const config = require('../config/default.json')

class FileServer {

    createDir(file) {
        return new Promise(((resolve, reject) => {
            const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`
            try {
                if(!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message:'file was created'})
                }
            } catch (error) {
                return reject({ message: 'File error' })
            }
        }))
    }
}

module.exports = new FileServer()