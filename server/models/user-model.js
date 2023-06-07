
const { ObjectId } = require('mongodb');
const { Schema, model  } = require('mongoose')
const UserSchema = new Schema({
    userName: { type: String, required: true },
    userAge: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    interestsAndPreferences: [{ type: String }],
    diskSpace: { type: Number },
    usedSpace: { type: Number },
    avatar: {type:String},
    files: [{type: ObjectId, ref: "File" }]
})

module.exports = model('User', UserSchema);
// const upload = multer({
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5 MB (в байтах)
//     }
// });

// module.exports = {
//     User: model('User', UserSchema),
//     upload: upload // добавляем middleware в экспорт модуля
 // isActivated:{type: Boolean, default: false},
    // activationLink:{type: String},
// };
