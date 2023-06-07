const { ObjectId } = require('mongodb');
const { Schema, model } = require('mongoose')

const File = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    accessLink: { type: String },
    size: { type: Number, default: 0 },
    path: { type: String },
    user: { type: ObjectId, ref: 'User' },
    parent: { type: ObjectId, ref: 'UserAvatar' },
    childs: [{ type: ObjectId, ref: 'UserAvatar' }]
});

module.exports = model('File', File);
