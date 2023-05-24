const {Schema, model} = require('mongoose')

const EventSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    location: {
      type: {type: String, enum: ['Point'], required: true,},
      coordinates: {type: [Number],required: true,},
    },
  });

module.exports = model('Event', EventSchema)
