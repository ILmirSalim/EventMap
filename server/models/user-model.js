const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    userName:{type: String, required: true},
    userAge:{type:String, required: true},
    email:{type: String, unique: true, required: true},
    password:{type: String, required: true},
    interestsAndPreferences: [{ type: String }],
    // isActivated:{type: Boolean, default: false},
    // activationLink:{type: String},
})

module.exports = model('User', UserSchema)
