const { ObjectId } = require('mongodb');
const { Schema, model  } = require('mongoose')
const UserSchema = new Schema({
    userName: { type: String, unique: true, required: true },
    userAge: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    interestsAndPreferences: [{ type: String }],
    messages: [{
        user: { type: String },
        message: { type: String }
      }],
    diskSpace: { type: Number },
    usedSpace: { type: Number },
    avatar: {type:String},
    avatarPath:{type:String},
})

module.exports = model('User', UserSchema);

